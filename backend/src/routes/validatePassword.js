// Importo libreria de enrutamiento express
import express from "express"
// Importo controlador de validación de contraseña
import validatePasswordController from "../controllers/validatePasswordController.js"
// Importo middleware de autenticación
import { validateAuthToken } from "../middlewares/validateAuthToken.js"

const router = express.Router()
// Única ruta
router.post("/", validateAuthToken([]), validatePasswordController.validatePassword)

export default router