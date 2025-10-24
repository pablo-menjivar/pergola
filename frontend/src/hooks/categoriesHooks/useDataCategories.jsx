import { useEffect, useState, useCallback } from "react"
import { toast } from "react-hot-toast"

// Hook personalizado para manejar datos de categorías
const useDataCategories = () => {
  const API = "https://pergola.onrender.com/api/categories"
  // Estado para almacenar categorías y estado de carga
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true)
      const response = await window.fetch(API, { credentials: "include" })
      
      if (response.status === 403) {
        console.log("Sin permisos para categorías")
        setCategories([])
        return
      }
      
      if (!response.ok) throw new Error("Hubo un error al obtener las categorías")
      
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error("Error al obtener categorías:", error)
      if (!error.message.includes("403")) {
        toast.error("Error al cargar categorías")
      }
      setCategories([])
    } finally {
      setLoading(false)
    }
  }, []) 

  useEffect(() => {
    let mounted = true 
    
    const loadData = async () => {
      if (mounted) {
        await fetchCategories()
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
      await fetchCategories()
    } catch (error) {
      console.error("Error en refresh:", error)
    }
  }, [fetchCategories])

  // Borra categoría por ID con useCallback
  const deleteCategory = useCallback(async (id) => {
    try {
      const response = await window.fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      })
      if (!response.ok) throw new Error("Hubo un error al eliminar la categoría")
      toast.success('Categoría eliminada exitosamente')
      await fetchCategories()
    } catch (error) {
      console.error("Error al eliminar categoría:", error)
      toast.error("Error al eliminar categoría")
    }
  }, [fetchCategories])

  // Crea los handlers para agregar, editar y eliminar categorías
  const createHandlers = useCallback((API) => ({
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
        const response = await window.fetch(`${API}/categories`, {
          method: "POST",
          headers, // No forzado
          credentials: "include",
          body
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al crear categoría")
        }
        toast.success('Categoría creada exitosamente')
        await fetchCategories()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al crear categoría")
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
        const response = await window.fetch(`${API}/categories/${id}`, {
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
        await fetchCategories()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al actualizar categoría")
        throw error
      }
    },
    // Handler para eliminar categoría
    onDelete: deleteCategory
  }), [categories, loading, fetchCategories, deleteCategory])

  // Retorna los datos y handlers para usar en componentes
  return {
    categories,
    loading,
    fetch: refreshData,
    deleteCategory,
    fetchCategories,
    createHandlers
  }
}
// Exporta el hook para su uso en otros componentes
export default useDataCategories