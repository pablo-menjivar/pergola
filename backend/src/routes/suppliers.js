// Libreria para enrutamiento express
import express from "express"
// Importo el controlador de proveedores
import suppliersController from "../controllers/suppliersController.js"

const router = express.Router()
// Rutas que no requieren ningún parámetro en específico
router.route("/")
    .get(suppliersController.getSuppliers)
    .post(suppliersController.postSuppliers)
// Rutas que requieren un parámetro de id 
router.route("/:id")
    .get(suppliersController.getSupplier)
    .put(suppliersController.putSuppliers)
    .delete(suppliersController.deleteSuppliers)

export default router