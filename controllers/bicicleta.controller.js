const connection = require("../connectionDB/connectionDB");
const Bicicleta = require("../models/bicicleta.model");

// MOSTRAR LISTADO BICICLETAS:
/*exports.bicicleta_list = function(req, res){
    res.render("bicicletas/index", {bicis: Bicicleta.allBicis});
}
*/

exports.bicicleta_list = async (req, res) => {
    try {
        await connection();
        const bicicletas = await Bicicleta.find();
        console.log(bicicletas);
        res.render("bicicletas/index", { bicicletas: bicicletas } );
        //res.status(200).json(bicicletas);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
}


// CREAR BICICLETA NUEVA:
exports.bicicleta_create_get = function(req, res){
    res.render("bicicletas/create");
}

exports.bicicleta_create_post = function(req, res){
    let bici = new Bicicleta(req.body.id, req.body.color, req.body.modelo);
    bici.ubicacion = [req.body.lat, req.body.lng]
    Bicicleta.add(bici);

    res.redirect("/bicicletas");
}

// ACTUALIZAR UNA BICICLETA MEDIANTE ID:
exports.bicicleta_update_get = function(req, res){
    let bici = Bicicleta.findById(req.params.id);

    res.render("bicicletas/update", {bici});
}

exports.bicicleta_update_post = function(req, res){
    let bici = Bicicleta.findById(req.params.id);
    bici.id = req.body.id;
    bici.color = req.body.color;
    bici.modelo = req.body.modelo;
    bici.ubicacion = [req.body.lat, req.body.lng]

    res.redirect("/bicicletas");
}

// ELIMINAR BICICLETA:
exports.bicicleta_delete_post = function(req, res){
    Bicicleta.removeById(req.body.id);

    res.redirect("/bicicletas");
}