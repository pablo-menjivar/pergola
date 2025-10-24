import { useEffect, useState, useCallback } from "react"
import { toast } from "react-hot-toast"

// Hook personalizado para manejar datos de subcategorías
const useDataSubcategories = () => {
  const API = "https://pergola.onrender.com/api/subcategories"
  // Estado para almacenar subcategorías y estado de carga
  const [subcategories, setSubcategories] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchSubcategories = useCallback(async () => {
    try {
      setLoading(true)
      const response = await window.fetch(API, { credentials: "include" })
      
      if (response.status === 403) {
        console.log("Sin permisos para subcategorías")
        setSubcategories([])
        return
      }
      
      if (!response.ok) throw new Error("Hubo un error al obtener las subcategorías")
      
      const data = await response.json()
      setSubcategories(data)
    } catch (error) {
      console.error("Error al obtener subcategorías:", error)
      if (!error.message.includes("403")) {
        toast.error("Error al cargar subcategorías")
      }
      setSubcategories([])
    } finally {
      setLoading(false)
    }
  }, []) 

  useEffect(() => {
    let mounted = true 
    
    const loadData = async () => {
      if (mounted) {
        await fetchSubcategories()
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
      await fetchSubcategories()
    } catch (error) {
      console.error("Error en refresh:", error)
    }
  }, [fetchSubcategories])

  // Borra subcategoría por ID con useCallback
  const deleteSubcategory = useCallback(async (id) => {
    try {
      const response = await window.fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      })
      if (!response.ok) throw new Error("Hubo un error al eliminar la subcategoría")
      toast.success('Subcategoría eliminada exitosamente')
      await fetchSubcategories()
    } catch (error) {
      console.error("Error al eliminar subcategoría:", error)
      toast.error("Error al eliminar subcategoría")
    }
  }, [fetchSubcategories])

  // Crea los handlers para agregar, editar y eliminar subcategorías
  const createHandlers = useCallback((API) => ({
    data: subcategories,
    loading,
    // Handler para agregar subcategoría
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
        const response = await window.fetch(`${API}/subcategories`, {
          method: "POST",
          headers, // No forzado
          credentials: "include",
          body
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al crear subcategoría")
        }
        toast.success('Subcategoría crear exitosamente')
        await fetchSubcategories()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al crear subcategoría")
        throw error
      }
    },
    // Handler para editar subcategoría
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
        const response = await window.fetch(`${API}/subcategories/${id}`, {
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
        await fetchSubcategories()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al actualizar subcategoría")
        throw error
      }
    },
    // Handler para eliminar subcategoría
    onDelete: deleteSubcategory
  }), [subcategories, loading, fetchSubcategories, deleteSubcategory])

  // Retorna los datos y handlers para usar en componentes
  return {
    subcategories,
    loading,
    fetch: refreshData,
    deleteSubcategory,
    fetchSubcategories,
    createHandlers
  }
}
// Exporta el hook para su uso en otros componentes
export default useDataSubcategories