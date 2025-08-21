// Libreria para enrutamiento express
import express from "express"
// Importo controlador de login
import loginController from "../controllers/loginController.js"

const router = express.Router();
// Única ruta
router.post("/", loginController.login);

export default router