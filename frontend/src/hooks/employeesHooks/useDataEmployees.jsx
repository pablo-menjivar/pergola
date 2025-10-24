import { useEffect, useState, useCallback } from "react"
import { toast } from "react-hot-toast"

// Hook personalizado para manejar datos de empleados
const useDataEmployees = () => {
  const API = "https://pergola.onrender.com/api/employees"
  // Estado para almacenar empleados y estado de carga
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true)
      const response = await window.fetch(API, { 
        credentials: "include"
      })
      
      if (response.status === 403) {
        console.log("Sin permisos para empleados")
        setEmployees([])
        return
      }
      
      if (!response.ok) {
        throw new Error("Hubo un error al obtener los empleados")
      }
      
      const data = await response.json()
      setEmployees(data)
    } catch (error) {
      console.error("Error al obtener empleados:", error)
      if (!error.message.includes("403")) {
        toast.error("Error al cargar empleados")
      }
      setEmployees([])
    } finally {
      setLoading(false)
    }
  }, []) 
  useEffect(() => {
    let mounted = true
    
    const loadData = async () => {
      if (mounted) {
        await fetchEmployees()
      }
    }

    loadData()
    
    return () => {
      mounted = false
    }
  }, [])

  // Función fetch unificada con protección contra errores
  const refreshData = useCallback(async () => {
    try {
      await fetchEmployees()
    } catch (error) {
      console.error("Error en refresh:", error)
    }
  }, [fetchEmployees])

  // Borra empleado por ID con useCallback
  const deleteEmployee = useCallback(async (id) => {
    try {
      const response = await window.fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      })
      if (!response.ok) {
        throw new Error("Hubo un error al eliminar el empleado")
      }
      toast.success('Empleado eliminado exitosamente')
      await fetchEmployees()
    } catch (error) {
      console.error("Error al eliminar empleado:", error)
      toast.error("Error al eliminar empleado")
    }
  }, [fetchEmployees]) 

  // Crea los handlers para agregar, editar y eliminar empleados
  const createHandlers = useCallback((API) => ({
    data: employees,
    loading,
    // Handler para agregar empleado
    onAdd: async (data) => {
      try {
        // Usa FormData si hay foto de perfil
        let body
        let headers = { credentials: "include" }

        if (data.profilePic && data.profilePic instanceof File) {
          const formData = new FormData()
          Object.keys(data).forEach(key => {
            formData.append(key, data[key])
          })
          body = formData
          // No se establece el Content-Type para FormData
        } else {
          headers["Content-Type"] = "application/json"
          body = JSON.stringify(data)
        }
        const response = await window.fetch(`${API}/employees`, {
          method: "POST",
          headers, // No forzado
          credentials: "include",
          body
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al registrar empleado")
        }
        toast.success('Empleado registrado exitosamente')
        await fetchEmployees()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al registrar empleado")
        throw error
      }
    },
    // Handler para editar empleado
    onEdit: async (id, data) => {
      try {
        // Usa FormData si hay foto de perfil
        let body
        let headers = { credentials: "include" }

        if (data.profilePic && data.profilePic instanceof File) {
          const formData = new FormData()
          Object.keys(data).forEach(key => {
            formData.append(key, data[key])
          })
          body = formData
          // No se establece el Content-Type para FormData
        } else {
          headers["Content-Type"] = "application/json"
          body = JSON.stringify(data)
        }
        const response = await window.fetch(`${API}/employees/${id}`, {
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
        await fetchEmployees()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al actualizar empleado")
        throw error
      }
    },
  // Handler para eliminar empleado
  onDelete: deleteEmployee
  }), [employees, loading, fetchEmployees, deleteEmployee])

  return {
    employees,
    loading,
    fetch: refreshData,
    deleteEmployee,
    fetchEmployees,
    createHandlers
  }
}
// Exporta el hook para su uso en otros componentes
export default useDataEmployees