// Libreria para enrutamiento express y para guardar registros de archivos multimedia localmente
import express from "express"
import multer from "multer"
// Importo el controlador de colecciones
import collectionsController from "../controllers/collectionsController.js"

const router = express.Router()
// Especificamos que los archivos multimedia se guarden en la carpeta public
const upload = multer({dest: "public/"})
// Rutas que no requieren ningún parámetro en específico
router.route("/")
    .get(collectionsController.getCollections)
    .post(upload.single("image"), collectionsController.postCollections)
// Rutas que requieren un parámetro de id 
router.route("/:id")
    .get(collectionsController.getCollection)
    .put(upload.single("image"), collectionsController.putCollections)
    .delete(collectionsController.deleteCollections)

export default router