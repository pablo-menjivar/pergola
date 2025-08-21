// Importar Schema y model de mongoose
import { Schema, model } from 'mongoose';
// Definir el schema para Suppliers
const supplierSchema = new Schema({
  name: {
    type: String,
    required: [true, 'El nombre del proveedor es obligatorio'],
    trim: true,
    minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
    maxlength: [255, 'El nombre no puede exceder los 255 caracteres'],
    validate: {
      validator: v => v.trim() !== '', // Asegurarse de que no sea una cadena vacía
      message: "El nombre no puede estar vacío"
    }
  },
  contactPerson: {
    type: String,
    required: [true, 'El nombre de la persona de contacto es obligatorio'],
    trim: true,
    minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
    maxlength: [255, 'El nombre no puede exceder los 255 caracteres'],
    validate: {
      validator: v => v.trim() !== '', // Asegurarse de que no sea una cadena vacía
      message: "El nombre de la persona de contacto no puede estar vacío"
    }
  },
  phoneNumber: {
    type: String,
    required: [true, 'El número de teléfono es obligatorio'],
    required: [true, "El número de teléfono es obligatorio"],
    trim: true,
    validate: {
        validator: function(v) {
            return v.trim() !== '' && /^(?:\+503\s?)?(6|7)\d{3}-?\d{4}$/.test(v);
        },
        message: "El teléfono no puede estar vacío y debe ser válido en El Salvador"
    }
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/.+@.+\..+/, 'Formato de email inválido'],
    validate: {
      validator: function(v) {
        return v.trim() !== '' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: "El correo no puede estar vacío y debe tener un formato válido"
    }
  },
  address: {
    type: String,
    required: [true, 'La dirección es obligatoria'],
    trim: true,
    minlength: [5, 'La dirección debe tener al menos 5 caracteres'],
    maxlength: [500, 'La dirección no puede exceder los 500 caracteres'],
    validate: {
      validator: v => v.trim() !== '', // Asegurarse de que no sea una cadena vacía
      message: "La dirección no puede estar vacía"
    }
  }
}, {
  timestamps: true,
  strict: false
});
// El tercer argumento sirve para indicar el nombre de la colección en MongoDB
export default model('Supplier', supplierSchema, 'Suppliers');