const validatePasswordController = {}
// Libreria que encripta contraseña
import bcryptjs from "bcryptjs"
// Importo el modelo de empleados
import employeesModel from "../models/Employees.js"
// Importo el modelo de clientes
import customersModel from "../models/Customers.js"
// POST (CREATE)
validatePasswordController.validatePassword = async (req, res) => {
    try {
        // Obtener la contraseña actual del usuario
        const { currentPassword } = req.body
        // Obtener el ID y tipo de usuario del usuario 
        const userId = req.userId
        const userType = req.userType

        let user
        // Buscar usuario en los modelos
        if (userType === 'customer') {
        user = await customersModel.findById(userId)
        } else {
        user = await employeesModel.findById(userId)
        }
        // Verificar si el usuario existe
        if (!user) {
            // ESTADO DE ERROR DE NO ENCONTRADO
            return res.status(404).json({ message: "Usuario no encontrado" })
        }
        // Verificar si la contraseña actual coincide con la contraseña encriptada en el modelo
        const isValid = await bcryptjs.compare(currentPassword, user.password)
        if (!isValid) {
            // ESTADO DE ERROR DE INPUT DEL CLIENTE
            return res.status(400).json({ message: "Contraseña incorrecta" })
        }
        // ESTADO DE OK
        res.status(200).json({ message: "Contraseña válida" })
    } catch (error) {
        // ESTADO DE ERROR DEL SERVIDOR
        res.status(500).json({ message: "Error del servidor" })
    }
};
export default validatePasswordController;