/* Esta colección va a almacenar todas las transacciones de los pagos.
"transactions": [
    "transactionCode": "TRX-2023-001",
    "order": "65a1bc2e3f4d8e2a1b2c3d4e",
    "customer": "65a1bc2e3f4d8e2a1b2c3d4f",
    "amount": 150.75,
    "type": "pago",
    "paymentMethod": "tarjeta de crédito",
    "status": "completado"
] */
// Importar modelo y schema de mongoose
import { Schema, model } from 'mongoose';
// Definir el schema para Transactions
const transactionsSchema = new Schema({
    transactionCode: {
        type: String,
        required: [true, "El código de transacción es obligatorio"],
        trim: true,
        unique: true,
        validate: {
            validator: function(v) {
                return v.trim() !== '' && /^[A-Z0-9-]+$/.test(v);
            },
            message: "El código no puede estar vacío y solo puede contener letras mayúsculas, números y guiones"
        }
    },
    order: {
        type: Schema.Types.ObjectId,
        ref: 'Orders',
        required: [true, "El pedido asociado es obligatorio"]
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customers',
        required: [true, "El cliente es obligatorio"]
    },
    amount: {
        type: Number,
        required: [true, "El monto es obligatorio"],
        min: [0.01, "El monto debe ser mayor a 0"]
    },
    type: {
        type: String,
        required: [true, "El tipo de transacción es obligatorio"],
        enum: {
            values: ["pago", "reembolso", "ajuste"],
            message: "Tipo de transacción no válido"
        },
        validate: {
            validator: v => v.trim() !== '', // Asegurarse de que no sea una cadena vacía
            message: "El tipo de transacción no puede estar vacío"
        }
    },
    paymentMethod: {
        type: String,
        required: [true, "El método de pago es obligatorio"],
        enum: {
            values: ["efectivo", "tarjeta de crédito", "transferencia", "paypal", "otro"],
            message: "Método de pago no válido"
        },
        validate: {
            validator: v => v.trim() !== '', // Asegurarse de que no sea una cadena vacía
            message: "El método de pago no puede estar vacío"
        }
    },
    status: {
        type: String,
        required: [true, "El estado es obligatorio"],
        enum: {
            values: ["pendiente", "completado", "fallido", "revertido"],
            message: "Estado de transacción no válido"
        },
        default: "pendiente",
        validate: {
            validator: v => v.trim() !== '', // Asegurarse de que no sea una cadena vacía
            message: "El estado no puede estar vacío"
        }
    }
}, {
    timestamps: true,
    strict: false
});
// El tercer argumento sirve para indicar el nombre de la colección en MongoDB
export default model("Transactions", transactionsSchema, "Transactions");