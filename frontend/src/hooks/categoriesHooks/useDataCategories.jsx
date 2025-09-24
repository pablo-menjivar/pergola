import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"

// Hook personalizado para manejar datos de categorías
const useDataCategories = () => {
  const API = "https://pergola-production.up.railway.app/api/categories"
  // Estado para almacenar categorías y estado de carga
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  // Función para obtener las categorías desde la API
  const fetchCategories = async () => {
    try {
      const response = await fetch(API, {
        credentials: "include"
      })
      // Si la respuesta es 403, usuario no autorizado
      if (response.status === 403) {
        console.log("⚠️ Sin permisos para categorías - usuario no autorizado")
        setCategories([])
        setLoading(false)
        return
      }
      if (!response.ok) {
        throw new Error("Hubo un error al obtener las categorías")
      }
      const data = await response.json()
      setCategories(data)
      setLoading(false)
    } catch (error) {
      console.error("Error al obtener categorías:", error)
      // Solo muestra toast si no es error de permisos
      if (!error.message.includes("403") && !error.message.includes("sin permisos")) {
        toast.error("Error al cargar categorías")
      }
      setLoading(false)
    }
  }

  // Obtiene las categorías al montar el componente
  useEffect(() => {
    fetchCategories()
  }, [])

  // Crea los handlers para agregar, editar y eliminar categorías
  const createHandlers = (API) => ({
    data: categories,
    loading,
    // Handler para agregar categoría
    onAdd: async (data) => {
      try {
        // Usa FormData si hay imagen
        let body
        let headers = { credentials: "include" }

        if (data.image && data.image instanceof File) {
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
        const response = await fetch(`${API}/categories`, {
          method: "POST",
          headers, // No forzado
          credentials: "include",
          body
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al registrar categoría")
        }
        toast.success('Categoría registrada exitosamente')
        fetchCategories()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al registrar categoría")
        throw error
      }
    },
    // Handler para editar categoría
    onEdit: async (id, data) => {
      try {
        let body
        let headers = { credentials: "include" }

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
        const response = await fetch(`${API}/categories/${id}`, {
          method: "PUT",
          headers, // No forzado
          credentials: "include",
          body
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al actualizar categoría")
        }
        toast.success('Categoría actualizada exitosamente')
        fetchCategories()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al actualizar categoría")
        throw error
      }
    },
    // Handler para eliminar categoría
    onDelete: deleteCategory
  })

  // Función para eliminar una categoría
  const deleteCategory = async (id) => {
    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      })
      if (!response.ok) {
        throw new Error("Hubo un error al eliminar la categoría")
      }
      toast.success('Categoría eliminada exitosamente')
      fetchCategories()
    } catch (error) {
      console.error("Error al eliminar categoría:", error)
      toast.error("Error al eliminar categoría")
    }
  }

  // Retorna los datos y handlers para usar en componentes
  return {
    categories,
    loading,
    deleteCategory,
    fetchCategories,
    createHandlers
  }
}
// Exporta el hook para su uso en otros componentes
export default useDataCategories