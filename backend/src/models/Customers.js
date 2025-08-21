/* Esta colección va a almacenar toda la información relacionada con los clientes.
"Customers": [
    "name": "John",
    "lastName": "Doe",
    "username": "john_doe",
    "email": "john.doe@example.com",
    "phone": "123-456-7890",
    "birthDate": "1990-05-15",
    "DUI": "123456789-0",
    "password": "securepassword123",
    "profilePic": "https://example.com/profile.jpg",
    "address": "123 Main St, Anytown, USA",
    "isVerified": true,
] */
// Importar modelo y schema de mongoose
import { Schema, model } from 'mongoose'
// Definir el schema para Customers
const customersSchema = new Schema({
    name: {
        type: String,
        required: [true, "El nombre es obligatorio"],
        trim: true,
        minlength: [2, "El nombre debe tener al menos 2 caracteres"],
        maxlength: [100, "El nombre no puede exceder los 100 caracteres"],
        validate: {
            validator: v => v.trim() !== '', // Asegurarse de que no sea una cadena vacía
            message: "El nombre no puede estar vacío"
        }
    },
    lastName: {
        type: String,
        required: [true, "El apellido es obligatorio"],
        trim: true,
        minlength: [2, "El apellido debe tener al menos 2 caracteres"],
        maxlength: [100, "El apellido no puede exceder los 100 caracteres"],
        validate: {
            validator: v => v.trim() !== '', // Asegurarse de que no sea una cadena vacía
            message: "El apellido no puede estar vacío"
        }
    },
    username: {
        type: String,
        required: [true, "El nombre de usuario es obligatorio"],
        trim: true,
        minlength: [5, "El nombre de usuario debe tener al menos 5 caracteres"],
        maxlength: [50, "El nombre de usuario no puede exceder los 50 caracteres"],
        unique: true,
        validate: {
            validator: v => v.trim() !== '', // Asegurarse de que no sea una cadena vacía
            message: "El nombre de usuario no puede estar vacío"
        }
    },
    email: {
        type: String,
        required: [true, "El correo electrónico es obligatorio"],
        trim: true,
        lowercase: true,
        unique: true,
        validate: {
            validator: function(v) {
                return v.trim() !== '' && /^[\w.-]+@([\w-]+\.)+[a-zA-Z]{2,}$/.test(v);
            },
            message: "El correo no puede estar vacío y debe ser válido"
        }
    },
    phoneNumber: {
        type: String,
        required: [true, "El número de teléfono es obligatorio"],
        trim: true,
        validate: {
            validator: function(v) {
                return v.trim() !== '' && /^\+503[-\d]{8,12}$/.test(v);
            },
            message: "El teléfono no puede estar vacío y debe ser válido en El Salvador"
        }
    },
    birthDate: {
        type: Date,
        required: [true, "La fecha de nacimiento es obligatoria"],
        validate: {
            validator: v => v <= new Date(),
            message: "La fecha de nacimiento debe ser anterior a la fecha actual"
        },
        validate: {
            validator: v => v instanceof Date && !isNaN(v),
            message: "La fecha de nacimiento debe ser válida"
        }
    },
    DUI: {
        type: String,
        required: [true, "El DUI es obligatorio"],
        trim: true,
        validate: {
            validator: function(v) {
                return v.trim() !== '' && /^\d{8}-\d$/.test(v);
            },
            message: "El DUI no puede estar vacío y debe tener formato 12345678-9"
        }
    },
    password: {
        type: String,
        required: [true, "La contraseña es obligatoria"],
        trim: true,
        minlength: [8, "La contraseña debe tener al menos 8 caracteres"],
        maxlength: [100, "La contraseña no puede exceder los 100 caracteres"],
        validate: {
            validator: function(v) {
                return v.trim() !== '' && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(v);
            },
            message: "La contraseña no puede estar vacía y debe incluir mayúsculas, minúsculas, números y caracteres especiales"
        }
    },
    profilePic: {
        type: String,
          validate: {
          validator: function(v) {
              if (v == null || v === '') return true;
              return v.trim() !== '' && /^https?:\/\/.+\.(jpg|jpeg|png|webp|svg)$/.test(v);
          },
          message: "La URL debe ser válida (jpg/jpeg/png/webp/svg)"
          }
    },
    address: {
        type: String,
        required: [true, "La dirección es obligatoria"],
        trim: true,
        minlength: [5, "La dirección debe tener al menos 5 caracteres"],
        maxlength: [200, "La dirección no puede exceder los 200 caracteres"],
        validate: {
            validator: v => v.trim() !== '', // Asegurarse de que no sea una cadena vacía
            message: "La dirección no puede estar vacía"
        },
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    // Campos de preferencias opcionales
    preferredColors: {
        type: [String],
        default: []
    },
    preferredMaterials: {
        type: [String],
        default: []
    },
    preferredJewelStyle: {
        type: [String],
        default: []
    },
    purchaseOpportunity: {
        type: String,
        trim: true
    },
    allergies: {
        type: String,
        trim: true
    },
    jewelSize: {
        type: String,
        enum: ["pequeño", "mediano", "grande", "muy grande"],
        trim: true
    },
    budget: {
        type: String,
        trim: true
    },
    loginAttempts: { type: Number, default: 0 },
    timeOut: { type: Date, default: null }
}, {
    timestamps: true,
    strict: false
})
// El tercer argumento sirve para indicar el nombre de la colección en MongoDB
export default model("Customers", customersSchema, "Customers")