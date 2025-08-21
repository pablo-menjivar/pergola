// Libreria para enrutamiento express y para guardar registros de archivos multimedia localmente
import express from "express"
import multer from "multer"
// Importo el controlador de admin
import adminProfileController from "../controllers/adminProfileController.js"

const router = express.Router()
// Especificamos que los archivos multimedia se guarden en la carpeta public
const upload = multer({dest: "public/"})
// Rutas para obtener y actualizar datos del perfil de administrador
router.get("/data-public", adminProfileController.getProfilePublic)
router.get("/data", adminProfileController.getProfile)
router.put("/", upload.single("profilePic"), adminProfileController.updateProfile)
router.put("/password", adminProfileController.changePassword)
router.put("/notifications", adminProfileController.updateNotifications)

export default router