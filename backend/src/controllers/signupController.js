const signupController = {}
// Importo el modelo de empleados
import employeesModel from "../models/Employees.js"
import bcryptjs from "bcryptjs"
import jsonwebtoken from "jsonwebtoken"
import { config } from "../utils/config.js"
//POST (CREATE)
signupController.registerEmployee = async (req, res) => {
    const {name, lastName, username, email, phoneNumber, birthDate, DUI, password, userType, hireDate, isVerified} = req.body

    try {
        // Verificacion de si el empleado ya existe
        const employeeExist = await employeesModel.findOne({email})
        // Si existe un empleado, entonces se va a responder con un mensaje de error
        if(employeeExist){
            return res.status(409).json({ message: "El empleado ya existe" }) // 409 Conflict
        }
        // Encriptacion de contraseña
        const hashedPassword = await bcryptjs.hash(password, 10)
        const newUser = new employeesModel({name, lastName, username, email, phoneNumber, birthDate: new Date(birthDate), DUI, password: hashedPassword,  userType, hireDate: new Date(hireDate), isVerified: isVerified || false})

        await newUser.save()
        // TOKEN
        jsonwebtoken.sign({id: newUser._id, userType}, config.JWT.secret, { expiresIn: config.JWT.expiresIn}, (err, token) => {
            if (err) {
                console.error("Error al generar el token", err)
                return res.status(500).json({ message: "Error al generar el token" })
            }
            res.cookie("authToken", token)
            return res.status(201).json({ message: "Empleado registrado exitosamente", employee: {
                id: newUser._id,
                name: newUser.name,
                lastName: newUser.lastName,
                email: newUser.email,
                phoneNumber: newUser.phoneNumber,
                birthDate: newUser.birthDate,
                DUI: newUser.DUI,
                password: newUser.password,
                userType: newUser.userType,
                hireDate: newUser.hireDate,
                isVerified: newUser.isVerified
            }})
        })
    } catch (error) {
        console.log("error", error)
        res.status(500).json({ message: "Error interno del servidor", error: error.message })
    }
}
export default signupController 