// Importar modelo y schema de mongoose
import { Schema, model } from 'mongoose';
// Definir el schema para Reviews
const reviewsSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Products',
        required: [true, "El producto es obligatorio"]
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customers',
        required: [true, "El cliente es obligatorio"]
    },
    rating: {
        type: Number,
        required: [true, "La calificación es obligatoria"],
        min: [1, "La calificación mínima es 1"],
        max: [5, "La calificación máxima es 5"],
        validate: {
            validator: Number.isInteger,
            message: "La calificación debe ser un número entero"
        }
    },
    comment: {
        type: String,
        required: [true, "El comentario es obligatorio"],
        trim: true,
        minlength: [10, "El comentario debe tener al menos 10 caracteres"],
        maxlength: [500, "El comentario no puede exceder los 500 caracteres"],
        validate: {
            validator: v => v.trim() !== '', // Asegurarse de que no sea una cadena vacía
            message: "Los comentarios no puede estar vacíos"
        }
    },
    response: {
        type: String,
        trim: true,
        maxlength: [500, "La respuesta no puede exceder los 500 caracteres"],
        validate: {
            validator: function(v) {
                // Solo validar si se proporciona un valor
                if (v === undefined || v === null || v === '') {
                    return true; // Permitir valores vacíos/nulos
                }
                return v.trim() !== ''; // Si se proporciona, no debe ser una cadena vacía
            },
            message: "La respuesta no puede estar vacía"
        }
    }
}, {
    timestamps: true,
    strict: false
});
// El tercer argumento sirve para indicar el nombre de la colección en MongoDB
export default model("Reviews", reviewsSchema, "Reviews");