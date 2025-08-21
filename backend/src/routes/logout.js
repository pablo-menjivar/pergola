// Libreria para enrutamiento express
import express from "express"
// Importo controlador de logout
import logoutController from "../controllers/logoutController.js"

const router = express.Router();
// Única ruta
router.post("/", logoutController.logout)

export default router