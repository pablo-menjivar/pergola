// Libreria para enrutamiento express y para guardar registros de archivos multimedia localmente
import express from "express"
import multer from "multer"
// Importo controlador de productos
import productsController from "../controllers/productsController.js"

const router = express.Router();
// Especificamos que los archivos multimedia se guarden en la carpeta public, incluyendo el límite de tamaño de los archivos
const upload = multer({
    dest: "products/",
    limits: {
        fileSize: 5 * 1024 * 1024, 
    },
    fileFilter: (req, file, cb) => {
        // Validar tipo de archivo
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos de imagen'), false);
        }
    }
});
// Rutas que no requieren un parámetro en específico
router.route("/")
    .get(productsController.getProducts)
    .post(upload.array("images", 5), productsController.postProducts)
// Rutas que requieren un parámetro en específico
router.route("/:id")
    .get(productsController.getProduct)
    .put(upload.array("images", 5), productsController.putProducts)
    .delete(productsController.deleteProducts)

export default router