// Libreria para enrutamiento express
import express from "express"
// Importo controlador de recuperación de contraseña
import recoveryPasswordController from "../controllers/recoveryPasswordController.js"

const router = express.Router()
// Rutas para recuperación de contraseña, verificar código y cambiar contraseña
router.post("/requestCode", recoveryPasswordController.requestCode)
router.post("/verifyCode", recoveryPasswordController.verifyCode)
router.post("/changePassword", recoveryPasswordController.changePassword)

export default router