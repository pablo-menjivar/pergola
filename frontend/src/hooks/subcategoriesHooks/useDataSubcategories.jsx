import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"

// Hook para manejar datos de subcategorías
const useDataSubcategories = () => {
  const API = "https://pergola.onrender.com/api/subcategories"
  const [subcategories, setSubcategories] = useState([]) // estado con subcategorías
  const [loading, setLoading] = useState(true) // estado de carga

  // Trae las subcategorías del backend
  const fetchSubcategories = async () => {
    try {
      const response = await fetch(API, { credentials: "include" })
      // Si el usuario no tiene permisos, vacía datos y termina
      if (response.status === 403) { // sin permisos
        console.log("⚠️ Sin permisos para subcategorías")
        setSubcategories([])
        setLoading(false)
        return
      }
      // Si hay error en la respuesta, lanza excepción
      if (!response.ok) throw new Error("Hubo un error al obtener las subcategorías")
      // Si todo bien, guarda los datos
      const data = await response.json()
      setSubcategories(data)
      setLoading(false)
    } catch (error) {
      console.error("Error al obtener subcategorías:", error)
      // Solo muestra toast si no es error de permisos
      if (!error.message.includes("403")) toast.error("Error al cargar subcategorías")
      setLoading(false)
    }
  }

  // Ejecuta la carga inicial al montar el componente
  useEffect(() => {
    fetchSubcategories() // carga inicial al montar
  }, [])

  // Handlers para CRUD
  const createHandlers = (API) => ({
    data: subcategories,
    loading,
    // Handler para agregar subcategoría
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
        const response = await fetch(`${API}/subcategories`, {
          method: "POST",
          headers, // No forzado
          credentials: "include",
          body
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al registrar subcategoría")
        }
        toast.success('Subcategoría registrada exitosamente')
        fetchSubcategories()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al registrar subcategoría")
        throw error
      }
    },
    // Handler para editar subcategoría
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
        const response = await fetch(`${API}/subcategories/${id}`, {
          method: "PUT",
          headers, // No forzado
          credentials: "include",
          body
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al actualizar subcategoría")
        }
        toast.success('Subcategoría actualizada exitosamente')
        fetchSubcategories()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al actualizar subcategoría")
        throw error
      }
    },
    // Handler para eliminar subcategoría
    onDelete: deleteSubcategory // usa la función de borrar
  })

  // Borra subcategoría por ID
  const deleteSubcategory = async (id) => {
    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      })
      if (!response.ok) throw new Error("Hubo un error al eliminar la subcategoría")
      toast.success('Subcategoría eliminada exitosamente')
      fetchSubcategories() // recarga lista
    } catch (error) {
      console.error("Error al eliminar subcategoría:", error)
      toast.error("Error al eliminar subcategoría")
    }
  }

  // Retorna estados y funciones
  return {
    subcategories,
    loading,
    deleteSubcategory,
    fetchSubcategories,
    createHandlers
  }
}

// Exporta el hook para su uso en otros componentes
export default useDataSubcategories
