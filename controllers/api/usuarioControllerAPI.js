const connection = require("../../connectionDB/connectionDB");
const Usuario = require("../../models/usuario.model");

// Problemas con los callbacks, parte 2
/* exports.usuarios_list = function(req, res){
    Usuario.find({}, function(err, usuarios){
        res.status(200).json({
            usuarios: usuarios
        });
    });
}
*/

exports.usuarios_list = async (req, res) => {
    try {
      await connection();
      const usuarios = await Usuario.find({});
      res.status(200).json({ usuarios });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error });
    }
};
  
/*exports.usuarios_list = function(req, res){
    Usuario.find({})
    .then(usuarios => {
        res.status(200).json({
            usuarios: usuarios
        });
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({
            error: error
        });
    });
}
*/

/* exports.usuarios_create = function(req, res){
    const usuario = new Usuario({nombre: req.body.nombre});

    usuario.save(function(err){
        res.status(200).json(usuario);
    });
}
*/

exports.usuarios_create = function(req, res){
    const usuario = new Usuario({nombre: req.body.nombre});
    usuario.save()
    .then(() =>{
        res.status(200).json(usuario);
    })
    .catch(error =>{
        console.log(error);
        res.status(500).json({
            error: error
        });
    });
}

/* exports.usuario_reservar = function(req, res){
    Usuario.findById(req.body.id, function(err, usuario){
        console.log(usuario);
        usuario.reservar(req.body.bici_id, req.body.desde, req.body.hasta, function(err){
            console.log("reserva !!!");
            res.status(200).send();
        });
    });

}
*/

exports.usuario_reservar = function(req, res){
    Usuario.findById(req.body.id)
    .then(usuario =>{
        console.log(usuario);
        usuario.reservar(req.body.bici_id, req.body.desde, req.body.hasta);
    })
    .then(()=>{
        console.log("reserva !!!");
        res.status(200).send();
    })
    .catch(error =>{
        console.log(error);
        res.status(500).json({
            error: error
        });
    });
}