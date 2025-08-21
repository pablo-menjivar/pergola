// Solo para manejar cambios y ajustes en el perfil en el frontend
import { Schema, model } from "mongoose"

const adminSchema = new Schema({
    name: { 
        type: String, 
        required: true 
    },
    lastName: { 
        type: String, 
        required: true 
    }, 
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    profilePic: { 
        type: String, 
        default: '' 
    },
    userType: { 
        type: String, 
        default: 'admin' 
    },
    emailNotifications: { 
        type: Boolean, 
        default: false 
    },
    loginAttempts: { type: Number, default: 0 },
    timeOut: { type: Date, default: null }
}, {
    timestamps: true,
    strict: false
})
export default model("Admin", adminSchema, "Admin")