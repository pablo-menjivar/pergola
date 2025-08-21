// Libreria para enrutamiento express
import express from "express"
// Importo el controlador de materias primas
import rawMaterialsController from "../controllers/rawMaterialsController.js"

const router = express.Router()
// Rutas que no requieren ningún parámetro en específico
router.route("/")
    .get(rawMaterialsController.getRawMaterials)
    .post(rawMaterialsController.postRawMaterials)
// Rutas que requieren un parámetro de id 
router.route("/:id")
    .get(rawMaterialsController.getRawMaterial)
    .put(rawMaterialsController.putRawMaterials)
    .delete(rawMaterialsController.deleteRawMaterials)

export default router