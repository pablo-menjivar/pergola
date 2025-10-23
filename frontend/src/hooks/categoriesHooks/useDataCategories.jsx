import { useEffect, useState, useCallback } from "react"
import { toast } from "react-hot-toast"

// Hook personalizado para manejar datos de categorías
const useDataCategories = () => {
  const API = "https://pergola.onrender.com/api/categories"
  // Estado para almacenar categorías y estado de carga
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  // ✅ USAR useCallback para evitar re-creaciones innecesarias
    const fetchCategories = useCallback(async () => {
      try {
        setLoading(true) // ✅ Mover setLoading al inicio
        const response = await fetch(API, { credentials: "include" })
        
        if (response.status === 403) {
          console.log("⚠️ Sin permisos para categorías")
          setCategories([])
          setLoading(false)
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
        setCategories([]) // ✅ Asegurar que siempre sea un array
      } finally {
        setLoading(false) // ✅ Usar finally para asegurar que loading se desactive
      }
    }, [API]) // ✅ Dependencias explícitas

  // ✅ useEffect CON DEPENDENCIAS CONTROLADAS
  useEffect(() => {
    let mounted = true // ✅ Flag para evitar updates en componentes desmontados
    
    const loadData = async () => {
      if (mounted) {
        await fetchCategories()
      }
    }

    loadData()
    
    return () => {
      mounted = false // ✅ Cleanup
    }
  }, [fetchCategories]) // ✅ Dependencias del useCallback

  // ✅ Función fetch unificada con protección contra errores
  const fetch = useCallback(async () => {
    try {
      await Promise.all([
        fetchCategories(),
      ])
    } catch (error) {
      console.error("Error en fetch unificado:", error)
    }
  }, [fetchCategories])

  // ✅ Borra categoría por ID con useCallback
  const deleteCategory = useCallback(async (id) => {
    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      })
      if (!response.ok) throw new Error("Hubo un error al eliminar la subcategoría")
      toast.success('Subcategoría eliminada exitosamente')
      fetchCategories()
    } catch (error) {
      console.error("Error al eliminar subcategoría:", error)
      toast.error("Error al eliminar subcategoría")
    }
  }, [API, fetchCategories])

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
  }), [categories, loading, fetchCategories])

  // Retorna los datos y handlers para usar en componentes
  return {
    categories,
    loading,
    fetch,
    fetchCategories,
    createHandlers
  }
}
// Exporta el hook para su uso en otros componentes
export default useDataCategories