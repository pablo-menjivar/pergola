// Importar modelo y schema de mongoose
import { Schema, model } from 'mongoose';
// Definir el schema para RawMaterials
const rawMaterialsSchema = new Schema({
    correlative: {
        type: String,
        required: [true, "El correlativo es obligatorio"],
        trim: true,
        unique: true,
        validate: {
            validator: function(v) {
                return v.trim() !== '' && /^[A-Z0-9-]+$/.test(v);
            },
            message: "El correlativo no puede estar vacío y solo puede contener letras mayúsculas, números y guiones"
        }
    },
    name: {
        type: String,
        required: [true, "El nombre es obligatorio"],
        trim: true,
        minlength: [3, "El nombre debe tener al menos 3 caracteres"],
        maxlength: [100, "El nombre no puede exceder los 100 caracteres"],
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
    type: {
        type: String,
        required: [true, "El tipo es obligatorio"],
        validate: {
            validator: v => v.trim() !== '', // Asegurarse de que no sea una cadena vacía
            message: "El tipo no puede estar vacío"
        }
    },
    color: {
        type: String,
        trim: true,
        validate: {
            validator: v => v.trim() !== '', // Asegurarse de que no sea una cadena vacía
            message: "El color no puede estar vacío"
        }
    },
    tone: {
        type: String,
        trim: true,
        validate: {
            validator: v => v.trim() !== '', // Asegurarse de que no sea una cadena vacía
            message: "El tono no puede estar vacío"
        }
    },
    toneType: {
        type: String,
        trim: true,
        validate: {
            validator: v => v.trim() !== '', // Asegurarse de que no sea una cadena vacía
            message: "El tipo de tono no puede estar vacío"
        }
    },
    texture: {
        type: String,
        trim: true,
        validate: {
            validator: v => v.trim() !== '', // Asegurarse de que no sea una cadena vacía
            message: "La textura no puede estar vacía"
        }
    },
    shape: {
        type: String,
        trim: true,
        validate: {
            validator: v => v.trim() !== '', // Asegurarse de que no sea una cadena vacía
            message: "La figura no puede estar vacía"
        }
    },
    dimension: {
        type: String,
        trim: true,
        validate: {
            validator: v => v.trim() !== '', // Asegurarse de que no sea una cadena vacía
            message: "La dimensión no puede estar vacía"
        }
    },
    provider: {
        type: Schema.Types.ObjectId,
        ref: 'Supplier',
        required: [true, "El proveedor es obligatorio"]
    },
    brand: {
        type: String,
        trim: true,
        validate: {
            validator: v => v.trim() !== '', // Asegurarse de que no sea una cadena vacía
            message: "La marca no puede estar vacía"
        }
    },
    presentation: {
        type: String,
        required: [true, "La presentación es obligatoria"],
        trim: true,
        validate: {
            validator: v => v.trim() !== '', // Asegurarse de que no sea una cadena vacía
            message: "La presentación no puede estar vacía"
        }
    },
    quantity: {
        type: Number,
        required: [true, "La cantidad es obligatoria"],
        min: [0, "La cantidad no puede ser negativa"]
    },
    piecesPerPresentation: {
        type: Number,
        required: [true, "Las piezas por presentación son obligatorias"],
        min: [1, "Debe haber al menos 1 pieza por presentación"]
    },
    totalPieces: {
        type: Number,
        required: [true, "El total de piezas es obligatorio"],
        min: [0, "El total de piezas no puede ser negativo"]
    },
    piecePrice: {
        type: Number,
        required: [true, "El precio por pieza es obligatorio"],
        min: [0.01, "El precio debe ser mayor a 0"]
    },
    purchaseDate: {
        type: Date,
        required: [true, "La fecha de compra es obligatoria"],
        validate: {
            validator: v => v <= new Date(),
            message: "La fecha de compra debe ser anterior o igual a la fecha actual"
        }
    },
    stock: {
        type: Number,
        required: [true, "El stock es obligatorio"],
        min: [0, "El stock no puede ser negativo"]
    }
}, {
    timestamps: true,
    strict: false
});
// El tercer argumento sirve para indicar el nombre de la colección en MongoDB
export default model("RawMaterials", rawMaterialsSchema, "RawMaterials")