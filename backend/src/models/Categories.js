// Importar modelo y schema de mongoos
import { Schema, model } from 'mongoose';
// Definir el schema para Categories
const categoriesSchema = new Schema({
    name: {
        type: String,
        required: [true, "El nombre de la categoría es obligatorio"],
        trim: true,
        minlength: [3, "El nombre debe tener al menos 3 caracteres"],
        maxlength: [100, "El nombre no puede exceder los 100 caracteres"],
        unique: true,
        validate: {
            validator: v => v.trim() !== '', // Asegurarse de que no sea una cadena vacía
            message: "El nombre no puede estar vacío"
        }
    },
    description: {
        type: String,
        required: [true, "La descripción es obligatoria"],
        trim: true,
        minlength: [10, "La descripción debe tener al menos 10 caracteres"],
        maxlength: [500, "La descripción no puede exceder los 500 caracteres"],
        validate: {
            validator: v => v.trim() !== '', // Asegurarse de que no sea una cadena vacía
            message: "La descripción no puede estar vacía"
        }
    },
    image: {
        type: String,
        validate: {
            validator: function(v) {
                if (v == null) return true;
                return v.trim() !== '' && /^https?:\/\/.+\.(jpg|jpeg|png|webp|svg)$/.test(v);
            },
            message: "La URL no puede estar vacía y debe ser válida (jpg/jpeg/png/webp/svg)"
        }
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    strict: false
});
// El tercer argumento sirve para indicar el nombre de la colección en MongoDB
export default model("Categories", categoriesSchema, "Categories")