import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"

// Hook para manejar datos de cliente
const useDataCustomers = () => {
  const API = "https://pergola.onrender.com/api/customers"
  const [customers, setCustomers] = useState([]) // clientes
  const [loading, setLoading] = useState(true) // estado de carga

  // Obtiene los cliente desde el backend
  const fetchCustomers = async () => {
    try {
      const response = await fetch(API, { credentials: "include" })
      // Si el usuario no tiene permisos, vacía datos y termina
      if (response.status === 403) { // sin permisos
        console.log("⚠️ Sin permisos para cliente")
        setCustomers([])
        setLoading(false)
        return
      }
      // Si hay error en la respuesta, lanza excepción
      if (!response.ok) throw new Error("Hubo un error al obtener los clientes")
      // Si todo bien, guarda los datos
      const data = await response.json()
      setCustomers(data)
      setLoading(false)
    } catch (error) {
      console.error("Error al obtener cliente:", error)
      // Solo muestra toast si no es error de permisos
      if (!error.message.includes("403")) toast.error("Error al cargar cliente")
      setLoading(false)
    }
  }

  // Ejecuta la carga inicial al montar el componente
  useEffect(() => {
    fetchCustomers() // carga al montar
  }, [])

  // Genera handlers para CRUD
  const createHandlers = (API) => ({
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
          headers, // No forzado
          credentials: "include",
          body
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
        if (data.image && data.image instanceof File) {
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
          body
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
    // Handler para eliminar cliente
    onDelete: deleteCustomers // usa la función de borrar
  })

  // Borra cliente por ID
  const deleteCustomers = async (id) => {
    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      })
      if (!response.ok) throw new Error("Hubo un error al eliminar el cliente")
      toast.success('Cliente eliminado exitosamente')
      fetchCustomers()
    } catch (error) {
      console.error("Error al eliminar cliente:", error)
      toast.error("Error al eliminar cliente")
    }
  }

  // Retorna estados y funciones
  return {
    customers,
    loading,
    deleteCustomers,
    fetchCustomers,
    createHandlers
  }
}

// Exporta el hook para su uso en otros componentes
export default useDataCustomers
