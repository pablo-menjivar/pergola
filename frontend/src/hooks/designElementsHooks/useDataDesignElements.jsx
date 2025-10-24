import { useEffect, useState, useCallback } from "react"
import { toast } from "react-hot-toast"

// Hook personalizado para manejar datos de elementos de diseño
const useDataDesignElements = () => {
  const API = "https://pergola.onrender.com/api/designelements"
  // Estado para almacenar elementos de diseño y estado de carga
  const [designelements, setDesignElements] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchDesignElements = useCallback(async () => {
    try {
      setLoading(true)
      const response = await window.fetch(API, { credentials: "include" })
      
      if (response.status === 403) {
        console.log("Sin permisos para elementos de diseño")
        setDesignElements([])
        return
      }
      
      if (!response.ok) throw new Error("Hubo un error al obtener los elementos de diseño")
      
      const data = await response.json()
      setDesignElements(data)
    } catch (error) {
      console.error("Error al obtener elementos de diseño:", error)
      if (!error.message.includes("403")) {
        toast.error("Error al cargar elementos de diseño")
      }
      setDesignElements([])
    } finally {
      setLoading(false)
    }
  }, []) 

  useEffect(() => {
    let mounted = true 
    
    const loadData = async () => {
      if (mounted) {
        await fetchDesignElements()
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
      await fetchDesignElements()
    } catch (error) {
      console.error("Error en refresh:", error)
    }
  }, [fetchDesignElements])

  // Borra elemento de diseño por ID con useCallback
  const deleteDesignElement = useCallback(async (id) => {
    try {
      const response = await window.fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      })
      if (!response.ok) throw new Error("Hubo un error al eliminar el elemento de diseño")
      toast.success('Elemento de diseño eliminado exitosamente')
      await fetchDesignElements()
    } catch (error) {
      console.error("Error al eliminar elemento de diseño:", error)
      toast.error("Error al eliminar elemento de diseño")
    }
  }, [fetchDesignElements])

  // Crea los handlers para agregar, editar y eliminar elementos de diseño
  const createHandlers = useCallback((API) => ({
    data: designelements,
    loading,
    // Handler para agregar elemento de diseño
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
        const response = await window.fetch(`${API}/designelements`, {
          method: "POST",
          headers, // No forzado
          credentials: "include",
          body
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al crear elemento de diseño")
        }
        toast.success('Elemento de diseño creado exitosamente')
        await fetchDesignElements()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al crear elemento de diseño")
        throw error
      }
    },
    // Handler para editar elemento de diseño
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
        const response = await window.fetch(`${API}/designelements/${id}`, {
          method: "PUT",
          headers, // No forzado
          credentials: "include",
          body
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al actualizar elemento de diseño")
        }
        toast.success('Elemento de diseño actualizada exitosamente')
        await fetchDesignElements()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al actualizar elemento de diseño")
        throw error
      }
    },
    // Handler para eliminar elemento de diseño
    onDelete: deleteDesignElement
  }), [designelements, loading, fetchDesignElements, deleteDesignElement])

  // Retorna los datos y handlers para usar en componentes
  return {
    designelements,
    loading,
    fetch: refreshData,
    deleteDesignElement,
    fetchDesignElements,
    createHandlers
  }
}
// Exporta el hook para su uso en otros componentes
export default useDataDesignElements