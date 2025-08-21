const employeesController = {};
// Importo el modelo de empleados
import Employees from "../models/Employees.js";
// Archivo config y librería cloudinary
import { v2 as cloudinary } from 'cloudinary';
import { config } from "../utils/config.js";

cloudinary.config({
    cloud_name: config.CLOUDINARY.CLOUD_NAME,
    api_key: config.CLOUDINARY.API_KEY,
    api_secret: config.CLOUDINARY.API_SECRET
});
// CREATE (POST)
employeesController.postEmployees = async (req, res) => {
    try {
        const { name, lastName, username, email, phoneNumber, birthDate, DUI, password, userType, hireDate, isVerified } = req.body;
        // Validaciones manuales ANTES de mongoose
        const errors = [];
        
        if (!name || name.trim().length < 2) errors.push("Nombre inválido");
        if (!lastName || lastName.trim().length < 2) errors.push("Apellido inválido");
        if (!username || username.trim().length < 5) errors.push("Usuario debe tener al menos 5 caracteres");
        if (!email || !/^[\w.-]+@([\w-]+\.)+[a-zA-Z]{2,}$/.test(email)) errors.push("Email inválido");
        if (!phoneNumber || !/^\+503[-\d]{8,12}$/.test(phoneNumber)) errors.push("Teléfono debe ser formato +503XXXXXXXX");
        if (!DUI || !/^\d{8}-\d$/.test(DUI)) errors.push("DUI debe tener formato 12345678-9");
        if (!password || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password)) errors.push("Contraseña debe tener mayúsculas, minúsculas, números y caracter especial");
        // Link de imagen
        let profilePicURL = "";
        // Subir imagen a cloudinary si se proporciona una imagen en el cuerpo de la solicitud
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "employees",
                allowed_formats: ["jpg", "jpeg", "png", "webp"]
            });
            profilePicURL = result.secure_url;
        }
        const newEmployee = new Employees({ name, lastName, username, email, phoneNumber, birthDate: new Date(birthDate), DUI, password, profilePic: profilePicURL, userType, hireDate: new Date(hireDate), isVerified: isVerified || false });
        // Guardar empleado
        await newEmployee.save();
        // ESTADO DE CREACIÓN
        res.status(201).json({ message: "Empleado creado con éxito", data: {
                ...newEmployee.toObject(),
                password: undefined // Excluir la contraseña de la respuesta
            }
        });
    } catch (error) {
        console.error("💥 ERROR en postEmployees:", error);
        
        // Error de duplicados
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(400).json({ 
                message: `El ${field} ya existe en el sistema` 
            });
        }
        
        // Error de validación de mongoose
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ 
                message: "Error de validación", 
                errors 
            });
        }

        res.status(400).json({ 
            message: "Error al crear empleado", 
            error: error.message 
        });
    }
};
// READ (GET ALL)
employeesController.getEmployees = async (req, res) => {
    try {
        // Buscar empleados
        const employees = await Employees.find();
        // ESTADO DE OK
        res.status(200).json(employees);
    } catch (error) {
        // ESTADO DE ERROR DEL SERVIDOR
        res.status(500).json({ message: "Error al obtener empleados", error: error.message });
    }
};
// READ (GET ONE BY ID)
employeesController.getEmployee = async (req, res) => {
    try {
        // Buscar un solo empleado
        const employee = await Employees.findById(req.params.id);
        // Validar que el empleado si exista
        if (!employee) {
            // ESTADO DE NO ENCONTRADO
            return res.status(404).json({ message: "Empleado no encontrado" });
        }
        // ESTADO DE OK
        res.status(200).json(employee);
    } catch (error) {
        // ESTADO DE ERROR DEL SERVIDOR
        res.status(500).json({ message: "Error al obtener cliente", error: error.message });
    }
};
// UPDATE (PUT)
employeesController.putEmployees = async (req, res) => {
    try {
        console.log("Body recibido:", req.body);
        console.log("File recibido:", req.file);
        const updates = req.body;
        // Manejar la imagen si se proporciona
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "employees",
                allowed_formats: ["jpg", "jpeg", "png", "webp"]
            });
            updates.profilePic = result.secure_url;
        }
        // Actualizar empleado
        const updatedEmployee = await Employees.findByIdAndUpdate( req.params.id, updates, { new: true } ).select('-password');
        // Validar que el cliente si exista
        if (!updatedEmployee) {
            // ESTADO DE NO ENCONTRADO
            return res.status(404).json({ message: "Empleado no encontrado" });
        }
        // ESTADO DE OK
        res.status(200).json({ message: "Empleado actualizado con éxito", data: updatedEmployee });
    } catch (error) {
        // ESTADO DE ERROR EN INPUT DEL CLIENTE
        res.status(400).json({ message: "Error al actualizar empleado", error: error.message });
    }
};
// DELETE (DELETE)
employeesController.deleteEmployees = async (req, res) => {
    try {
        // Primero obtener el empleado para eliminar la imagen de Cloudinary si existe
        const employee = await Employees.findById(req.params.id);
        // Validar que el empleado si exista
        if (!employee) {
            // ESTADO DE NO ENCONTRADO
            return res.status(404).json({ message: "Empleado no encontrado" });
        }
        // Eliminar imagen de Cloudinary si existe
        if (employee.profilePic) {
            const publicId = employee.profilePic.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`employees/${publicId}`);
        }
        // Eliminar el empleado
        await Employees.findByIdAndDelete(req.params.id);
        // ESTADO DE OK
        res.status(200).json({ message: "Empleado eliminado con éxito" });
    } catch (error) {
        // ESTADO DE ERROR DEL SERVIDOR
        res.status(500).json({ message: "Error al eliminar empleado", error: error.message });
    }
};
export default employeesController;