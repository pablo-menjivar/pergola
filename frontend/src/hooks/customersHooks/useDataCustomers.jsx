import { useEffect, useState, useCallback } from "react"
import { toast } from "react-hot-toast"

// Hook para manejar clientes
const useDataCustomers = () => {
  const API = "https://pergola.onrender.com/api/customers"
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)

  // ✅ USAR useCallback para evitar re-creaciones innecesarias
  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(API, {
        credentials: "include"
      })
      
      if (response.status === 403) {
        console.log("⚠️ Sin permisos para clientes - usuario no autorizado")
        setCustomers([])
        setLoading(false)
        return
      }
      
      if (!response.ok) {
        throw new Error("Hubo un error al obtener los clientes")
      }
      
      const data = await response.json()
      setCustomers(data)
    } catch (error) {
      console.error("Error al obtener clientes:", error)
      if (!error.message.includes("403") && !error.message.includes("sin permisos")) {
        toast.error("Error al cargar clientes")
      }
      setCustomers([])
    } finally {
      setLoading(false)
    }
  }, [API])

  // ✅ useEffect CON DEPENDENCIAS CONTROLADAS
  useEffect(() => {
    let mounted = true
    
    const loadData = async () => {
      if (mounted) {
        await fetchCustomers()
      }
    }

    loadData()
    
    return () => {
      mounted = false
    }
  }, [fetchCustomers])

  // ✅ Función fetch unificada
  const fetch = useCallback(async () => {
    try {
      await fetchCustomers()
    } catch (error) {
      console.error("Error en fetch unificado:", error)
    }
  }, [fetchCustomers])

  // ✅ Eliminar cliente por ID con useCallback
  const deleteCustomer = useCallback(async (id) => {
    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      })
      if (!response.ok) {
        throw new Error("Hubo un error al eliminar el cliente")
      }
      toast.success('Cliente eliminado exitosamente')
      fetchCustomers()
    } catch (error) {
      console.error("Error al eliminar cliente:", error)
      toast.error("Error al eliminar cliente")
    }
  }, [API, fetchCustomers])

  // ✅ Handlers protegidos contra errores
  const createHandlers = useCallback((API) => ({
    data: customers,
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
        const response = await fetch(`${API}/customers`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data)
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al registrar cliente")
        }
        toast.success('Cliente registrado exitosamente')
        fetchCustomers()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al registrar cliente")
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
        
        const response = await fetch(`${API}/customers/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data)
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al actualizar cliente")
        }
        toast.success('Cliente actualizado exitosamente')
        fetchCustomers()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al actualizar cliente")
        throw error
      }
    },
    onDelete: deleteCustomer
  }), [customers, loading, fetchCustomers, deleteCustomer])

  return {
    customers,
    loading,
    fetch,
    deleteCustomer,
    fetchCustomers,
    createHandlers
  }
}

// Exporta el hook para su uso en otros componentes
export default useDataCustomers