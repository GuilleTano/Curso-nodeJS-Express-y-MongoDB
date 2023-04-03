const mongoose = require("mongoose");
const { Schema } = mongoose;
const Reserva = require("./reserva.model");
const bcrypt = require("bcrypt"); // Paquete para encripar strings
const saltRounds = 10;  // saltRounds le da cierta alateoridad a la encriptacion
//const uniqueValidator = require("mongoose-unique-validator"); // Dependencia no compatible con la version 7 de mongoose | Instalada a la fuerza
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const crypto = require('crypto');
const Token = require("../models/token");
const mailer = require("../mailer/mailer");


// Metodo para verificar que el email del usuario sea en formato valido
const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

const userSchema = new Schema({
    nombre: {
        type: String,
        trim: true, // Elimina los espacios en el inicio o el fin del nombre
        required: [true, "El nombre es obligatorio"]
    },
    email: {
        type: String,
        trim: true,
        required: [true, "El email es obligatorio"],
        lowercase: true,
        unique: true,
        validate: [validateEmail, "Por favor, ingrese un email valido"],
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/] // Además del metodo validateEmail usamos esta opcion para matchear con estos caracteres
    },
    password: {
        type: String,
        required: [true, "El password es obligatorio"]
    },
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    verificado: {
        type: Boolean,
        default: false
    }
});

userSchema.pre("save", function (next) { // Con el metodo .pre le estamos diciendo que antes de ejecutar un evento save, corra la funcion que esta alli
    if (this.isModified("password")) {
        this.password = bcrypt.hashSync(this.password, saltRounds);
    }
    next();
});

// Este metodo compara la clave que ingresa el usuario con la que esta guardada en su usuario
userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

// Los plugin son formas de agregar librerias que no son parte de mongoose y asi incorporarlas al modelo, por ejemplo
userSchema.plugin(beautifyUnique, { message: "El {PATH} ya existe con otro usuario" });

// Metodo para realizar reservas
userSchema.methods.reservar = function (biciID, desde, hasta) {
    let reserva = new Reserva({ usuario: this._id, bicicleta: biciID, desde: desde, hasta: hasta });
    console.log(reserva);
    reserva.save();
}

// Enviar el mail de verificacion de cuenta
userSchema.methods.enviar_email_bienvenida = async function () {
    const token = new Token({ _userId: this.id, token: crypto.randomBytes(16).toString("hex") });
    const email_destination = this.email;

    try {
        await token.save();

        const mailOptions = {
            from: "no-replay@redbicicletas.com",
            to: email_destination,
            subject: "Verificacion de cuenta",
            text: "Hola, \n\n" + "Por favor, para verificar su cuenta haga click en este enlace: \n" + "http://localhost:3000" + "\/token/confirmation\/" + token.token + ".\n"
        }

        await mailer.sendMail(mailOptions);

        console.log("A verification email has been sent to " + email_destination);
    }
    catch (err) {
        console.log(err.message);
    }
}

// METODO PARA RESTABLECER LA CONSTRASEÑA (NO PROBADO)

userSchema.methods.resetPassword = async function () {
    const token = new Token({ _userId: this.id, token: crypto.randomBytes(16).toString("hex") });
    const email_destination = this.email;

    try {

        await token.save();

        const mailOptions = {
            from: "no-replay@redbicicletas.com",
            to: email_destination,
            subject: "Reseteo de contraseña",
            text: "Hola, \n\n" + "Por favor, para resetear la contraseña de su cuenta haga click en este link: \n" +
                "http://localhost:3000" + "\/resetPassword\/" + token.token + ".\n"
        }

        await mailer.sendMail(mailOptions);

        console.log("Se envió un mail para resetear la contraseña a: " + email_destination + ".");
        
    } catch (err) {
        console.log(err.message);
    }

}

/*userSchema.methods.resetPassword = function(cb) {
    const token = new Token({_userId: this.id, token: crypto.randomBytes(16).toString("hex")});
    const email_destination = this.email;
    token.save(function(err){
        if (err) {return cb(err)}

        const mailOptions = {
            from: "no-replay@redbicicletas.com",
            to: email_destination,
            subject: "Reseteo de contraseña",
            text: "Hola, \n\n" + "Por favor, para resetear la contraseña de su cuenta haga click en este link: \n" + 
            "http://localhost:3000" + "\/resetPassword\/" + token.token + ".\n"
        }

        mailer.sendMail(mailOptions, function (err){
            if (err) {return cb(err)}

            console.log("Se envió un mail para resetear la contraseña a: " + email_destination + ".");
        });

        cb(null);
    });
}
*/


const UserModel = mongoose.model("Usuario", userSchema);
module.exports = UserModel;