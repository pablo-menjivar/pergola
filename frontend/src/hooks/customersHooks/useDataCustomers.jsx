import { useEffect, useState, useCallback } from "react"
import { toast } from "react-hot-toast"

// Hook personalizado para manejar datos de cliente
const useDataCustomers = () => {
  const API = "https://pergola.onrender.com/api/customers"
  // Estado para almacenar cliente y estado de carga
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true)
      const response = await window.fetch(API, { 
        credentials: "include"
      })
      
      if (response.status === 403) {
        console.log("Sin permisos para clientes")
        setCustomers([])
        return
      }
      
      if (!response.ok) {
        throw new Error("Hubo un error al obtener los clientes")
      }
      
      const data = await response.json()
      setCustomers(data)
    } catch (error) {
      console.error("Error al obtener clientes:", error)
      if (!error.message.includes("403")) {
        toast.error("Error al cargar clientes")
      }
      setCustomers([])
    } finally {
      setLoading(false)
    }
  }, []) 
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
  }, [])

  // Función fetch unificada con protección contra errores
  const refreshData = useCallback(async () => {
    try {
      await fetchCustomers()
    } catch (error) {
      console.error("Error en refresh:", error)
    }
  }, [fetchCustomers])

  // Borra cliente por ID con useCallback
  const deleteCustomer = useCallback(async (id) => {
    try {
      const response = await window.fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      })
      if (!response.ok) {
        throw new Error("Hubo un error al eliminar el cliente")
      }
      toast.success('Cliente eliminado exitosamente')
      await fetchCustomers()
    } catch (error) {
      console.error("Error al eliminar cliente:", error)
      toast.error("Error al eliminar cliente")
    }
  }, [fetchCustomers]) 

  // Crea los handlers para agregar, editar y eliminar clientes
  const createHandlers = useCallback((API) => ({
    data: customers,
    loading,
    // Handler para agregar cliente
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
        const response = await window.fetch(`${API}/customers`, {
          method: "POST",
          headers, // No forzado
          credentials: "include",
          body
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al registrar cliente")
        }
        toast.success('Cliente registrado exitosamente')
        await fetchCustomers()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al registrar cliente")
        throw error
      }
    },
    // Handler para editar cliente
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
        const response = await window.fetch(`${API}/customers/${id}`, {
          method: "PUT",
          headers, // No forzado
          credentials: "include",
          body
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al actualizar cliente")
        }
        toast.success('Cliente actualizado exitosamente')
        await fetchCustomers()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al actualizar cliente")
        throw error
      }
    },
  // Handler para eliminar cliente
  onDelete: deleteCustomer
  }), [customers, loading, fetchCustomers, deleteCustomer])

  return {
    customers,
    loading,
    fetch: refreshData,
    deleteCustomer,
    fetchCustomers,
    createHandlers
  }
}
// Exporta el hook para su uso en otros componentes
export default useDataCustomers