// Libreria para enrutamiento express
import express from "express"
// Importo el controlador de transacciones
import transactionsController from "../controllers/transactionsController.js"

const router = express.Router()
// Rutas que no requieren ningún parámetro en específico
router.route("/")
    .get(transactionsController.getTransactions)
    .post(transactionsController.postTransactions)
// Rutas que requieren un parámetro de id 
router.route("/:id")
    .get(transactionsController.getTransaction)
    .put(transactionsController.putTransactions)
    .delete(transactionsController.deleteTransactions)

export default router