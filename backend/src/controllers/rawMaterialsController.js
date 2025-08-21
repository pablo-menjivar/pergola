const rawMaterialsController = {};
// Importo el modelo de materias primas
import RawMaterials from "../models/RawMaterials.js";
// POST (CREATE)
rawMaterialsController.postRawMaterials = async (req, res) => {
    try {
        const { 
            correlative,
            name, 
            description, 
            type, 
            color, 
            tone, 
            toneType, 
            texture, 
            shape, 
            dimension, 
            provider, 
            brand, 
            presentation, 
            quantity, 
            piecesPerPresentation, 
            totalPieces, 
            piecePrice, 
            purchaseDate, 
            stock } = req.body;
        // Verificar si el correlativo ya existe
        const existingMaterial = await RawMaterials.findOne({ correlative });
        if (existingMaterial) {
            // Devolver error de input del cliente
            return res.status(400).json({ message: "El correlativo ya está en uso" });
        }
        const newRawMaterial = new RawMaterials({ 
            correlative,
            name, 
            description,
            type, 
            color, 
            tone, 
            toneType, 
            texture, 
            shape, 
            dimension, 
            provider, 
            brand, 
            presentation, 
            quantity, 
            piecesPerPresentation, 
            totalPieces, 
            piecePrice, 
            purchaseDate: new Date(purchaseDate), stock });
        // Guardar materia prima
        await newRawMaterial.save();
        // ESTADO DE CREACIÓN
        res.status(201).json({ message: "Materia prima creada con éxito", data: newRawMaterial });
    } catch (error) {
         // ESTADO DE ERROR EN INPUT DEL CLIENTE
        res.status(400).json({ message: "Error al crear materia prima", error: error.message, stack: error.stack, body: req.body });
    }
};
// READ (GET ALL)
rawMaterialsController.getRawMaterials = async (req, res) => {
    try {
        // Buscar materias primas
        const rawMaterials = await RawMaterials.find().populate('provider', 'name email');
        // ESTADO DE OK
        res.status(200).json(rawMaterials);
    } catch (error) {
        // ESTADO DE ERROR DEL SERVIDOR
        res.status(500).json({ message: "Error al obtener materias primas", error: error.message });
    }
};
// READ (GET ONE BY ID)
rawMaterialsController.getRawMaterial = async (req, res) => {
    try {
        // Buscar una sola materia prima
        const rawMaterial = await RawMaterials.findById(req.params.id).populate('provider', 'name email');
        // Validar que la materia prima si exista
        if (!rawMaterial) {
            // ESTADO DE NO ENCONTRADO
            return res.status(404).json({ message: "Materia prima no encontrada" });
        }
        // ESTADO DE OK
        res.status(200).json(rawMaterial);
    } catch (error) {
        // ESTADO DE ERROR DEL SERVIDOR
        res.status(500).json({ message: "Error al obtener materia prima", error: error.message });
    }
};
// UPDATE (PUT)
rawMaterialsController.putRawMaterials = async (req, res) => {
    try {
        const updates = req.body;
        // Actualizar materia prima
        const updatedRawMaterial = await RawMaterials.findByIdAndUpdate(req.params.id, updates, { new: true });
        // Validar que la materia prima si exista
        if (!updatedRawMaterial) {
            // ESTADO DE NO ENCONTRADO
            return res.status(404).json({ message: "Materia prima no encontrada" });
        }
        // ESTADO DE OK
        res.status(200).json({ message: "Materia prima actualizada con éxito", data: updatedRawMaterial });
    } catch (error) {
        // ESTADO DE ERROR EN INPUT DEL CLIENTE
        res.status(400).json({ message: "Error al actualizar materia prima", error: error.message });
    }
};
// DELETE (DELETE)
rawMaterialsController.deleteRawMaterials = async (req, res) => {
    try {
        // Buscar materia prima por ID
        const rawMaterial = await RawMaterials.findById(req.params.id);
        // Validar que la materia prima si exista
        if (!rawMaterial) {
            // ESTADO DE NO ENCONTRADO
            return res.status(404).json({ message: "Materia prima no encontrada" });
        }
        // Eliminar materia prima
        await RawMaterials.findByIdAndDelete(req.params.id);
        // ESTADO DE BORRADO
        res.status(204).json({ message: "Materia prima eliminada con éxito" });
    } catch (error) {
        // ESTADO DE ERROR DEL SERVIDOR
        res.status(500).json({ message: "Error al eliminar materia prima", error: error.message });
    }
};
export default rawMaterialsController;