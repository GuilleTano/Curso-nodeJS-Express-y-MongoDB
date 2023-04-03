const mongoose = require("mongoose");
const Bicicleta = require("../../models/bicicleta.model");
const request = require("request"); // Para realizar el testeo de la API usaremos la dependencia request (*ya obsoleta segun su desarrollador)
const server = require("../../bin/www"); // Hacemos esto para incorporarlo a los test y asi no tener que levantar el servidor cada vez que se haga uno
//const { head } = require("request");

let api_url = "http://localhost:3000/api/bicicletas";

describe("Bicicleta API", () => {

    beforeEach(function (done) {
        connection().then(() => {
            console.log("Conexión a la base de datos establecida");
            done();
        }).catch((err) => {
            console.error("Error al conectar con la base de datos:", err);
            done();
        });
    });
    afterEach(function (done) {
        Bicicleta.deleteMany({})
            .then(function () {
                done();
            }).catch(function (err) {
                console.error('Error al eliminar documentos:', err);
                done();
            });
    });

    // TEST PARA LISTAR
    describe("GET BICICLETAS /", () => {
        it("Status 200", () => {
            request.get(api_url, function (error, response, body) {
                let result = JSON.parse(body);
                expect(response.statusCode).toBe(200);
                expect(result.bicicletas.length).toBe(0);
            });
        });
    });

    // TEST PARA CREAR
    describe("POST BICICLETAS /create", () => {
        it("Status 200", (done) => {
            let headers = { "content-type": "application/json" };
            let aBici = `{"id": 10, "color": "rojo", "modelo": "urbana", "lat" : -34, "lng": -56 }`;
            request.post({
                headers: headers,
                url: api_url + "/create",
                body: aBici
            }, function (error, response, body) {
                expect(response.statusCode).toBe(200);
                let bici = JSON.parse(body).bicicleta;
                console.log(bici);
                expect(bici.color).toBe("rojo");
                expect(bici.ubicacion[0]).toBe(-34);
                expect(bici.ubicacion[1]).toBe(-56);
            });
        });
    });

    // TEST PARA ELIMINAR
    describe('DELETE BICICLETAS /delete', () => {

        let a = new Bicicleta(4, "negro", "montaña", [-31, -56]);
        let b = new Bicicleta(5, "azul", "urbana", [-34, -50]);
        Bicicleta.add(a);
        Bicicleta.add(b);

        it('Eliminar bicicleta y devolver status 204', (done) => {
            let aID = `{"id": 4 }`;
            request.delete({
                headers: { "Content-Type": "application/json" },
                url: "http://localhost:3000/api/bicicletas/delete",
                body: aID
            }, function (error, response, body) {
                expect(response.statusCode).toBe(204);
                done();
            });
        });
    });


    // TEST PARA ACTUALIZAR
    describe('UPDATE_GET BICICLETAS /update', () => {

        it('Devuelve una bicicleta con el id especificado', (done) => {
            let a = new Bicicleta(1, "negro", "urbana", [-34, -56]);
            Bicicleta.add(a);

            let aID = `{"id": 1 }`;
            request.get({
                headers: { "content-type": "application/json" },
                url: "http://localhost:3000/api/bicicletas/update",
                body: aID
            }, function (error, response, body) {
                expect(response.statusCode).toBe(200);
                expect(Bicicleta.findById(1).color).toBe("negro");
                done();
            });
        });
    });
    describe('UPDATE_POST BICICLETAS /update', () => {

        it('Actualiza los datos de la bicicleta', (done) => {
            let a = new Bicicleta(1, "negro", "urbana", [-34, -56]);
            Bicicleta.add(a);

            let update = `{"id": 1, "color": "rojo", "modelo": "montaña", "lat" : -40, "lng": -52 }`;
            request.post({
                headers: { "content-type": "application/json" },
                url: "http://localhost:3000/api/bicicletas/update",
                body: update,
            }, function (error, response, body) {
                expect(response.statusCode).toBe(200);
                expect(Bicicleta.findById(1).color).toBe("rojo");
                expect(Bicicleta.findById(1).modelo).toBe("montaña");
                done();
            });
        });
    });

});
