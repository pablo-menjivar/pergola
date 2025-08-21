// Libreria para enrutamiento express
import express from "express"
// Importo el controlador de devoluciones
import refundsController from "../controllers/refundsController.js"

const router = express.Router()
// Rutas que no requieren ningún parámetro en específico
router.route("/")
    .get(refundsController.getRefunds)
    .post(refundsController.postRefunds)
// Rutas que requieren un parámetro de id 
router.route("/:id")
    .get(refundsController.getRefund)
    .put(refundsController.putRefunds)
    .delete(refundsController.deleteRefunds)

export default router