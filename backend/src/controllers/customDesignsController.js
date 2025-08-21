const customDesignsController = {};
// Importar modelo de diseños personalizados
import CustomDesigns from "../models/CustomDesigns.js";
// POST (CREATE)
customDesignsController.postDesigns = async (req, res) => {
    try {
        const { codeRequest, piece, base, baseLength, decoration, clasp, customerComments } = req.body;

        const newDesign = new CustomDesigns({ codeRequest, piece, base, baseLength, decoration, clasp, customerComments });
        // Guardar diseño
        await newDesign.save();
        // ESTADO DE CREACIÓN
        res.status(201).json({ message: "Diseño creado con éxito", data: newDesign });
    } catch (error) {
        console.error("🔥 ERROR en postDesigns:", error); // log completo

        // ESTADO DE ERROR EN INPUT DEL CLIENTE
        res.status(400).json({ message: "Error al crear diseño", error: error.message, stack: error.stack, body: req.body });
    }
};
// READ (GET ALL)
customDesignsController.getDesigns = async (req, res) => {
    try {
        // Buscar diseños
        const designs = await CustomDesigns.find();
        // ESTADO DE OK
        res.status(200).json(designs);
    } catch (error) {
        // ESTADO DE ERROR DEL SERVIDOR
        res.status(500).json({ message: "Error al obtener diseños", error: error.message });
    }
};
// READ (GET ONE BY ID)
customDesignsController.getDesign = async (req, res) => {
    try {
        // Buscar un solo diseño
        const design = await CustomDesigns.findById(req.params.id)
        // Validar que el diseño si exista
        if (!design) {
            // ESTADO DE NO ENCONTRADO
            return res.status(404).json({ message: "Diseño no encontrado" });
        }
        // ESTADO DE OK
        res.status(200).json(design);
    } catch (error) {
        // ESTADO DE ERROR DEL SERVIDOR
        res.status(500).json({ message: "Error al obtener diseño", error: error.message });
    }
};
// UPDATE (PUT)
customDesignsController.putDesigns = async (req, res) => {
    try {
        const updates = req.body;
        // Verificar si se intenta cambiar el código de diseño
        if (updates.codeRequest) {
            const existingDesign = await CustomDesigns.findOne({
                codeRequest: updates.codeRequest,
                _id: { $ne: req.params.id } // Excluir el documento actual
            });
            // Si ya existe, devolver error
            if (existingDesign) {
                // ESTADO DE ERROR DE INPUT DEL CLIENTE
                return res.status(400).json({ message: "El código de diseño ya está en uso" });
            }
        }
        const updatedDesign = await CustomDesigns.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!updatedDesign) {
            return res.status(404).json({ message: "Diseño no encontrado" });
        }
        // ESTADO DE OK
        res.status(200).json({ message: "Diseño actualizado con éxito", data: updatedDesign });
    } catch (error) {
        // ESTADO DE ERROR EN INPUT DEL CLIENTE
        res.status(400).json({ message: "Error al actualizar diseño", error: error.message });
    }
};
// DELETE
customDesignsController.deleteDesigns = async (req, res) => {
    try {
        // Buscar diseño por su ID
        const design = await CustomDesigns.findById(req.params.id);
        if (!design) {
            // ESTADO DE NO ENCONTRADO
            return res.status(404).json({ message: "Diseño no encontrado" });
        }
        // Borrar diseño
        await CustomDesigns.findByIdAndDelete(req.params.id);
        // ESTADO DE BORRADO
        res.status(204).json({ message: "Diseño eliminado con éxito" });
    } catch (error) {
        // ESTADO DE ERROR DEL SERVIDOR
        res.status(500).json({ message: "Error al eliminar diseño", error: error.message });
    }
};
export default customDesignsController;