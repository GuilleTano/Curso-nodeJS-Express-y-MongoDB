const mailer = require('nodemailer');


// Configuración de Nodemailer
const transporter = mailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'waino.graham@ethereal.email',
        pass: 'xV9yX7axXEDVMBCydf'
    }
});

module.exports = transporter;