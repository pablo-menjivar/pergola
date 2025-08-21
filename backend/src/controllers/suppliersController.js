const suppliersController = {};
// Importo el modelo de proveedores
import Suppliers from "../models/Suppliers.js";
// CREATE (POST)
suppliersController.postSuppliers = async (req, res) => {
    try {
        const { name, contactPerson, phoneNumber, email, address } = req.body;
        
        const newSupplier = new Suppliers({ name, contactPerson, phoneNumber, email, address });
        // Guardar proveedor
        await newSupplier.save();
        // ESTADO DE CREACIÓN
        res.status(201).json({ message: "Proveedor creado con éxito", data: newSupplier });
    } catch (error) {
        // ESTADO DE ERROR EN INPUT DEL CLIENTE
        res.status(400).json({ message: "Error al crear proveedor", error: error.message });
    }
};
// READ (GET ALL)
suppliersController.getSuppliers = async (req, res) => {
    try {
        // Buscar proveedores
        const suppliers = await Suppliers.find();
        // ESTADO DE OK
        res.status(200).json(suppliers);
    } catch (error) {
        // ESTADO DE ERROR DEL SERVIDOR
        res.status(500).json({ message: "Error al obtener proveedores", error: error.message });
    }
};
// READ (GET ONE BY ID)
suppliersController.getSupplier = async (req, res) => {
    try {
        // Buscar un solo proveedor
        const supplier = await Suppliers.findById(req.params.id);
        // Validar que el proveedor si exista
        if (!supplier) {
            return res.status(404).json({ message: "Proveeedor no encontrado" });
        }
        // ESTADO DE OK
        res.status(200).json(supplier);
    } catch (error) {
        // ESTADO DE ERROR DEL SERVIDOR
        res.status(500).json({ message: "Error al obtener proveedor", error: error.message });
    }
};
// UPDATE (PUT)
suppliersController.putSuppliers = async (req, res) => {
    try {
        const { name, contactPerson, phoneNumber, email, address } = req.body;
        // Actualizar proveedor
        const updatedSupplier = await Suppliers.findByIdAndUpdate( req.params.id, { name, contactPerson, phoneNumber, email, address }, { new: true });
        // Validar que la subcategoría si exista
        if (!updatedSupplier) {
            return res.status(404).json({ message: "Proveedor no encontrado" });
        }
        // ESTADO DE OK
        res.status(200).json({ message: "Proveedor actualizado con éxito", data: updatedSupplier });
    } catch (error) {
        // ESTADO DE ERROR EN INPUT DEL CLIENTE
        res.status(400).json({ message: "Error al actualizar proveedor", error: error.message });
    }
};
// DELETE (DELETE)
suppliersController.deleteSuppliers = async (req, res) => {
    try {
        // Eliminar proveedor
        const deletedSupplier = await Suppliers.findByIdAndDelete(req.params.id);
        // Validar que la subcategoría si exista
        if (!deletedSupplier) {
            return res.status(404).json({ message: "Proveedor no encontrado" });
        }
        // ESTADO DE OK
        res.status(200).json({ message: "Proveedor eliminado con éxito" });
    } catch (error) {
        // ESTADO DE ERROR DEL SERVIDOR
        res.status(500).json({ message: "Error al eliminar proveedor", error: error.message })
    }
}
export default suppliersController