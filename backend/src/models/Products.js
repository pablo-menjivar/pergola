// Importar modelo y schema de mongoose
import { Schema, model } from 'mongoose';
// Definir el schema para Products
const productsSchema = new Schema({
    name: {
        type: String,
        required: [true, "El nombre del producto es obligatorio"],
        trim: true,
        minlength: [3, "El nombre debe tener al menos 3 caracteres"],
        maxlength: [100, "El nombre no puede exceder los 100 caracteres"],
        validate: {
            validator: v => v.trim() !== '', // Asegurarse de que no sea una cadena vacía
            message: "El nombre del producto no puede estar vacío"
        }
    },
    description: {
        type: String,
        required: [true, "La descripción es obligatoria"],
        trim: true,
        minlength: [10, "La descripción debe tener al menos 10 caracteres"],
        maxlength: [1000, "La descripción no puede exceder los 1000 caracteres"],
        validate: {
            validator: v => v.trim() !== '', // Asegurarse de que no sea una cadena vacía
            message: "El nombre del producto no puede estar vacío"
        }
    },
    codeProduct: {
        type: String,
        required: [true, "El código de producto es obligatorio"],
        trim: true,
        unique: true,
        validate: {
            validator: function(v) {
                return v.trim() !== '' && /^[A-Z0-9-]+$/.test(v);
            },
            message: "El código no puede estar vacío y solo puede contener letras mayúsculas, números y guiones"
        }
    },
    stock: {
        type: Number,
        required: [true, "El stock es obligatorio"],
        min: [0, "El stock no puede ser negativo"]
    },
    price: {
        type: Number,
        required: [true, "El precio es obligatorio"],
        min: [0.01, "El precio debe ser mayor a 0"]
    },
    productionCost: {
        type: Number,
        required: [true, "El costo de producción es obligatorio"],
        min: [0, "El costo de producción no puede ser negativo"]
    },
    discount: {
        type: Number,
        default: 0,
        min: [0, "El descuento no puede ser negativo"],
        max: [1, "El descuento máximo es 1 (100%)"]
    },
    images: {
        type: [String],
        validate: {
            validator: function (v) {
            // Debe ser un array no vacío
            if (!Array.isArray(v) || v.length === 0) return false;
            // Todos los valores deben ser strings no vacíos que coincidan con la URL
            return v.every(img =>
                typeof img === 'string' &&
                img.trim() !== '' &&
                /^https?:\/\/.+\.(jpg|jpeg|png|webp|svg)$/.test(img)
            );
            },
            message: 'Todas las URLs de imágenes deben ser válidas y el arreglo no puede estar vacío.'
        }
    },
    collection: {
        type: Schema.Types.ObjectId,
        ref: 'Collections',
        required: [true, "La colección es obligatoria"]
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Categories',
        required: [true, "La categoría es obligatoria"]
    },
    subcategory: {
        type: Schema.Types.ObjectId,
        ref: 'Subcategories',
        required: [true, "La subcategoría es obligatoria"]
    },
    rawMaterialsUsed: [{
        type: Schema.Types.ObjectId,
        ref: 'RawMaterials',
        required: [true, "Al menos un material es obligatorio"]
    }],
    highlighted: {
        type: Boolean,
        default: false
    },
    correlative: {
        type: String,
        required: [true, "El correlativo es obligatorio"],
        trim: true,
        validate: {
            validator: function(v) {
                return v.trim() !== '' && /^[A-Z0-9-]+$/.test(v);
            },
            message: "El correlativo no puede estar vacío y solo puede contener letras mayúsculas, números y guiones"
        }
    },
    movementType: {
        type: String,
        required: [true, "El tipo de movimiento es obligatorio"],
        enum: {
            values: ["venta", "exhibición", "producción", "otro"],
            message: "Tipo de movimiento no válido"
        },
        validate: {
            validator: v => v.trim() !== '', // Asegurarse de que no sea una cadena vacía
            message: "El tipo de movimiento no puede estar vacío"
        }
    },
    status: {
        type: String,
        required: [true, "El estado es obligatorio"],
        enum: {
            values: ["disponible", "agotado", "en producción", "descontinuado"],
            message: "Estado no válido"
        },
        validate: {
            validator: v => v.trim() !== '', // Asegurarse de que no sea una cadena vacía
            message: "El estado no puede estar vacío"
        }
    },
    applicableCosts: {
        type: String,
        trim: true,
        validate: {
            validator: v => v.trim() !== '', // Asegurarse de que no sea una cadena vacía
            message: "Los costos aplicables no puede estar vacíos"
        }
    },
    hasDiscount: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    strict: false
});
// El tercer argumento sirve para indicar el nombre de la colección en MongoDB
export default model("Products", productsSchema, "Products");