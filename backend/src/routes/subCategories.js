// Libreria para enrutamiento express y para guardar registros de archivos multimedia localmente
import express from "express"
import multer from "multer"
// Importo el controlador de subcategorías
import subcategoriesController from "../controllers/subCategoriesController.js"

const router = express.Router()
// Especificamos que los archivos multimedia se guarden en la carpeta public
const upload = multer({dest: "public/"})
// Rutas que no requieren ningún parámetro en específico
router.route("/")
    .get(subcategoriesController.getSubcategories)
    .post(upload.single("image"), subcategoriesController.postSubcategories)
// Rutas que requieren un parámetro de id 
router.route("/:id")
    .get(subcategoriesController.getSubcategory)
    .put(upload.single("image"), subcategoriesController.putSubcategories)
    .delete(subcategoriesController.deleteSubcategories)

export default router