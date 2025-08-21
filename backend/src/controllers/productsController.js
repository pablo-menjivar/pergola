const productsController = {};
// Importo el modelo de productos
import Products from "../models/Products.js";
// Archivo config y librería cloudinary
import { v2 as cloudinary } from 'cloudinary';
import { config } from "../utils/config.js";

cloudinary.config({
    cloud_name: config.CLOUDINARY.CLOUD_NAME,
    api_key: config.CLOUDINARY.API_KEY,
    api_secret: config.CLOUDINARY.API_SECRET
});
// CREATE (POST)
productsController.postProducts = async (req, res) => {
    try {
        const { 
          name, 
          description,
          codeProduct, 
          stock, 
          price, 
          productionCost, 
          discount, 
          collection, 
          category, 
          subcategory, 
          rawMaterialsUsed, 
          highlighted, 
          correlative, 
          movementType, 
          status, 
          applicableCosts, 
          hasDiscount } = req.body;
        // Verificar si el código de producto ya existe
        const existingProduct = await Products.findOne({ codeProduct });
        if (existingProduct) {
            return res.status(400).json({ 
                message: "El código de producto ya está en uso" 
            });
        }
        // Variable para guardar links de imágenes
        let productImageURLs = [];
        // Subir imágenes a cloudinary
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: "products",
                    allowed_formats: ["jpg", "jpeg", "png", "webp"]
                });
                productImageURLs.push(result.secure_url);
            }
        }
        const newProduct = new Products({ 
          name, 
          description, 
          codeProduct, 
          stock, 
          price, 
          productionCost, 
          discount: discount || 0, 
          images: productImageURLs, 
          collection, 
          category, 
          subcategory, 
          rawMaterialsUsed: Array.isArray(rawMaterialsUsed) ? rawMaterialsUsed : [rawMaterialsUsed], 
          highlighted: highlighted || false, 
          correlative, 
          movementType, 
          status, 
          applicableCosts, 
          hasDiscount: hasDiscount || false });
        // Guardar producto
        await newProduct.save();
        // ESTADO DE CREACIÓN
        res.status(201).json({ message: "Producto creado con éxito", data: newProduct });
    } catch (error) {
        // ESTADO DE ERROR EN INPUT DEL CLIENTE
        res.status(400).json({ message: "Error al crear producto", error: error.message });
    }
};
// READ (GET ALL)
productsController.getProducts = async (req, res) => {
    try {
        // Buscar productos
        const products = await Products.find().populate('collection', 'name description').populate('category', 'name description').populate('subcategory', 'name description').populate('rawMaterialsUsed', 'name description');
        // ESTADO DE OK
        res.status(200).json(products);
    } catch (error) {
        // ESTADO DE ERROR DEL SERVIDOR
        res.status(500).json({ message: "Error al obtener productos", error: error.message });
    }
};
// READ (GET ONE BY ID)
productsController.getProduct = async (req, res) => {
    try {
        // Buscar un solo producto
        const product = await Products.findById(req.params.id).populate('collection', 'name description').populate('category', 'name description').populate('subcategory', 'name description').populate('rawMaterialsUsed', 'name description');
        // Validar que el producto si exista
        if (!product) {
            // ESTADO DE NO ENCONTRADO
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        // ESTADO DE OK
        res.status(200).json(product);
    } catch (error) {
        // ESTADO DE ERROR DEL SERVIDOR
        res.status(500).json({ message: "Error al obtener producto", error: error.message });
    }
};
// UPDATE (PUT)
productsController.putProducts = async (req, res) => {
    try {
        const updates = req.body;
        // Verificar si se intenta cambiar el código de producto
        if (updates.codeProduct) {
            const existingProduct = await Products.findOne({ 
                codeProduct: updates.codeProduct,
                _id: { $ne: req.params.id } // Excluir el documento actual
            });
            // Si ya existe, devolver error
            if (existingProduct) {
                // ESTADO DE ERROR DE INPUT DEL CLIENTE
                return res.status(400).json({ message: "El código de producto ya está en uso" });
            }
        }
        // Manejo de imágenes
        if (req.files && req.files.length > 0) {
            // Primero obtener el producto actual para eliminar imágenes antiguas
            const currentProduct = await Products.findById(req.params.id);
            if (currentProduct && currentProduct.images && currentProduct.images.length > 0) {
                for (const imageUrl of currentProduct.images) {
                    const publicId = imageUrl.split('/').pop().split('.')[0];
                    await cloudinary.uploader.destroy(`products/${publicId}`);
                }
            }
            // Subir nuevas imágenes
            const imageUrls = [];
            for (const file of req.files) {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: "products",
                    allowed_formats: ["jpg", "jpeg", "png", "webp"]
                });
                imageUrls.push(result.secure_url);
            }
            updates.images = imageUrls;
        }
        // Convertir rawMaterialsUsed a array si es necesario
        if (updates.rawMaterialsUsed && !Array.isArray(updates.rawMaterialsUsed)) {
            updates.rawMaterialsUsed = [updates.rawMaterialsUsed];
        }
        // Actualizar producto
        const updatedProduct = await Products.findByIdAndUpdate(req.params.id, updates, { new: true });
        // Validar que el producto si exista
        if (!updatedProduct) {
            // ESTADO DE NO ENCONTRADO
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        // ESTADO DE OK
        res.status(200).json({ message: "Producto actualizado con éxito", data: updatedProduct });
    } catch (error) {
        // ESTADO DE ERROR DE INPUT DEL CLIENTE
        res.status(400).json({ message: "Error al actualizar producto", error: error.message });
    }
};
// DELETE (DELETE)
productsController.deleteProducts = async (req, res) => {
    try {
        // Primero obtener el producto para eliminar la imagen de Cloudinary si existe
        const product = await Products.findById(req.params.id);
        // Validar que el producto si exista
        if (!product) {
            // ESTADO DE NO ENCONTRADO
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        // Eliminar imágenes de Cloudinary si existen
        if (product.images && product.images.length > 0) {
            for (const imageUrl of product.images) {
                const publicId = imageUrl.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(`products/${publicId}`);
            }
        }
        // Eliminar el producto
        await Products.findByIdAndDelete(req.params.id);
        // ESTADO DE OK
        res.status(200).json({ message: "Producto eliminado con éxito" });
    } catch (error) {
        // ESTADO DE ERROR DEL SERVIDOR
        res.status(500).json({ message: "Error al eliminar producto", error: error.message });
    }
};
export default productsController;