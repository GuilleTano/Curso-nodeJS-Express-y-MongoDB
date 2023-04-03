const mongoose = require("mongoose");
const moment = require("moment");
const { Schema } = mongoose; 

const reservaSchema = new Schema({
    desde: Date,
    hasta: Date,
    bicicleta: {type: mongoose.Schema.Types.ObjectId, ref: "Bicicleta"},
    usuario: {type: mongoose.Schema.Types.ObjectId, ref: "Usuario"}
});

reservaSchema.methods.diasDeReserva = function(){
    return moment(this.hasta).diff(moment(this.desde), "days") + 1;
}

const ReservaModel = mongoose.model("Reserva", reservaSchema);
module.exports = ReservaModel;