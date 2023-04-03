const mongoose = require("mongoose");
const connection = require("../../connectionDB/testDB");
const Bicicleta = require("../../models/bicicleta.model");


describe("Testing Bicicletas", () => {

    // (!) mongoose v5 ya no utiliza callbacks en sus metodos, por lo que modifique todos para manejar Promesas
    // Como estoy utilizando Promesas, no es necesario el done() luego de cada test
    // Solo debo usarlos en los metodos beforeEach y afterEach para evitar el error de timeout

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
                done();
            }).catch(function (err) {
                console.error('Error al eliminar documentos:', err);
                done();
            });
    });

    // TEST DE LOS METODOS DEL MODELO 

    describe("Bicicleta.createInstance", () => {
        it("crea una instancia de Bicicleta", () => {
            const bici = Bicicleta.createInstance(1, "verde", "urbana", [-34.5, -54.1]);

            expect(bici.code).toBe(1);
            expect(bici.color).toBe("verde");
            expect(bici.modelo).toBe("urbana");
            expect(bici.ubicacion[0]).toBe(-34.5);
            expect(bici.ubicacion[1]).toBe(-54.1);
        })
    });

    describe("Bicicleta.allBicis", () => {
        it("comienza vacia", () => {
            return Bicicleta.allBicis().then(function (bicis) {
                expect(bicis.length).toBe(0);
            }).catch(error => {
                console.log(error);
            });
        });
    });

    describe("Bicicleta.add", () => {
        it("agrega una bici", async () => {
            const aBici = new Bicicleta({ code: 1, color: "verde", modelo: "urbana" });

            await Bicicleta.add(aBici) // Se agrega la nueva bicicleta a la base de datos
                .then(() => {
                    return Bicicleta.allBicis(); // Se encarga de obtener todas las bicicletas de la base de datos
                })
                .then((bicis) => { // Se encarga de verificar que se haya agregado correctamente la nueva bicicleta
                    expect(bicis.length).toEqual(1);
                    expect(bicis[0].code).toEqual(aBici.code);
                })
                .catch((error) => {
                    console.log(error);
                });
        });
    });

    describe("Bicicleta.findByCode", () => {
        it("debe devolver la bici con code 1", async () => {
            const aBici = new Bicicleta({ code: 1, color: "verde", modelo: "urbana" });
            await Bicicleta.add(aBici);

            const aBici2 = new Bicicleta({ code: 2, color: "rojo", modelo: "montaña" });
            await Bicicleta.add(aBici2);

            const targetBici = await Bicicleta.findByCode(1);
            expect(targetBici.code).toBe(aBici.code);
            expect(targetBici.color).toBe(aBici.color);
            expect(targetBici.modelo).toBe(aBici.modelo);
        });
    });

    describe("Bicicleta.removeByCode", () => {
        it("debe eliminar la bici con code 1", async () => {
            const aBici = new Bicicleta({ code: 1, color: "verde", modelo: "urbana" });
            await Bicicleta.add(aBici);
            const aBici2 = new Bicicleta({ code: 2, color: "rojo", modelo: "montaña" });
            await Bicicleta.add(aBici2);

            await Bicicleta.removeByCode(1);
            expect(Bicicleta.allBicis.length).toBe(1);
        });
    });

});


// TEST DEL MODELO ANTES DE USAR MONGO

/*
// Este metodo de Jasmin hace que antes de comenzar cada test se cumpla lo que le solicitamos
// En este caso, igualar la coleccion a 0 o vacio
beforeEach(()=>{ Bicicleta.allBicis = []; });

// Es un grupo de test que van a hacer foco en un comportamiento puntual
// En este caso lo haremos en el metodo allBicis del modelo Bicicleta
describe("Bicicleta.allBicis", ()=>{
    // it viene a referir a qué es lo que quiero probar
    it("comienza vacia", ()=>{
        expect(Bicicleta.allBicis.length).toBe(0);
    })
});

// Test del metodo add
describe("Bicicleta.add", ()=>{
    it("agregamos una", ()=>{
        expect(Bicicleta.allBicis.length).toBe(0); // Chequeamos nuevamente si es 0 para asegurarnos antes del add

        let a = new Bicicleta(1, "rojo", "urbana", [-34.93317945514292, -56.160051162938544]);
        Bicicleta.add(a);

        expect(Bicicleta.allBicis.length).toBe(1); // Estado posterior al add
        expect(Bicicleta.allBicis[0]).toBe(a); // Le pedimos que verifique si esa bici es a
    })
});

// Test de findById
describe("Bicicleta.findById", ()=>{
    it("debe devolver la bici con id 1", ()=>{
        expect(Bicicleta.allBicis.length).toBe(0);

        let aBici = new Bicicleta(1, "verde", "urbana");
        let aBici2 = new Bicicleta(2, "naranja", "montaña");
        Bicicleta.add(aBici);
        Bicicleta.add(aBici2);

        let targetBici = Bicicleta.findById(1);
        expect(targetBici.id).toBe(1);
        expect(targetBici.color).toBe(aBici.color);
        expect(targetBici.modelo).toBe(aBici.modelo);
    })
});

// Test de removeById
describe("Bicicleta.removeById", ()=>{
    
    it("debe eliminar la bici con id 1", ()=>{
        expect(Bicicleta.allBicis.length).toBe(0);

        let aBici = new Bicicleta(1, "verde", "urbana");
        let aBici2 = new Bicicleta(2, "naranja", "montaña");
        Bicicleta.add(aBici);
        Bicicleta.add(aBici2);

        Bicicleta.removeById(1);
        
        expect(Bicicleta.allBicis.length).toBe(1);
    })
});
*/
