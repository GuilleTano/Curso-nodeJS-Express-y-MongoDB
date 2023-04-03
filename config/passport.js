const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Usuario = require("../models/usuario.model");
const connection = require("../connectionDB/connectionDB");

passport.use(new LocalStrategy({
  usernameField: 'email'
}, async (email, password, done) => {
  try {

    await connection();
    const usuario = await Usuario.findOne({ email: email });

    if (!usuario) {
      console.log("Usuario no existe");
      return done(null, false, { message: 'Email no existe o incorrecto' });
    }
    if (!usuario.validPassword(password)) {
      console.log("Error de password");
      return done(null, false, { message: 'Contraseña incorrecta' });
    }

    console.log("Salió del Local Strategy: ");
    return done(null, usuario);
  } catch (err) {
    done(err);
  }

})
);

passport.serializeUser((usuario, done) => {
  done(null, usuario.id);
});

passport.deserializeUser(async (id, done) => {
  const usuario = await Usuario.findById(id);
  done(null, usuario);
});


module.exports = passport;
