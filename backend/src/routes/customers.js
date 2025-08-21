// Libreria para enrutamiento express y para guardar registros de archivos multimedia localmente
import express from "express"
import multer from "multer"
// Importo el controlador de clientes
import customersController from "../controllers/customersController.js"

const router = express.Router()
// Especificamos que los archivos multimedia se guarden en la carpeta public
const upload = multer({dest: "public/"})
// Rutas que no requieren ningún parámetro en específico
router.route("/")
    .get(customersController.getCustomers)
    .post(upload.single("profilePic"), customersController.postCustomers)
// Rutas que requieren un parámetro de id 
router.route("/:id")
    .get(customersController.getCustomer)
    .put(upload.single("profilePic"), customersController.putCustomers)
    .delete(customersController.deleteCustomers)

export default router