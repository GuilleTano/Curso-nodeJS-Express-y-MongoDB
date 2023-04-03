const connection = require("../../connectionDB/connectionDB");
const Usuario = require("../../models/usuario.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {

    authenticate: async function(req, res, next){

        try{
            await connection();
            const userInfo = await Usuario.findOne({email: req.body.email});

            if (userInfo === null) {
                return res.status(401).json({status:"error", message: "Invalido email/password", data:null});    
            }

            if (userInfo != null && bcrypt.compareSync(req.body.password, userInfo.password)){
 
                const token = jwt.sign({id: userInfo._id}, req.app.get("secretKey"), {expiresIn: "7d"});
                res.status(200).json({message:"usuario encontrado!", data:{usuario: userInfo, token:token}});

            } else {
                res.status(401).json({status:"error", message:"Invalido email/password", data:null});
            }
        } catch(error){
            console.log(error);
            next(error);
        }
    },

    forgotPassword: async function(req, res, next){

        try{
            const usuario = await Usuario.findOne({email: req.body,email});

            if (!usuario){
                return res.status(401).json({mesagge:"No existe el usuario", data:null});
            }

            await usuario.resetPassword();
            res.status(200).json({message:"Se envió un email para reestablecer la clave", data:null});
        } catch(error){
            next(error);
        }
    }
}