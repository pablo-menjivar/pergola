import { useEffect, useState, useCallback } from "react"
import { toast } from "react-hot-toast"

// Hook para manejar empleados
const useDataEmployees = () => {
  const API = "https://pergola.onrender.com/api/employees"
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)

  // ✅ USAR useCallback para evitar re-creaciones innecesarias
  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(API, {
        credentials: "include"
      })
      
      if (response.status === 403) {
        console.log("⚠️ Sin permisos para empleados - usuario no autorizado")
        setEmployees([])
        setLoading(false)
        return
      }
      
      if (!response.ok) {
        throw new Error("Hubo un error al obtener los empleados")
      }
      
      const data = await response.json()
      setEmployees(data)
    } catch (error) {
      console.error("Error al obtener empleados:", error)
      if (!error.message.includes("403") && !error.message.includes("sin permisos")) {
        toast.error("Error al cargar empleados")
      }
      setEmployees([])
    } finally {
      setLoading(false)
    }
  }, [API])

  // ✅ useEffect CON DEPENDENCIAS CONTROLADAS
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
  }, [fetchEmployees])

  // ✅ Función fetch unificada
  const fetch = useCallback(async () => {
    try {
      await fetchEmployees()
    } catch (error) {
      console.error("Error en fetch unificado:", error)
    }
  }, [fetchEmployees])

  // ✅ Eliminar cliente por ID con useCallback
  const deleteEmployee = useCallback(async (id) => {
    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      })
      if (!response.ok) {
        throw new Error("Hubo un error al eliminar el empleado")
      }
      toast.success('Empleado eliminado exitosamente')
      fetchEmployees()
    } catch (error) {
      console.error("Error al eliminar empleado:", error)
      toast.error("Error al eliminar empleado")
    }
  }, [API, fetchEmployees])

  // ✅ Handlers protegidos contra errores
  const createHandlers = useCallback((API) => ({
    data: employees,
    loading,
    // Handler para agregar cliente
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
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data)
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al registrar empleado")
        }
        toast.success('Empleado registrado exitosamente')
        fetchEmployees()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al registrar empleado")
        throw error
      }
    },
    // Handler para editar cliente
    onEdit: async (id, data) => {
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
        
        const response = await fetch(`${API}/employees/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data)
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
    onDelete: deleteEmployee
  }), [employees, loading, fetchEmployees, deleteEmployee])

  return {
    employees,
    loading,
    fetch,
    deleteEmployee,
    fetchEmployees,
    createHandlers
  }
}

// Exporta el hook para su uso en otros componentes
export default useDataEmployees