/*
"designElements": [
    {
        "type": "Cierre",
        "nombre": "Clasp",
        "image": "http://example.com/clasp.png"
    }
] */
// Importar modelo y schema de mongoose
import { Schema, model } from 'mongoose'
// Definir el schema para los elementos del diseño
const designElementSchema = new Schema({
    type: {
        type: String,
        required: [true, "El tipo es obligatorio"],
        trim: true,
    },
    name: {
        type: String,
        required: [true, "El nombre es obligatorio"],
        trim: true,
        minlength: [2, "El nombre debe tener al menos 2 caracteres"],
        maxlength: [100, "El nombre no puede exceder los 100 caracteres"]
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
}, {
    timestamps: true
})
// El tercer argumento sirve para indicar el nombre de la colección en MongoDB
export default model("DesignElements", designElementSchema, "DesignElements")