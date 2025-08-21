// Libreria para enrutamiento express
import express from "express"
// Importo el controlador de diseños únicos
import customDesignsController from "../controllers/customDesignsController.js"

const router = express.Router()
// Rutas que no requieren ningún parámetro en específico
router.route("/")
    .get(customDesignsController.getDesigns)
    .post(customDesignsController.postDesigns)
// Rutas que requieren un parámetro de id 
router.route("/:id")
    .get(customDesignsController.getDesign)
    .put(customDesignsController.putDesigns)
    .delete(customDesignsController.deleteDesigns)

export default router