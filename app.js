const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const passport = require("./config/passport");
const session = require("express-session");

const jwt = require("jsonwebtoken");

//NECESARIOS PARA EL RESETEO DE PASS ..............
const Usuario = require("./models/usuario.model");
const Token = require("./models/token");
//.................................................


// LLAMADO A LAS RUTAS CREADAS
const indexRouter = require('./routes/index');
const usuariosRouter = require('./routes/usuarios');
const bicicletasRouter = require('./routes/bicicletas.routers');
const tokenRouter = require('./routes/token');
//const sessionRouter = require("./routes/session.routers");

const bicicletasAPIRouter = require('./routes/api/bicicletas');
const usuariosAPIRouter = require('./routes/api/usuarios');
const authAPIRouter = require("./routes/api/authAPIrouter");

const store = new session.MemoryStore; // Guardamos la sesion en memoria del servidor

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.set("secretKey", "jwt_PWD_1223334444"); // secretKey para autenticacion usuario API

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use(session({
  cookie: { maxAge: 240 * 60 * 60 * 1000 }, // Configuramos duracion de la cookie (en este caso 10 días)
  store: store,
  saveUninitialized: true,
  resave: "true",
  secret: "red_bicis_!*/**!/!*!.56466879" // Es un codigo que se usa para generar la encriptacion del id de la cookie
}));
app.use(passport.initialize()); // Inicializamos passport
app.use(passport.session()); // Usamos la session


app.use(express.static(path.join(__dirname, 'public')));


// ********************* LOGIN (PASAR ESTO A UN CONTROLLER ?) *********************

app.get("/login", function (req, res) {
  res.render("session/login");
});

app.post('/login', async (req, res, next) => {
  try {
    passport.authenticate('local', async (err, user, info) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.render('session/login', { message: info.message });
      }

      req.logIn(user, function (err) {
        if (err) {
          return next(err);
        }
        console.log('Usuario autenticado correctamente');
        res.redirect('/');
      });
    })(req, res, next);
  } catch (err) {
    next(err);
  }
});

app.get("/logout", function (req, res) {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

app.get("/forgotPassword", function (req, res) {
  res.render("session/forgotPassword");
});

app.post("/forgotPassword", async function (req, res) {
  try {
    const usuario = await Usuario.findOne({email: req.body.email});
    // Si ingreso un mail que no existe da timeout, por que?
    if (!usuario){
      console.log("No existe un usuario con ese email");
      return res.render("session/forgotPassword", {info: {message: "No existe un usuario con ese email"}});
    }

    await usuario.resetPassword();
    console.log("session/forgotPasswordMessage");

    res.render("session/forgotPasswordMessage");
  } catch (error){
    console.log(error);
  }

});

app.get("/resetPassword/:token", async function(req, res){
  try {
    const token = await Token.findOne({token: req.params.token});
    if (!token){
      console.log("No existe usuario asociado al token. ¿Tal vez expiró?");
      return res.status(400).send({type: "not-verified", msg: "No existe usuario asociado al token. ¿Tal vez expiró?"});
    }
    const usuario = await Usuario.findById(token._userId);
    if (!usuario){
      console.log("No existe usuario asociado al token.");
      return res.status(400).send({msg: "No existe usuario asociado al token."});
    }

    res.render("session/resetPassword", {errors: {}, usuario: usuario});
  } catch(error){
    console.log(error);
  }
 
});

app.post("/resetPassword", async function(req, res){
  
  if(req.body.password != req.body.confirm_password) {
    res.render("session/resetPassword", {errors: {confirm_password: {message: "No coinciden las contraseñas"}},
    usuario: new Usuario({email: req.body.email})});
    return
  }

  try {
    const usuario = await Usuario.findOne({email: req.body.email});
    usuario.password = req.body.password;
    await usuario.save();

    res.redirect("/login");
  } catch (error){
    console.log(error);
    res.render("session/resetPassword", {errors: error.errors, usuario: new Usuario({email: req.body.email})});
  }

});

// MIDELWARE PARA VERIFICAR A LOS USUARIOS LOGUEADOS
function loggedIn(req, res, next) {
  if(req.user) {
    next();
  } else {
    console.log("usuario no logueado");
    res.redirect("/login");
  }
}

// ***************************************************************

// ******************* AUTENTICACION RUTAS DE LA API *******************

/*async function validarUsuarioAPI(req, res, next) {
  try{
    const decoded = await jwt.verify(req.headers["x-access-token"], req.app.get("secretKey"));
    req.body.userId = decoded.id;
    console.log("jwt verify: " + decoded);
    next();

  } catch (err){
    res.json({status:"error", message: err.message, data:null});
  }
}
*/

function validarUsuarioAPI(req, res, next) {
  jwt.verify(req.headers["x-access-token"], req.app.get("secretKey"), function(err, decoded){
    if (err){
      console.log(err);
      res.json({status:"error", message: err.message, data:null});
    } else {
      
      req.body.userId = decoded.id;
      console.log("jwt verify: " + decoded);
      next();
    }
  });
}


// *********************************************************************

// USO DE RUTAS DEFINIDAS EN EL SERVIDOR
app.use('/', indexRouter);
app.use('/usuarios', loggedIn, usuariosRouter);
app.use("/token", tokenRouter);
app.use('/bicicletas', loggedIn, bicicletasRouter);

// Rutas de sesion
//app.use("/session", sessionRouter);

// Rutas de API
app.use("/api/bicicletas", validarUsuarioAPI, bicicletasAPIRouter);
app.use("/api/usuarios", validarUsuarioAPI, usuariosAPIRouter);
app.use("/api/auth", authAPIRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
