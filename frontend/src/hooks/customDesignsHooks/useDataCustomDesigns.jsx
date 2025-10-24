import { useEffect, useState, useCallback } from "react"
import { toast } from "react-hot-toast"

// Hook personalizado para manejar datos de diseño único
const useDataCustomDesigns = () => {
  const API = "https://pergola.onrender.com/api/customdesigns"
  // Estado para almacenar diseño único, elemento de diseño y estado de carga
  const [customdesigns, setCustomDesigns] = useState([])
  const [designelements, setDesignElements] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchCustomDesigns = useCallback(async () => {
    try {
      setLoading(true)
      const response = await window.fetch(API, { credentials: "include" }) 
      
      if (response.status === 403) {
        console.log("Sin permisos para diseños únicos")
        setCustomDesigns([])
        return
      }
      
      if (!response.ok) throw new Error("Hubo un error al obtener los diseños únicos")
      
      const data = await response.json()
      setCustomDesigns(data)
    } catch (error) {
      console.error("Error al obtener diseños únicos:", error)
      if (!error.message.includes("403")) {
        toast.error("Error al cargar diseños únicos")
      }
      setCustomDesigns([])
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchDesignElements = useCallback(async () => {
    try {
      const response = await window.fetch("https://pergola.onrender.com/api/designelements", {
        credentials: "include"
      })
      
      if (!response.ok) {
        throw new Error("Error al obtener elementos de diseño")
      }
      
      const data = await response.json()
      setDesignElements(data)
    } catch (error) {
      console.error("Error al obtener elementos de diseño:", error)
      setDesignElements([])
    }
  }, [])

  useEffect(() => {
    let mounted = true
    
    const loadData = async () => {
      if (mounted) {
        await Promise.all([
          fetchCustomDesigns(),
          fetchDesignElements()
        ])
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
      await Promise.all([
        fetchCustomDesigns(),
        fetchDesignElements()
      ])
    } catch (error) {
      console.error("Error en refresh:", error)
    }
  }, [fetchCustomDesigns, fetchDesignElements])

  // Crea los handlers para agregar, editar y eliminar diseños únicos
  const createHandlers = useCallback((API) => ({
    data: customdesigns,
    loading,
    // Handler para agregar diseño único
    onAdd: async (data) => {
      try {
        const response = await window.fetch(`${API}/customdesigns`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data)
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al crear diseño único")
        }
        toast.success('Diseño único creado exitosamente')
        
        await fetchCustomDesigns()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al crear diseño único")
        throw error
      }
    },
    // Handler para editar diseño único
    onEdit: async (id, data) => {
      try {
        const response = await window.fetch(`${API}/customdesigns/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data)
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al actualizar diseño único")
        }
        
        toast.success('Diseño único actualizado exitosamente')
        await fetchCustomDesigns()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al actualizar diseño único")
        throw error
      }
    },
    // Handler para eliminar diseño único
    onDelete: async (id) => {
      try {
        const response = await window.fetch(`${API}/customdesigns/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include"
        })
        
        if (!response.ok) throw new Error("Hubo un error al eliminar el diseño único")
        
        toast.success('Diseño único eliminado exitosamente')
        await fetchCustomDesigns()
      } catch (error) {
        console.error("Error al eliminar diseño único:", error)
        toast.error("Error al eliminar diseño único")
        throw error
      }
    }
  }), [customdesigns, loading, fetchCustomDesigns])

  return {
    customdesigns,
    designelements,
    loading,
    fetch: refreshData,
    fetchCustomDesigns,
    fetchDesignElements,
    createHandlers
  }
}
// Exporta el hook para su uso en otros componentes
export default useDataCustomDesigns