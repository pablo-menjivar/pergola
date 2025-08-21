// Libreria para enrutamiento express
import express from "express"
// Importo controlador de registro de clientes
import signupCustomerController from "../controllers/signupCustomerController.js"

const router = express.Router();
// Rutas para registro de clientes y verificación de código por correo electrónico
router.post("/", signupCustomerController.registerCustomer)
router.post("/verifyCode", signupCustomerController.verifyCodeEmail)

export default router