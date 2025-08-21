// Libreria para enrutamiento express
import express from "express"
// Importo el controlador de reseñas
import reviewsController from "../controllers/reviewsController.js"

const router = express.Router()
// Rutas que no requieren ningún parámetro en específico
router.route("/")
    .get(reviewsController.getReviews)
    .post(reviewsController.postReviews)
// Rutas que requieren un parámetro de id 
router.route("/:id")
    .get(reviewsController.getReview)
    .put(reviewsController.putReviews)
    .delete(reviewsController.deleteReviews)

export default router