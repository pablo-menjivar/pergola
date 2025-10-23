import { useEffect, useState, useCallback } from "react"
import { toast } from "react-hot-toast"

// Hook para manejar colecciones
const useDataCollections = () => {
  const API = "https://pergola.onrender.com/api/collections"
  const [collections, setCollections] = useState([]) // estado con colecciones
  const [loading, setLoading] = useState(true) // estado de carga

  // ✅ USAR useCallback para evitar re-creaciones innecesarias
  const fetchCollections = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(API, {
        credentials: "include"
      })
      
      if (response.status === 403) {
        console.log("⚠️ Sin permisos para colecciones - usuario no autorizado")
        setCollections([])
        setLoading(false)
        return
      }
      
      if (!response.ok) {
        throw new Error("Hubo un error al obtener las colecciones")
      }
      
      const data = await response.json()
      setCollections(data)
    } catch (error) {
      console.error("Error al obtener colecciones:", error)
      if (!error.message.includes("403") && !error.message.includes("sin permisos")) {
        toast.error("Error al cargar colecciones")
      }
      setCollections([])
    } finally {
      setLoading(false)
    }
  }, [API])

  // ✅ useEffect CON DEPENDENCIAS CONTROLADAS
  useEffect(() => {
    let mounted = true
    
    const loadData = async () => {
      if (mounted) {
        await fetchCollections()
      }
    }

    loadData()
    
    return () => {
      mounted = false
    }
  }, [fetchCollections])

  // ✅ Función fetch unificada
  const fetch = useCallback(async () => {
    try {
      await fetchCollections()
    } catch (error) {
      console.error("Error en fetch unificado:", error)
    }
  }, [fetchCollections])

  // ✅ Eliminar colección por ID con useCallback
  const deleteCollection = useCallback(async (id) => {
    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      })
      if (!response.ok) {
        throw new Error("Hubo un error al eliminar la colección")
      }
      toast.success('Colección eliminada exitosamente')
      fetchCollections()
    } catch (error) {
      console.error("Error al eliminar colección:", error)
      toast.error("Error al eliminar colección")
    }
  }, [API, fetchCollections])

  // ✅ Handlers protegidos contra errores
  const createHandlers = useCallback((API) => ({
    data: collections,
    loading,
    // Handler para agregar colección
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
        
        if (data.image && data.image instanceof File) {
          const formData = new FormData()
          Object.keys(data).forEach(key => formData.append(key, data[key]))
          body = formData
        } else {
          headers["Content-Type"] = "application/json"
          body = JSON.stringify(data)
        }
        
        const response = await fetch(`${API}/collections/${id}`, {
          method: "PUT",
          headers,
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
    onDelete: deleteCollection
  }), [collections, loading, fetchCollections, deleteCollection])

  return {
    collections,
    loading,
    fetch,
    deleteCollection,
    fetchCollections,
    createHandlers
  }
}

export default useDataCollections