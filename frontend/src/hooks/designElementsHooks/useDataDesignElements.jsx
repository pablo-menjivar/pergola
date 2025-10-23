import { useEffect, useState, useCallback } from "react"
import { toast } from "react-hot-toast"

// Hook para manejar elementos de diseño
const useDataDesignElements = () => {
  const API = "https://pergola.onrender.com/api/designelements"
  const [designelements, setDesignElements] = useState([])
  const [loading, setLoading] = useState(true)

  // ✅ USAR useCallback para evitar re-creaciones innecesarias
  const fetchDesignElements = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(API, {
        credentials: "include"
      })
      
      if (response.status === 403) {
        console.log("⚠️ Sin permisos para elementos de diseño - usuario no autorizado")
        setDesignElements([])
        setLoading(false)
        return
      }
      
      if (!response.ok) {
        throw new Error("Hubo un error al obtener los elementos de diseño")
      }
      
      const data = await response.json()
      setDesignElements(data)
    } catch (error) {
      console.error("Error al obtener elementos de diseño:", error)
      if (!error.message.includes("403") && !error.message.includes("sin permisos")) {
        toast.error("Error al cargar elementos de diseño")
      }
      setDesignElements([])
    } finally {
      setLoading(false)
    }
  }, [API])

  // ✅ useEffect CON DEPENDENCIAS CONTROLADAS
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
  }, [fetchDesignElements])

  // ✅ Función fetch unificada
  const fetch = useCallback(async () => {
    try {
      await fetchDesignElements()
    } catch (error) {
      console.error("Error en fetch unificado:", error)
    }
  }, [fetchDesignElements])

  // ✅ Eliminar cliente por ID con useCallback
  const deleteDesignElement = useCallback(async (id) => {
    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      })
      if (!response.ok) {
        throw new Error("Hubo un error al eliminar el elemento de diseño")
      }
      toast.success('Elemento de diseño eliminado exitosamente')
      fetchDesignElements()
    } catch (error) {
      console.error("Error al eliminar elemento de diseño:", error)
      toast.error("Error al eliminar elemento de diseño")
    }
  }, [API, fetchDesignElements])

  // ✅ Handlers protegidos contra errores
  const createHandlers = useCallback((API) => ({
    data: designelements,
    loading,
    // Handler para agregar cliente
    onAdd: async (data) => {
      try {
        let body
        let headers = { credentials: "include" }
        // Usa FormData si hay imagen
        if (data.profilePic && data.profilePic instanceof File) {
          const formData = new FormData()
          Object.keys(data).forEach(key => {
            formData.append(key, data[key])
          })
          body = formData
        } else {
          headers["Content-Type"] = "application/json"
          body = JSON.stringify(data)
        }
        const response = await fetch(`${API}/designelements`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data)
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al crear elemento de diseño")
        }
        toast.success('Elemento de diseño creado exitosamente')
        fetchDesignElements()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al registrar elemento de diseño")
        throw error
      }
    },
    // Handler para editar cliente
    onEdit: async (id, data) => {
      try {
        let body
        let headers = { credentials: "include" }
        // Usa FormData si hay imagen
        if (data.profilePic && data.profilePic instanceof File) {
          const formData = new FormData()
          Object.keys(data).forEach(key => {
            formData.append(key, data[key])
          })
          body = formData
        } else {
          headers["Content-Type"] = "application/json"
          body = JSON.stringify(data)
        }
        
        const response = await fetch(`${API}/designelements/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data)
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al actualizar elemento de diseño")
        }
        toast.success('Elemento de diseño actualizado exitosamente')
        fetchDesignElements()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al actualizar elemento de diseño")
        throw error
      }
    },
    onDelete: deleteDesignElement
  }), [designelements, loading, fetchDesignElements, deleteDesignElement])

  return {
    designelements,
    loading,
    fetch,
    deleteDesignElement,
    fetchDesignElements,
    createHandlers
  }
}

// Exporta el hook para su uso en otros componentes
export default useDataDesignElements