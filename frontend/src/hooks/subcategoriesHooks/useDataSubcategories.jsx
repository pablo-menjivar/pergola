import { useEffect, useState, useCallback } from "react"
import { toast } from "react-hot-toast"

// Hook para manejar datos de subcategorías
const useDataSubcategories = () => {
  const API = "https://pergola.onrender.com/api/subcategories"
  const [subcategories, setSubcategories] = useState([]) // estado con subcategorías
  const [loading, setLoading] = useState(true) // estado de carga

  // ✅ USAR useCallback para evitar re-creaciones innecesarias
  const fetchSubcategories = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(API, { credentials: "include" })
      
      if (response.status === 403) {
        console.log("⚠️ Sin permisos para subcategorías")
        setSubcategories([])
        setLoading(false)
        return
      }
      
      if (!response.ok) throw new Error("Hubo un error al obtener las subcategorías")
      
      const data = await response.json()
      setSubcategories(data)
    } catch (error) {
      console.error("Error al obtener subcategorías:", error)
      if (!error.message.includes("403")) toast.error("Error al cargar subcategorías")
      setSubcategories([])
    } finally {
      setLoading(false)
    }
  }, [API])

  // ✅ useEffect CON DEPENDENCIAS CONTROLADAS
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
  }, [fetchSubcategories])

  // ✅ Función fetch unificada
  const fetch = useCallback(async () => {
    try {
      await fetchSubcategories()
    } catch (error) {
      console.error("Error en fetch unificado:", error)
    }
  }, [fetchSubcategories])

  // ✅ Borra subcategoría por ID con useCallback
  const deleteSubcategory = useCallback(async (id) => {
    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      })
      if (!response.ok) throw new Error("Hubo un error al eliminar la subcategoría")
      toast.success('Subcategoría eliminada exitosamente')
      fetchSubcategories()
    } catch (error) {
      console.error("Error al eliminar subcategoría:", error)
      toast.error("Error al eliminar subcategoría")
    }
  }, [API, fetchSubcategories])

  // ✅ Handlers protegidos contra errores
  const createHandlers = useCallback((API) => ({
    data: subcategories,
    loading,
    // Handler para agregar subcategoría
    onAdd: async (data) => {
      try {
        let body
        let headers = { credentials: "include" }
        
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
          headers,
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
          headers: headers,
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
    onDelete: deleteSubcategory
  }), [subcategories, loading, fetchSubcategories, deleteSubcategory])

  return {
    subcategories,
    loading,
    fetch,
    deleteSubcategory,
    fetchSubcategories,
    createHandlers
  }
}

// Exporta el hook para su uso en otros componentes
export default useDataSubcategories