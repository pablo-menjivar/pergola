const transactionsController = {};
// Importo modelo de transacciones
import Transactions from "../models/Transactions.js";
// Importo modelo de pedidos
import Orders from "../models/Orders.js";
// Importo modelo de clientes
import Customers from "../models/Customers.js";
// POST (CREATE)
transactionsController.postTransactions = async (req, res) => {
    try {
        const { transactionCode, order, customer, amount, type, paymentMethod, status } = req.body;
        // Verificar si el código de pedido ya existe
        const existingTransaction = await Transactions.findOne({ transactionCode });
        if (existingTransaction) {
            // ESTADO DE ERROR DE INPUT DEL CLIENTE
            return res.status(400).json({ message: "El código de transacción ya está en uso" });
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
        const newTransaction = new Transactions({ transactionCode, order, customer, amount, type, paymentMethod, status: status || "pendiente" });
        // Guardar la devolución
        await newTransaction.save();
        // ESTADO DE CREACIÓN
        res.status(201).json({ message: "Transacción creada con éxito", data: newTransaction });
    } catch (error) {
        // ESTADO DE ERROR EN INPUT DEL CLIENTE
        res.status(400).json({ message: "Error al crear transacción", error: error.message });
    }
};
// READ (GET ALL)
transactionsController.getTransactions = async (req, res) => {
    try {
        // Buscar transacciones
        const transactions = await Transactions.find().populate('order', 'name description').populate('customer', 'username email');
        // ESTADO DE OK
        res.status(200).json(transactions);
    } catch (error) {
        // ESTADO DE ERROR DEL SERVIDOR
        res.status(500).json({ message: "Error al obtener transacciones", error: error.message });
    }
};
// READ (GET ONE BY ID)
transactionsController.getTransaction = async (req, res) => {
    try {
        // Buscar una sola transacción
        const transaction = await Transactions.findById(req.params.id).populate('order', 'name description').populate('customer', 'username email');
        // Validar que la transacción si exista
        if (!transaction) {
            // ESTADO DE NO ENCONTRADO
            return res.status(404).json({ message: "Transacción no encontrada" });
        }
        // ESTADO DE OK
        res.status(200).json(transaction);
    } catch (error) {
        // ESTADO DE ERROR DEL SERVIDOR
        res.status(500).json({ message: "Error al obtener transacción", error: error.message });
    }
};
// UPDATE (PUT)
transactionsController.putTransactions = async (req, res) => {
    try {
        const { transactionCode, order, customer, amount, type, paymentMethod, status } = req.body;
        // Verificar si el código de transacción ya existe
        const existingTransaction = await Transactions.findOne({ transactionCode });
        if (!existingTransaction) {
            // ESTADO DE ERROR DE INPUT DEL CLIENTE
            return res.status(400).json({ message: "El código de transacción ya está en uso" });
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
        // Actualizar la transacción
        const updatedTransaction = await Transactions.findByIdAndUpdate(req.params.id, { transactionCode, order, customer, amount, type, paymentMethod, status: status || "pendiente" }, { new: true });
        // Validar que la transacción si exista
        if (!updatedTransaction) {
            // ESTADO DE NO ENCONTRADO
            return res.status(404).json({ message: "Transacción no encontrada" });
        }
        // ESTADO DE OK
        res.status(200).json({ message: "Transacción actualizada con éxito", data: updatedTransaction });
    } catch (error) {
        // ESTADO DE ERROR EN INPUT DEL CLIENTE
        res.status(400).json({ message: "Error al actualizar transacción", error: error.message });
    }
};
// DELETE (DELETE)
transactionsController.deleteTransactions = async (req, res) => {
    try {
        // Buscar y eliminar una transacción
        const transaction = await Transactions.findByIdAndDelete(req.params.id);
        if (!transaction) {
            // ESTADO DE NO ENCONTRADO
            return res.status(404).json({ message: "Transacción no encontrada" });
        }
        // ESTADO DE OK
        res.status(200).json({ message: "Transacción eliminada con éxito" });
    } catch (error) {
        // ESTADO DE ERROR DEL SERVIDOR
        res.status(500).json({ message: "Error al eliminar transacción", error: error.message });
    }
};
export default transactionsController;