const mongoose = require("mongoose");
const connection = require("../../connectionDB/testDB");
const Bicicleta = require("../../models/bicicleta.model");
const Usuario = require("../../models/usuario.model");
const Reserva = require("../../models/reserva.model");

describe("Testing Usuarios", () => {

    // Realiza la conexion a la base de datos antes de cada test
    beforeEach(function (done) {
        connection().then(() => {
            console.log("Conexión a la base de datos establecida");
            done();
        }).catch((err) => {
            console.error("Error al conectar con la base de datos:", err);
            done();
        });
    });

    // Limpia la base de datos luego de cada test
    afterEach(function (done) {

        Bicicleta.deleteMany({})
        .then(function () {
            Reserva.deleteMany({})
            .then(function () {
                Usuario.deleteMany({})
                .then(function () {
                    done();
                }).catch(function (err) {
                    console.error('Error al eliminar documentos:', err);
                    done();
                });
            }).catch(function (err) {
                console.error('Error al eliminar documentos:', err);
                done();
            });
        })
        .catch(function (err) {
            console.error('Error al eliminar documentos:', err);
            done();
        });
    });

    // TEST DE LOS METODOS DEL MODELO 

    describe("Cuando el Usuario reserva una bici", ()=>{
        it("debe exisitir la reserva", ()=>{

            const usuario = new Usuario({nombre: "Ezequiel"});
            usuario.save();
            const bicicleta = new Bicicleta({code:1, color: "verde", modelo: "urbana"});
            bicicleta.save();

            let hoy = new Date();
            let mañana = new Date();
            mañana.setDate(hoy.getDate()+1);

            usuario.reservar(bicicleta.id, hoy, mañana, function(err, reserva){
                Reserva.find({}).populate("bicicleta").populate("usuario").exec(function(err, reservas){
                    console.log(reservas[0]);
                    expect(reservas.length).toBe(1);
                    expect(reservas[0].diasDeReserva()).toBe(2);
                    expect(reservas[0].bicicleta.code).toBe(1);
                    expect(reservas[0].usuario.nombre).toBe(usuario.nombre);
                });
            });
        });
    });

});