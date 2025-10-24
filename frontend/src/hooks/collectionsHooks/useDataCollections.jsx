import { useEffect, useState, useCallback } from "react"
import { toast } from "react-hot-toast"

// Hook personalizado para manejar datos de colecciones
const useDataCollections = () => {
  const API = "https://pergola.onrender.com/api/collections"
  // Estado para almacenar colecciones y estado de carga
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchCollections = useCallback(async () => {
    try {
      setLoading(true)
      const response = await window.fetch(API, { credentials: "include" })
      
      if (response.status === 403) {
        console.log("Sin permisos para colecciones")
        setCollections([])
        return
      }
      
      if (!response.ok) throw new Error("Hubo un error al obtener las colecciones")
      
      const data = await response.json()
      setCollections(data)
    } catch (error) {
      console.error("Error al obtener colecciones:", error)
      if (!error.message.includes("403")) {
        toast.error("Error al cargar colecciones")
      }
      setCollections([])
    } finally {
      setLoading(false)
    }
  }, []) 

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
  }, []) 

  // Función fetch unificada con protección contra errores
  const refreshData = useCallback(async () => {
    try {
      await fetchCollections()
    } catch (error) {
      console.error("Error en refresh:", error)
    }
  }, [fetchCollections])

  // Borra colección por ID con useCallback
  const deleteCollection = useCallback(async (id) => {
    try {
      const response = await window.fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      })
      if (!response.ok) throw new Error("Hubo un error al eliminar la colección")
      toast.success('Colección eliminada exitosamente')
      await fetchCollections()
    } catch (error) {
      console.error("Error al eliminar colección:", error)
      toast.error("Error al eliminar colección")
    }
  }, [fetchCollections])

  // Crea los handlers para agregar, editar y eliminar colecciones
  const createHandlers = useCallback((API) => ({
    data: collections,
    loading,
    // Handler para agregar colección
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
        const response = await window.fetch(`${API}/collections`, {
          method: "POST",
          headers, // No forzado
          credentials: "include",
          body
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al crear colección")
        }
        toast.success('Colección creada exitosamente')
        await fetchCollections()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al crear colección")
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
          Object.keys(data).forEach(key => {
            formData.append(key, data[key])
          })
          body = formData
        } else {
          headers["Content-Type"] = "application/json"
          body = JSON.stringify(data)
        }
        const response = await window.fetch(`${API}/collections/${id}`, {
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
        await fetchCollections()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al actualizar colección")
        throw error
      }
    },
    // Handler para eliminar colección
    onDelete: deleteCollection
  }), [collections, loading, fetchCollections, deleteCollection])

  // Retorna los datos y handlers para usar en componentes
  return {
    collections,
    loading,
    fetch: refreshData,
    deleteCollection,
    fetchCollections,
    createHandlers
  }
}
// Exporta el hook para su uso en otros componentes
export default useDataCollections