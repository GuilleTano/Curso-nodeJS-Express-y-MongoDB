const mongoose = require("mongoose");
//const Schema = mongoose.Schema;
const { Schema } = mongoose; //Es lo mismo que lo de arriba pero desestructurado

const BiciSchema = new Schema({
    code: Number,
    color: String,
    modelo: String,
    ubicacion: {
        type: [Number], index: { type: "2dsphere", sparse: true }
    }
});

BiciSchema.statics.createInstance = function (code, color, modelo, ubicacion) {
    return new this({
        code: code,
        color: color,
        modelo: modelo,
        ubicacion: ubicacion
    });
}

BiciSchema.methods.toString = function () {
    return "code: " + this.code + "| color: " + this.color;
}

/* (!) mongoose v5 ya no utiliza callbacks en sus metodos, por lo que los modifique para manejar Promesas
BiciSchema.statics.allBicis = function(cb){
    return this.find({}, cb);
}
*/

BiciSchema.statics.allBicis = function () {
    return new Promise((resolve, reject) => {
        this.find({})
            .then(bicis => resolve(bicis))
            .catch(err => reject(err));
    });
}

BiciSchema.statics.add = function (bici) {
    return new Promise((resolve, reject) => {
        this.create(bici)
            .then(() => {
                this.allBicis()
                    .then(bicis => {
                        this.bicis = bicis;
                        resolve();
                    })
                    .catch(err => reject(err));
            })
            .catch(err => reject(err));
    });
};

BiciSchema.statics.findByCode = function (aCode) {
    return this.findOne({ code: aCode });
}

BiciSchema.statics.removeByCode = function (aCode) {
    return new Promise((resolve, reject) => {
        this.findOneAndDelete({ code: aCode })
            .then(() => this.allBicis())
            .then(bicis => {
                this.allBicis = bicis;
                resolve();
            })
            .catch(err => reject(err));
    });
}



const BiciModel = mongoose.model("Bicicleta", BiciSchema);
module.exports = BiciModel;