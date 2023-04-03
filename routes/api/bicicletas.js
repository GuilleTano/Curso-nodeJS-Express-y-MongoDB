const express = require("express");
const router = express.Router();
const bicicletaController = require("../../controllers/api/bicicletaControllerAPI");

router.get("/", bicicletaController.bicicleta_list);
router.post("/create", bicicletaController.bicicleta_create);
router.get("/update", bicicletaController.bicicleta_update_get);
router.post("/update", bicicletaController.bicicleta_update_post);
router.delete("/delete", bicicletaController.bicicleta_delete);

module.exports = router;