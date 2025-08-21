// Libreria para enrutamiento express y para guardar registros de archivos multimedia localmente
import express from "express"
import multer from "multer"
// Importo el controlador de categorías
import categoriesController from "../controllers/categoriesController.js"

const router = express.Router()
// Especificamos que los archivos multimedia se guarden en la carpeta public
const upload = multer({dest: "public/"})
// Rutas que no requieren ningún parámetro en específico
router.route("/")
    .get(categoriesController.getCategories)
    .post(upload.single("image"), categoriesController.postCategories)
// Rutas que requieren un parámetro de id 
router.route("/:id")
    .get(categoriesController.getCategory)
    .put(upload.single("image"), categoriesController.putCategories)
    .delete(categoriesController.deleteCategories)

export default router