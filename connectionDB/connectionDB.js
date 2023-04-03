const mongoose = require("mongoose");

const password = "xkRO3lansRukXIh1";
const uri = `mongodb+srv://user_bicicletasDB:${password}@clusterbicicletas.y84eljw.mongodb.net/test`;
const options = {dbName: "red_bicicletas"};

mongoose.set('strictQuery', true); // para el error que tira el mongoose

module.exports = ()=> mongoose.connect(uri, options);
