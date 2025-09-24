import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"

// Hook para manejar datos de empleados
const useDataEmployees = () => {
  const API = "https://pergola-production.up.railway.app/api/employees"
  const [employees, setEmployees] = useState([]) // empleados
  const [loading, setLoading] = useState(true) // estado de carga

  // Obtiene los empleados desde el backend
  const fetchEmployees = async () => {
    try {
      const response = await fetch(API, { credentials: "include" })
      // Si el usuario no tiene permisos, vacía datos y termina
      if (response.status === 403) { // sin permisos
        console.log("⚠️ Sin permisos para empleados")
        setEmployees([])
        setLoading(false)
        return
      }
      // Si hay error en la respuesta, lanza excepción
      if (!response.ok) throw new Error("Hubo un error al obtener los empleados")
      // Si todo bien, guarda los datos
      const data = await response.json()
      setEmployees(data)
      setLoading(false)
    } catch (error) {
      console.error("Error al obtener empleados:", error)
      // Solo muestra toast si no es error de permisos
      if (!error.message.includes("403")) toast.error("Error al cargar empleados")
      setLoading(false)
    }
  }

  // Ejecuta la carga inicial al montar el componente
  useEffect(() => {
    fetchEmployees() // carga al montar
  }, [])

  // Genera handlers para CRUD
  const createHandlers = (API) => ({
    data: employees,
    loading,
    // Handler para agregar empleados
    onAdd: async (data) => {
      try {
        let body
        let headers = { credentials: "include" }
        // Usa FormData si hay imagen
        if (data.profilePic && data.profilePic instanceof File) {
          const formData = new FormData()
          Object.keys(data).forEach(key => {
            formData.append(key, data[key])
          })
          body = formData
        } else {
          headers["Content-Type"] = "application/json"
          body = JSON.stringify(data)
        }
        const response = await fetch(`${API}/employees`, {
          method: "POST",
          headers, // No forzado
          credentials: "include",
          body
        })
        console.log("📨 Respuesta recibida - Status:", response.status);
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al registrar empleados")
        }
        toast.success('Empleado registrado exitosamente')
        fetchEmployees() 
      } catch (error) {
        console.error("💥 Error en onAdd:", error);
        toast.error(error.message || "Error al registrar empleado")
        throw error
      }
    },
    // Handler para editar empleado
    onEdit: async (id, data) => {
      try {
        let body
        let headers = { credentials: "include" }
        // Usa FormData si hay imagen
        if (data.profilePic && data.profilePic instanceof File) {
          const formData = new FormData()
          Object.keys(data).forEach(key => formData.append(key, data[key]))
          body = formData
        } else {
          headers["Content-Type"] = "application/json"
          body = JSON.stringify(data)
        }
        const response = await fetch(`${API}/employees/${id}`, {
          method: "PUT",
          headers, // No forzado
          credentials: "include",
          body
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al actualizar empleado")
        }
        toast.success('Empleado actualizado exitosamente')
        fetchEmployees() 
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al actualizar empleado")
        throw error
      }
    }, 
    // Handler para eliminar empleado
    onDelete: deleteEmployee // usa la función de borrar
  })
  // Borra empleado por ID
  const deleteEmployee = async (id) => {
    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      })
      if (!response.ok) throw new Error("Hubo un error al eliminar el empleado")
      toast.success('Empleado eliminado exitosamente')
      fetchEmployees()
    } catch (error) {
      console.error("Error al eliminar empleado:", error)
      toast.error("Error al eliminar empleado")
    }
  }
  // Retorna estados y funciones
  return {
    employees,
    loading,
    deleteEmployee,
    fetchEmployees,
    createHandlers
  }
}

// Exporta el hook para su uso en otros componentes
export default useDataEmployees
