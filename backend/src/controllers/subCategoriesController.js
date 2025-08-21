const subcategoriesController = {};
// Importo el modelo de subcategorías
import Subcategories from "../models/SubCategories.js";
// Archivo config y librería cloudinary
import { v2 as cloudinary } from 'cloudinary'
import { config } from "../utils/config.js"

cloudinary.config({
    cloud_name: config.CLOUDINARY.CLOUD_NAME,
    api_key: config.CLOUDINARY.API_KEY,
    api_secret: config.CLOUDINARY.API_SECRET
})
// CREATE (POST)
subcategoriesController.postSubcategories = async (req, res) => {
    try {
        const { name, description, isActive } = req.body;
        // Link de imagen
        let imageURL = ""
        // Subir imagen a cloudinary si se proporciona una imagen en el cuerpo de la solicitud
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "subcategories",
                allowed_formats: ["jpg", "jpeg", "png", "gif"],
            })
            imageURL = result.secure_url
        }
        const newSubcategory = new Subcategories({ name, description, image: imageURL, isActive });
        // Guardar subcategoría
        await newSubcategory.save();
        // ESTADO DE CREACIÓN
        res.status(201).json({ message: "Subcategoría creada con éxito", data: newSubcategory });
    } catch (error) {
        // ESTADO DE ERROR EN INPUT DEL CLIENTE
        res.status(400).json({ message: "Error al crear subcategoría", error: error.message });
    }
};
// READ (GET ALL)
subcategoriesController.getSubcategories = async (req, res) => {
    try {
        // Buscar subcategorías
        const subcategories = await Subcategories.find();
        // ESTADO DE OK
        res.status(200).json(subcategories);
    } catch (error) {
        // ESTADO DE ERROR DEL SERVIDOR
        res.status(500).json({ message: "Error al obtener subcategorías", error: error.message });
    }
};
// READ (GET ONE BY ID)
subcategoriesController.getSubcategory = async (req, res) => {
    try {
        // Buscar una sola subcategoría
        const subcategory = await Subcategories.findById(req.params.id);
        // Validar que la categoría si exista
        if (!subcategory) {
            // ESTADO DE NO ENCONTRADO
            return res.status(404).json({ message: "Subcategoría no encontrada" });
        }
        // ESTADO DE OK
        res.status(200).json(subcategory);
    } catch (error) {
        // ESTADO DE ERROR DEL SERVIDOR
        res.status(500).json({ message: "Error al obtener subcategoría", error: error.message });
    }
};
// UPDATE (PUT)
subcategoriesController.putSubcategories = async (req, res) => {
    try {
        const { name, description, isActive } = req.body;
        // Link de imagen
        let imageURL = ""
        // Subir imagen a cloudinary si se proporciona una imagen en el cuerpo de la solicitud
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "subcategories",
                allowed_formats: ["jpg", "jpeg", "png", "gif"],
            })
            imageURL = result.secure_url
        }
        // Actualizar subcategoría
        const updatedSubcategory = await Subcategories.findByIdAndUpdate( req.params.id, { name, description, image: imageURL, isActive }, { new: true });
        // Validar que la subcategoría si exista
        if (!updatedSubcategory) {
            // ESTADO DE NO ENCONTRADO
            return res.status(404).json({ message: "Subcategoría no encontrada" });
        }
        // ESTADO DE OK
        res.status(200).json({ message: "Subcategoría actualizada con éxito", data: updatedSubcategory });
    } catch (error) {
        // ESTADO DE ERROR EN INPUT DEL CLIENTE
        res.status(400).json({ message: "Error al actualizar subcategoría", error: error.message });
    }
};
// DELETE (DELETE)
subcategoriesController.deleteSubcategories = async (req, res) => {
    try {
        // Primero obtener la subcategoría para eliminar la imagen de Cloudinary si existe
        const subcategory = await Subcategories.findById(req.params.id);
        // Validar que la colección si exista
        if (!subcategory) {
            // ESTADO DE NO ENCONTRADO
            return res.status(404).json({ message: "Subcategoría no encontrada" });
        }
        // Eliminar imagen de Cloudinary si existe
        if (subcategory.image) {
            const publicId = subcategory.image.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`subcategories/${publicId}`);
        }
        // Eliminar colección
        await Subcategories.findByIdAndDelete(req.params.id);
        // ESTADO DE OK
        res.status(200).json({ message: "Subcategoría eliminada con éxito" });
    } catch (error) {
        // ESTADO DE ERROR DEL SERVIDOR
        res.status(500).json({ message: "Error al eliminar subcategoría", error: error.message })
    }
};
export default subcategoriesController;
