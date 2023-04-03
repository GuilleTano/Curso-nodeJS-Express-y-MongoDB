const Usuario = require("../models/usuario.model");
const Token = require("../models/token");

module.exports = {
    
    confirmationGet: async function(req, res){
        try {
            const token = await Token.findOne({token: req.params.token});
            if(!token) return res.status(400).send({type: "not-verified", msg: "No econtramos un usuario con ese token, quizá alla expirado y debas solicitar uno nuevo"});
            
            const usuario = await Usuario.findById(token._userId);
            if(!usuario) return res.status(400).send({msg: "No econtramos un usuario con ese token"});
            if(usuario.verificado) return res.redirect("/usuarios");
            
            usuario.verificado = true;
            await usuario.save();
            
            res.redirect("/");
        } catch (err){
            return res.status(500).send({msg: err.message});
        }
    }

}