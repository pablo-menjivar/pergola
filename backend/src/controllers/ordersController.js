const ordersController = {};
// Importo el modelo de pedidos
import Orders from "../models/Orders.js";
// Importo el modelo de productos
import Products from "../models/Products.js";
// Importo el modelo de clientes
import Customers from "../models/Customers.js";
// CREATE (POST)
ordersController.postOrders = async (req, res) => {
    try {
        const { 
            orderCode, 
            customer, 
            receiver, 
            timetable, 
            mailingAddress, 
            paymentMethod, 
            status, 
            paymentStatus, 
            deliveryDate, 
            items, 
            subtotal, 
            total } = req.body;
        // Verificar si el código de pedido ya existe
        const existingOrder = await Orders.findOne({ orderCode });
        if (existingOrder) {
            // ESTADO DE ERROR DE INPUT DEL CLIENTE
            return res.status(400).json({ message: "El código de pedido ya está en uso" });
        }
        // Verificar que los productos existan
        const productsExist = await Products.countDocuments({ _id: { $in: items } });
        if (productsExist !== items.length) {
            // ESTADO DE ERROR DE INPUT DEL CLIENTE
            return res.status(400).json({ message: "Uno o más productos no existen" });
        }
        const newOrder = new Orders({ 
            orderCode, 
            customer, 
            receiver, 
            timetable, 
            mailingAddress, 
            paymentMethod, 
            status: status || "pendiente", 
            paymentStatus: paymentStatus || "pendiente", 
            deliveryDate: deliveryDate ? new Date(deliveryDate) : null, 
            items, 
            subtotal, 
            total });
        // Guardar el pedido
        await newOrder.save();
        // ESTADO DE CREACIÓN
        res.status(201).json({ message: "Pedido creado con éxito", data: newOrder });
    } catch (error) {
        // ESTADO DE ERROR EN INPUT DEL CLIENTE
        res.status(400).json({ message: "Error al crear pedido", error: error.message });
    }
};
// READ (GET ALL)
ordersController.getOrders = async (req, res) => {
    try {
        // Buscar pedidos
        const orders = await Orders.find()
        .populate('customer', 'username email').populate({path: "items.itemId", select: "name price" });
        // ESTADO DE OK
        res.status(200).json(orders);
    } catch (error) {
        // ESTADO DE ERROR DEL SERVIDOR
        res.status(500).json({ message: "Error al obtener ordenes", error: error.message });
    };
};
// READ (GET ONE BY ID)
ordersController.getOrder = async (req, res) => {
    try {
        // Buscar un solo pedido
        const order = await Orders.findById(req.params.id)
        .populate('customer', 'username email').populate({path: "items.itemId", select: "name price" });
        // Validar que el pedido si exista
        if (!order) {
            // ESTADO DE NO ENCONTRADO
            return res.status(404).json({ message: "Pedido no encontrado" });
        }
        // ESTADO DE OK
        res.status(200).json(order);
    } catch (error) {
        // ESTADO DE ERROR DEL SERVIDOR
        res.status(500).json({ message: "Error al obtener pedido", error: error.message });
    }
};
// UPDATE (PUT)
ordersController.putOrders = async (req, res) => {
    try {
        const updates = req.body;
        // Verificar si se intenta cambiar el código de pedido
        if (updates.orderCode) {
            const existingOrder = await Orders.findOne({
                orderCode: updates.orderCode,
                _id: { $ne: req.params.id } // Excluir el documento actual
            });
            // Si ya existe, devolver error
            if (existingOrder) {
                // ESTADO DE ERROR DE INPUT DEL CLIENTE
                return res.status(400).json({ message: "El código de pedido ya está en uso" });
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
        // Actualizar el pedido
        const updatedOrder = await Orders.findByIdAndUpdate( req.params.id, updates, { new: true })
        // Validar que el pedido si exista
        if (!updatedOrder) {
            // ESTADO DE NO ENCONTRADO
            return res.status(404).json({ message: "Pedido no encontrado" });
        }
        // ESTADO DE OK
        res.status(200).json({ message: "Pedido actualizado con éxito", data: updatedCustomer });
    } catch (error) {
        // ESTADO DE ERROR EN INPUT DEL CLIENTE
        res.status(400).json({ message: "Error al actualizar pedido", error: error.message });
    }
};
// DELETE (DELETE)
ordersController.deleteOrders = async (req, res) => {
    try {
        // Buscar pedido por ID
        const order = await Orders.findById(req.params.id);
        // Validar que el pedido si exista
        if (!order) {
            // ESTADO DE NO ENCONTRADO
            return res.status(404).json({ message: "Pedido no encontrado" });
        }
        // Eliminar pedido
        await Orders.findByIdAndDelete(req.params.id);
        // ESTADO DE BORRADO
        res.status(204).json({ message: "Pedido eliminado con éxito" });
    } catch (error) {
        // ESTADO DE ERROR DEL SERVIDOR
        res.status(500).json({ message: "Error al eliminar pedido", error: error.message });
    }
}
export default ordersController;