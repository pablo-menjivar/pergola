const categoriesController = {};
// Importo el modelo de subcategorías
import Categories from "../models/Categories.js";
// Archivo config y librería cloudinary
import { v2 as cloudinary } from 'cloudinary'
import { config } from "../utils/config.js"

cloudinary.config({
    cloud_name: config.CLOUDINARY.CLOUD_NAME,
    api_key: config.CLOUDINARY.API_KEY,
    api_secret: config.CLOUDINARY.API_SECRET
})
// CREATE (POST)
categoriesController.postCategories = async (req, res) => {
  try {
    const { name, description, isActive } = req.body;
    // Link de imagen
    let imageURL = ""
    // Subir imagen a cloudinary si se proporciona una imagen en el cuerpo de la solicitud
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "categories",
        allowed_formats: ["jpg", "jpeg", "png", "gif"],
      })
      imageURL = result.secure_url
    }
    const newCategory = new Categories({ name, description, image: imageURL, isActive });
    // Guardar categoría
    await newCategory.save();
    // ESTADO DE CREACIÓN
    res.status(201).json({ message: "Categoría creada con éxito", data: newCategory });
  } catch (error) {
    // ESTADO DE ERROR EN INPUT DEL CLIENTE
    res.status(400).json({ message: "Error al crear categoría", error: error.message });
  }
};
// READ (GET ALL)
categoriesController.getCategories = async (req, res) => {
    try {
        // Buscar categorías
        const categories = await Categories.find();
        // ESTADO DE OK
        res.status(200).json(categories);
    } catch (error) {
        // ESTADO DE ERROR DEL SERVIDOR
        res.status(500).json({ message: "Error al obtener categorías", error: error.message });
    }
};
// READ (GET ONE BY ID)
categoriesController.getCategory = async (req, res) => {
    try {
        // Buscar una sola categoría
        const category = await Categories.findById(req.params.id);
        // Validar que la categoría si exista
        if (!category) {
            // ESTADO DE NO ENCONTRADO
            return res.status(404).json({ message: "Categoría no encontrada" });
        }
        // ESTADO DE OK
        res.status(200).json(category);
    } catch (error) {
        // ESTADO DE ERROR DEL SERVIDOR
        res.status(500).json({ message: "Error al obtener categoría", error: error.message });
    }
};
// UPDATE (PUT)
categoriesController.putCategories = async (req, res) => {
    try {
        const { name, description, isActive } = req.body;
        // Link de imagen
        let imageURL = ""
        // Subir imagen a cloudinary si se proporciona una imagen en el cuerpo de la solicitud
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "categories",
                allowed_formats: ["jpg", "jpeg", "png", "gif"],
            })
            imageURL = result.secure_url
        }
        // Actualizar categoría
        const updatedCategory = await Categories.findByIdAndUpdate( req.params.id, { name, description, image: imageURL, isActive }, { new: true });
        // Validar que la categoría si exista
        if (!updatedCategory) {
            // ESTADO DE NO ENCONTRADO
            return res.status(404).json({ message: "Categoría no encontrada" });
        }
        // ESTADO DE OK
        res.status(200).json({ message: "Categoría actualizada con éxito", data: updatedCategory });
    } catch (error) {
        // ESTADO DE ERROR EN INPUT DEL CLIENTE
        res.status(400).json({ message: "Error al actualizar categoría", error: error.message });
    }
};
// DELETE (DELETE)
categoriesController.deleteCategories = async (req, res) => {
    try {
        // Primero obtener la categoría para eliminar la imagen de Cloudinary si existe
        const category = await Categories.findById(req.params.id);
        // Validar que la categoría si exista
        if (!category) {
            // ESTADO DE NO ENCONTRADO
            return res.status(404).json({ message: "Categoría no encontrada" });
        }
        // Eliminar imagen de Cloudinary si existe
        if (category.image) {
            const publicId = category.image.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`categories/${publicId}`);
        }
        // Eliminar categoría
        await Categories.findByIdAndDelete(req.params.id);
        // ESTADO DE OK
        res.status(200).json({ message: "Categoría eliminada con éxito" });
    } catch (error) {
        // ESTADO DE ERROR DEL SERVIDOR
        res.status(500).json({ message: "Error al eliminar categoría", error: error.message })
    }
};
export default categoriesController;