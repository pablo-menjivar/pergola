import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"

// Hook para manejar datos de colecciones
const useDataCollections = () => {
  const API = "https://pergola.onrender.com/api/collections"
  const [collections, setCollections] = useState([]) // estado con colecciones
  const [loading, setLoading] = useState(true) // estado de carga

  // Trae las colecciones del backend
  const fetchCollections = async () => {
    try {
      const response = await fetch(API, { credentials: "include" })
      // Si el usuario no tiene permisos, muestra mensaje y vacía datos
      if (response.status === 403) { // sin permisos
        console.log("⚠️ Sin permisos para colecciones")
        setCollections([])
        setLoading(false)
        return
      }
      // Si hay error en la respuesta, lanza excepción
      if (!response.ok) throw new Error("Hubo un error al obtener las colecciones")
      // Si todo bien, guarda los datos
      const data = await response.json()
      setCollections(data)
      setLoading(false)
    } catch (error) {
      console.error("Error al obtener colecciones:", error)
      // Solo muestra toast si no es error de permisos
      if (!error.message.includes("403")) toast.error("Error al cargar colecciones")
      setLoading(false)
    }
  }

  // Ejecuta la carga inicial al montar el componente
  useEffect(() => {
    fetchCollections() // carga inicial al montar
  }, [])

  // Handlers para CRUD (agregar, editar, eliminar)
  const createHandlers = (API) => ({
    data: collections,
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
        const response = await fetch(`${API}/collections`, {
          method: "POST",
          headers, // No forzado
          credentials: "include",
          body
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al registrar colección")
        }
        toast.success('Colección registrada exitosamente')
        fetchCollections()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al registrar colección")
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
        const response = await fetch(`${API}/collections/${id}`, {
          method: "PUT",
          headers, // No forzado
          credentials: "include",
          body
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al actualizar colección")
        }
        toast.success('Colección actualizada exitosamente')
        fetchCollections()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al actualizar colección")
        throw error
      }
    },
    // Handler para eliminar colección
    onDelete: deleteCollection // usa la función de borrar
  })

  // Borra colección por ID
  const deleteCollection = async (id) => {
    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      })
      if (!response.ok) throw new Error("Hubo un error al eliminar la colección")
      toast.success('Colección eliminada exitosamente')
      fetchCollections() // recarga lista
    } catch (error) {
      console.error("Error al eliminar colección:", error)
      toast.error("Error al eliminar colección")
    }
  }
  // Retorna estados y funciones para usar en componentes
  return {
    collections,
    loading,
    deleteCollection,
    fetchCollections,
    createHandlers
  }
}
// Exporta el hook para su uso en otros componentes
export default useDataCollections