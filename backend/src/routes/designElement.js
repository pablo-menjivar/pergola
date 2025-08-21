// Libreria para enrutamiento express y para guardar registros de archivos multimedia localmente
import express from "express"
import multer from "multer"
// Importo controlador de elementos
import designElementsController from "../controllers/designElementsController.js"

const router = express.Router();
// Especificamos que los archivos multimedia se guarden en la carpeta public
const upload = multer({dest: "public/"})
// Rutas que no requieren un parámetro en específico
router.route("/")
    .get(designElementsController.getElements)
    .post(upload.single("image"), designElementsController.postElements)
// Rutas que requieren un parámetro en específico
router.route("/:id")
    .get(designElementsController.getElement)
    .put(upload.single("image"), designElementsController.putElements)
    .delete(designElementsController.deleteElements)

export default router