const express = require("express");
const router = express.Router();
const usuariosController = require("../controllers/usuarios.controller");

router.get("/", usuariosController.list);
router.get("/create", usuariosController.create_get);
router.post("/create", usuariosController.create);
router.get("/:id/update", usuariosController.update_get);
router.post("/:id/update", usuariosController.update);
router.post("/:id/delete", usuariosController.delete);

module.exports = router;