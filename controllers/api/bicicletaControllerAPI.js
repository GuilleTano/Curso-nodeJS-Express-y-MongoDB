const connection = require("../../connectionDB/connectionDB");
const Bicicleta = require("../../models/bicicleta.model");

exports.bicicleta_list = async (req, res) => {
    try {
        // const bicicletas = await Bicicleta.allBicis;
        // suplanté el uso del metodo allBicis de Bicicleta ya que no estaba funcionando bien
        // de todos modos, no es necesario para este uso
        await connection();
        const bicicletas = await Bicicleta.find();
        res.status(200).json(bicicletas);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
}

// CREACION DE BICICLETA NUEVA
exports.bicicleta_create = async (req, res) => {
    try {
        const bici = Bicicleta.createInstance(req.body.code, req.body.color, req.body.modelo, req.body.ubicacion);
        await connection();
        await Bicicleta.add(bici);
        res.status(200).json({ bicicleta: bici });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
}

// ACTUALIZAR UNA BICICLETA
exports.bicicleta_update_get = function(req, res){
    let bici = Bicicleta.findById(req.body.id);

    res.status(200).json({
        bicicleta: bici
    });
}
exports.bicicleta_update_post = function(req, res){
    let bici = Bicicleta.findById(req.body.id);
    bici.id = req.body.id;
    bici.color = req.body.color;
    bici.modelo = req.body.modelo;
    bici.ubicacion = [req.body.lat, req.body.lng]

    res.status(200).json({
        bicicletas: Bicicleta.allBicis
    });
}

// ELIMINAR UNA BICICLETA
exports.bicicleta_delete = function(req, res){
    Bicicleta.removeById(req.body.id);
    res.status(204).send(); //El status 204 quiere decir que no hay contenido en la respuesta
}