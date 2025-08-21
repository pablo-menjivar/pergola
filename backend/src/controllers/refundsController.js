const refundsController = {};
// Importo el modelo de pedidos
import Refunds from "../models/Refunds.js";
// Importo el modelo de productos
import Products from "../models/Products.js";
// Importo el modelo de clientes
import Customers from "../models/Customers.js";
// Importo el modelo de pedidos
import Orders from "../models/Orders.js";
// CREATE (POST)
refundsController.postRefunds = async (req, res) => {
    try {
        const { refundCode, order, customer, requestDate, reason, comments, items, status, amount, refundMethod } = req.body;
        // Verificar si el código de pedido ya existe
        const existingRefund = await Refunds.findOne({ refundCode });
        if (existingRefund) {
            // ESTADO DE ERROR DE INPUT DEL CLIENTE
            return res.status(400).json({ message: "El código de devolución ya está en uso" });
        }
        // Verificar que el pedido exista
        const existingOrder = await Orders.findById(order);
        if (!existingOrder) {
            // ESTADO DE ERROR DE INPUT DEL CLIENTE
            return res.status(400).json({ message: "El pedido no existe" });
        }
        // Verificar que el cliente exista
        const existingCustomer = await Customers.findById(customer);
        if (!existingCustomer) {
            // ESTADO DE ERROR DE INPUT DEL CLIENTE
            return res.status(400).json({ message: "El cliente no existe" });
        }
        // Verificar que los productos existan
        const productsExist = await Products.countDocuments({ _id: { $in: items } });
        if (productsExist !== items.length) {
            // ESTADO DE ERROR DE INPUT DEL CLIENTE
            return res.status(400).json({ message: "Uno o más productos no existen" });
        }
        const newRefund = new Refunds({ refundCode, order, customer, requestDate: requestDate ? new Date(requestDate) : null, reason, comments, items, status: status || "pendiente", amount, refundMethod });
        // Guardar la devolución
        await newRefund.save();
        // ESTADO DE CREACIÓN
        res.status(201).json({ message: "Devolución creada con éxito", data: newOrder });
    } catch (error) {
        // ESTADO DE ERROR EN INPUT DEL CLIENTE
        res.status(400).json({ message: "Error al crear devolución", error: error.message });
    }
};
// READ (GET ALL)
refundsController.getRefunds = async (req, res) => {
    try {
        // Buscar devoluciones
        const refunds = await Refunds.find().populate('order', 'orderCode').populate('customer', 'username email').populate({path: "items.itemId", select: "name price" });
        // ESTADO DE OK
        res.status(200).json(refunds);
    } catch (error) {
        // ESTADO DE ERROR DEL SERVIDOR
        res.status(500).json({ message: "Error al obtener ordenes", error: error.message });
    };
};
// READ (GET ONE BY ID)
refundsController.getRefund = async (req, res) => {
    try {
        // Buscar una sola devolución
        const refund = await Refunds.findById(req.params.id).populate('order', 'orderCode').populate('customer', 'username email').populate({path: "items.itemId", select: "name price" });
        // Validar que la devolución si exista
        if (!refund) {
            // ESTADO DE NO ENCONTRADO
            return res.status(404).json({ message: "Devolución no encontrada" });
        }
        // ESTADO DE OK
        res.status(200).json(refund);
    } catch (error) {
        // ESTADO DE ERROR DEL SERVIDOR
        res.status(500).json({ message: "Error al obtener devolución", error: error.message });
    }
};
// UPDATE (PUT)
refundsController.putRefunds = async (req, res) => {
    try {
        const updates = req.body;
        // Verificar si se intenta cambiar el código de pedido
        if (updates.refundCode) {
            const existingRefund = await Refunds.findOne({
                refundCode: updates.refundCode,
                _id: { $ne: req.params.id } // Excluir el documento actual
            });
            // Si ya existe, devolver error
            if (existingRefund) {
                // ESTADO DE ERROR DE INPUT DEL CLIENTE
                return res.status(400).json({ message: "El código de devolución ya está en uso" });
            }
        }
        // Verificar pedido si se actualiza 
        if (updates.order) {
            const existingOrder = await Orders.findById(updates.order);
            // Si no existe, devolver error
            if (!existingOrder) {
                // ESTADO DE ERROR DE INPUT DEL CLIENTE
                return res.status(400).json({ message: "El pedido no existe" });
            }
        }
        // Verificar cliente si se actualiza
        if (updates.customer) {
            const existingCustomer = await Customers.findById(updates.customer);
            // Si no existe, devolver error
            if (!existingCustomer) {
                // ESTADO DE ERROR DE INPUT DEL CLIENTE
                return res.status(400).json({ message: "El cliente no existe" });
            }
        }
        // Verificar productos si se actualizan
        if (updates.items) {
            const productsExist = await Products.countDocuments({ _id: { $in: updates.items } });
            // Si no existen, devolver error
            if (productsExist !== updates.items.length) {
                // ESTADO DE ERROR DE INPUT DEL CLIENTE
                return res.status(400).json({ message: "Uno o más productos no existen" });
            }
        }
        // Actualizar la devolución
        const updatedRefund = await Refunds.findByIdAndUpdate( req.params.id, updates, { new: true })
        // Validar que la devolución si exista
        if (!updatedRefund) {
            // ESTADO DE NO ENCONTRADO
            return res.status(404).json({ message: "Devolución no encontrada" });
        }
        // ESTADO DE OK
        res.status(200).json({ message: "Devolución actualizada con éxito", data: updatedRefund });
    } catch (error) {
        // ESTADO DE ERROR EN INPUT DEL CLIENTE
        res.status(400).json({ message: "Error al actualizar devolución", error: error.message });
    }
};
// DELETE (DELETE)
refundsController.deleteRefunds = async (req, res) => {
    try {
        // Buscar devolución por ID
        const refund = await Refunds.findById(req.params.id);
        // Validar que la devolución si exista
        if (!refund) {
            // ESTADO DE NO ENCONTRADO
            return res.status(404).json({ message: "Devolución no encontrada" });
        }
        // Eliminar devolución
        await Refunds.findByIdAndDelete(req.params.id);
        // ESTADO DE BORRADO
        res.status(204).json({ message: "Devolución eliminada con éxito" });
    } catch (error) {
        // ESTADO DE ERROR DEL SERVIDOR
        res.status(500).json({ message: "Error al eliminar devolución", error: error.message });
    }
}
export default refundsController;