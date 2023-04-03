let Usuario = require("../models/usuario.model");
const connection = require("../connectionDB/connectionDB");


module.exports = {

    list: async (req, res) => {
        try {
            await connection();
            const usuarios = await Usuario.find({});
            res.render("usuarios/index", { usuarios: usuarios });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error });
        }
    },

    update_get: async (req, res) => {

        try {
            const usuario = await Usuario.findById(req.params.id);
            res.render("usuarios/update", { usuario: usuario });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error });
        }
    },
    update: async (req, res) => {
        let update_values = { nombre: req.body.nombre };
        try {
            await Usuario.findByIdAndUpdate(req.params.id, update_values);
            res.redirect("/usuarios");
        } catch (error) {
            console.log(error);
            res.render("usuarios/update", { error: error.errors, usuario: new Usuario({ nombre: req.body.nombre, email: req.body.email }) });
        }
    },

    create_get: async (req, res) => {
        res.render("usuarios/create", { errors: {}, usuario: new Usuario() });
    },
    create: async (req, res) => {

        if (req.body.password != req.body.confirm_password) {
            res.render("usuarios/create", { errors: { confirm_password: { message: "No coincide con el password ingresado" } }, usuario: new Usuario({ nombre: req.body.nombre, email: req.body.email }) });          
            return
        }
        try {
            const nuevoUsuario = await Usuario.create({ nombre: req.body.nombre, email: req.body.email, password: req.body.password, confirm_password: req.body.confirm_password });
            await nuevoUsuario.enviar_email_bienvenida();
            res.redirect("/usuarios");

        } catch (error) {
            console.log(error);
            res.render("usuarios/create", { errors: error.errors, usuario: new Usuario({ nombre: req.body.nombre, email: req.body.email }) });
        }
    },

    delete: async (req, res, next) => {
        try{
            await Usuario.findByIdAndDelete(req.body.id);
            res.redirect("/usuarios");
        } catch (error) {
            next(error);
        }
    }

}

