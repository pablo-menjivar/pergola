import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"

// Hook para manejar datos de elementos de diseño
const useDataDesignElements = () => {
  const API = "https://pergola-production.up.railway.app/api/designelements"
  const [designelements, setDesignElements] = useState([]) // estado con elementos de diseño
  const [loading, setLoading] = useState(true) // estado de carga
  // Trae los elementos de diseño del backend
  const fetchDesignElements = async () => {
    try {
      const response = await fetch(API, { credentials: "include" })
      // Si el usuario no tiene permisos, muestra mensaje y vacía datos
      if (response.status === 403) { // sin permisos
        console.log("⚠️ Sin permisos para elementos de diseño")
        setDesignElements([])
        setLoading(false)
        return
      }
      // Si hay error en la respuesta, lanza excepción
      if (!response.ok) throw new Error("Hubo un error al obtener los elementos de diseño")
      // Si todo bien, guarda los datos
      const data = await response.json()
      console.log("Design Elements data from API:", data);
      setDesignElements(data)
      setLoading(false)
    } catch (error) {
      console.error("Error al obtener elementos de diseño:", error)
      // Solo muestra toast si no es error de permisos
      if (!error.message.includes("403")) toast.error("Error al cargar elementos de diseño")
      setLoading(false)
    }
  }
  // Ejecuta la carga inicial al montar el componente
  useEffect(() => {
    fetchDesignElements() // carga inicial al montar
  }, [])
  // Handlers para CRUD (agregar, editar, eliminar)
  const createHandlers = (API) => ({
    data: designelements,
    loading,
    // Handler para agregar colección
    onAdd: async (data) => {
      try {
        let body
        let headers = { credentials: "include" }
        // Usa FormData si hay imagen
        if (data.image && data.image instanceof File) {
          const formData = new FormData()
          Object.keys(data).forEach(key => formData.append(key, data[key]))
          body = formData
        } else {
          headers["Content-Type"] = "application/json"
          body = JSON.stringify(data)
        }
        // Realiza la petición POST
        const response = await fetch(`${API}/designelements`, {
          method: "POST",
          headers, // No forzado
          credentials: "include",
          body
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al registrar elemento de diseño")
        }
        toast.success('Elemento de diseño registrado exitosamente')
        fetchDesignElements()
      } catch (error) {
        console.error("Error:", error)
              toast.error(error.message || "Error al registrar elemento de diseño")
        throw error
      }
    },
    // Handler para editar colección
    onEdit: async (id, data) => {
      try {
        let body
        let headers = { credentials: "include" }
        // Igual: usa FormData si hay imagen
        if (data.image && data.image instanceof File) {
          const formData = new FormData()
          Object.keys(data).forEach(key => formData.append(key, data[key]))
          body = formData
        } else {
          headers["Content-Type"] = "application/json"
          body = JSON.stringify(data)
        }
        // Realiza la petición PUT
        const response = await fetch(`${API}/designelements/${id}`, {
          method: "PUT",
          headers: headers, // No forzado
          credentials: "include",
          body
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al actualizar elemento de diseño")
        }
        toast.success('Elemento de diseño actualizado exitosamente')
        fetchDesignElements()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al actualizar elemento de diseño")
        throw error
      }
    },
    // Handler para eliminar colección
    onDelete: deleteDesignElement // usa la función de borrar
  })
  // Borra colección por ID
  const deleteDesignElement = async (id) => {
    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      })
      if (!response.ok) throw new Error("Hubo un error al eliminar el elemento de diseño")
      toast.success('Elemento de diseño eliminado exitosamente')
      fetchDesignElements() // recarga lista
    } catch (error) {
      console.error("Error al eliminar elemento de diseño:", error)
      toast.error("Error al eliminar elemento de diseño")
    }
  }
  // Retorna estados y funciones para usar en componentes
  return {
    designElements: designelements, // Alias para consistencia
    designelements,
    loading,
    deleteDesignElement,
    fetchDesignElements,
    createHandlers
  }

}
// Exporta el hook para su uso en otros componentes
export default useDataDesignElements