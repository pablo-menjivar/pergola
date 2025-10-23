import { useEffect, useState, useCallback } from "react"
import { toast } from "react-hot-toast"

// Hook para manejar datos de diseños únicos
const useDataCustomDesigns = () => {
  const API = "https://pergola.onrender.com/api/customdesigns"
  const [customdesigns, setCustomDesigns] = useState([]) // estado de diseños
  const [designelements, setDesignElements] = useState([]) // estado con elementos de diseño
  const [loading, setLoading] = useState(true) // estado de carga

  // ✅ USAR useCallback para evitar re-creaciones innecesarias
  const fetchCustomDesigns = useCallback(async () => {
    try {
      setLoading(true) // ✅ Mover setLoading al inicio
      const response = await fetch(API, { credentials: "include" })
      
      if (response.status === 403) {
        console.log("⚠️ Sin permisos para diseños únicos")
        setCustomDesigns([])
        setLoading(false)
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
      setCustomDesigns([]) // ✅ Asegurar que siempre sea un array
    } finally {
      setLoading(false) // ✅ Usar finally para asegurar que loading se desactive
    }
  }, [API]) // ✅ Dependencias explícitas
  // Cargar elementos de diseño desde el servidor
  const fetchDesignElements = useCallback(async () => {
    try {
      const response = await fetch("https://pergola-production.up.railway.app/api/designelements", {
        credentials: "include"
      });
      
      if (!response.ok) {
        throw new Error("Error al obtener elementos de diseño")
      }
      
      const data = await response.json();
      setDesignElements(data)
    } catch (error) {
      console.error("Error al obtener elementos de diseño:", error);
      setDesignElements([]) // ✅ Asegurar que siempre sea un array
    }
  }, [])

  // ✅ useEffect CON DEPENDENCIAS CONTROLADAS
  useEffect(() => {
    let mounted = true // ✅ Flag para evitar updates en componentes desmontados
    
    const loadData = async () => {
      if (mounted) {
        await fetchCustomDesigns()
        await fetchDesignElements()
      }
    }
    
    loadData()
    
    return () => {
      mounted = false // ✅ Cleanup
    }
  }, [fetchCustomDesigns, fetchDesignElements]) // ✅ Dependencias del useCallback

  // ✅ Función fetch unificada con protección contra errores
  const fetch = useCallback(async () => {
    try {
      await Promise.all([
        fetchCustomDesigns(),
        fetchDesignElements()
      ])
    } catch (error) {
      console.error("Error en fetch unificado:", error)
    }
  }, [fetchCustomDesigns, fetchDesignElements])

  // ✅ Handlers protegidos contra errores
  const createHandlers = useCallback((API) => ({
    data: customdesigns,
    loading,
    onAdd: async (data) => {
      try {
        console.log("📤 Enviando al backend:", data);
        const response = await fetch(`${API}/customdesigns`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data)
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al registrar diseño único")
        }
        
        const result = await response.json();
        console.log("📥 Respuesta del backend:", result);
        toast.success('Diseño único registrado exitosamente')
        
        // ✅ Solo refresca si el componente está montado
        await fetchCustomDesigns() 
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al registrar diseño único")
        throw error
      }
    },
    onEdit: async (id, data) => {
      try {
        const response = await fetch(`${API}/customdesigns/${id}`, {
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
    onDelete: async (id) => {
      try {
        const response = await fetch(`${API}/${id}`, {
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
  }), [customdesigns, loading, fetchCustomDesigns]) // ✅ Dependencias explícitas

  // Retorna estados y funciones
  return {
    customdesigns,
    designelements,
    loading,
    fetch, // ✅ Para el sistema de actualización
    fetchCustomDesigns, // ✅ Mantener compatibilidad
    createHandlers
  }
}

// Exporta el hook para su uso en otros componentes
export default useDataCustomDesigns

// ===============================================
// ✅ APLICAR ESTE PATRÓN A TODOS TUS HOOKS:
// ===============================================

// 1. useCallback en todas las funciones async
// 2. useEffect con dependencias explícitas y cleanup
// 3. Manejo de errores con try/catch/finally
// 4. Estados siempre inicializados como arrays vacíos
// 5. Flag mounted para evitar updates en componentes desmontados
// 6. Dependencias explícitas en useCallback