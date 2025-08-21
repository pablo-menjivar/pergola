// Importar modelo y schema de mongoose
import { Schema, model } from 'mongoose';
// Definir el schema para Orders
const ordersSchema = new Schema({
    orderCode: {
        type: String,
        required: [true, "El código de pedido es obligatorio"],
        trim: true,
        unique: true,
        validate: {
            validator: function(v) {
                return v.trim() !== '' && /^[A-Z0-9-]+$/.test(v);
            },
            message: "El código no puede estar vacío y solo puede contener letras mayúsculas, números y guiones"
        }
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customers',
        required: [true, "El cliente es obligatorio"]
    },
    receiver: {
        type: String,
        required: [true, "El nombre del receptor es obligatorio"],
        trim: true,
        minlength: [5, "El nombre debe tener al menos 5 caracteres"],
        maxlength: [100, "El nombre no puede exceder los 100 caracteres"],
        validate: {
            validator: v => v.trim() !== '', // Asegurarse de que no sea una cadena vacía
            message: "El nombre del del receptor no puede estar vacío"
        }
    },
    timetable: {
        type: String,
        trim: true,
        maxlength: [100, "El horario no puede exceder los 100 caracteres"],
        validate: {
            validator: v => v.trim() !== '', // Asegurarse de que no sea una cadena vacía
            message: "El horario no puede estar vacío"
        }
    },
    mailingAddress: {
        type: String,
        required: [true, "La dirección de envío es obligatoria"],
        trim: true,
        minlength: [10, "La dirección debe tener al menos 10 caracteres"],
        maxlength: [200, "La dirección no puede exceder los 200 caracteres"],
        validate: {
            validator: v => v.trim() !== '', // Asegurarse de que no sea una cadena vacía
            message: "La dirección de envío no puede estar vacía"
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
        required: [true, "El estado del pedido es obligatorio"],
        enum: {
            values: ["pendiente", "en proceso", "enviado", "entregado", "cancelado"],
            message: "Estado de pedido no válido"
        },
        default: "pendiente",
        validate: {
            validator: v => v.trim() !== '', // Asegurarse de que no sea una cadena vacía
            message: "El estado no puede estar vacío"
        }
    },
    paymentStatus: {
        type: String,
        required: [true, "El estado del pago es obligatorio"],
        enum: {
            values: ["pendiente", "pagado", "reembolsado", "fallido"],
            message: "Estado de pago no válido"
        },
        default: "pendiente",
        validate: {
            validator: v => v.trim() !== '', // Asegurarse de que no sea una cadena vacía
            message: "El estado del pago no puede estar vacío"
        }
    },
    deliveryDate: {
        type: Date,
        validate: {
            validator: v => v >= new Date(),
            message: "La fecha de entrega debe ser futura"
        }
    },
    items: [{
        type: Schema.Types.ObjectId,
        ref: 'Products',
        required: [true, "Al menos un producto es obligatorio"]
    }],
    subtotal: {
        type: Number,
        required: [true, "El subtotal es obligatorio"],
        min: [0, "El subtotal no puede ser negativo"]
    },
    total: {
        type: Number,
        required: [true, "El total es obligatorio"],
        min: [0, "El total no puede ser negativo"]
    }
}, {
    timestamps: true,
    strict: false
});
// El tercer argumento sirve para indicar el nombre de la colección en MongoDB
export default model("Orders", ordersSchema, "Orders");