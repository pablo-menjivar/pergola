import { useEffect, useState, useCallback } from "react"
import { toast } from "react-hot-toast"

// Hook personalizado para manejar datos de reseñas
const useDataReviews = () => {
  const API = "https://pergola.onrender.com/api/reviews"
  // Estado para almacenar reseñas, clientes, productos y estado de carga
  const [reviews, setReviews] = useState([])
  const [customers, setCustomers] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true)
      const response = await window.fetch(API, {
        credentials: "include"
      })
      
      if (response.status === 403) {
        console.log("Sin permisos para reseñas")
        setReviews([])
        setLoading(false)
        return
      }
      
      if (!response.ok) {
        throw new Error("Hubo un error al obtener las reseñas")
      }
      
      const data = await response.json()
      setReviews(data)
    } catch (error) {
      console.error("Error al obtener reseñas:", error)
      if (!error.message.includes("403") && !error.message.includes("sin permisos")) {
        toast.error("Error al cargar reseñas")
      }
      setReviews([])
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchCustomers = useCallback(async () => {
    try {
      const response = await window.fetch("https://pergola.onrender.com/api/customers", {
        credentials: "include"
      })
      if (!response.ok) {
        throw new Error("Error al obtener los clientes")
      }
      const data = await response.json()
      setCustomers(data)
    } catch (error) {
      console.error("Error al obtener clientes:", error)
      setCustomers([])
    }
  }, [])

  const fetchProducts = useCallback(async () => {
    try {
      const response = await window.fetch("https://pergola.onrender.com/api/products", {
        credentials: "include"
      })
      if (!response.ok) {
        throw new Error("Error al obtener productos")
      }
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error("Error al obtener productos:", error)
      setProducts([])
    }
  }, [])

  useEffect(() => {
    let mounted = true
    
    const loadData = async () => {
      if (mounted) {
        await Promise.all([
          fetchReviews(),
          fetchCustomers(),
          fetchProducts()
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
        fetchReviews(),
        fetchCustomers(),
        fetchProducts()
      ])
    } catch (error) {
      console.error("Error en fetch unificado:", error)
    }
  }, [fetchReviews, fetchCustomers, fetchProducts])

  // Crea los handlers para agregar, editar y eliminar reseñas
  const createHandlers = useCallback((API) => ({
    data: reviews,
    loading,
    // Handler para agregar reseña
    onAdd: async (data) => {
      try {
        const response = await fetch(`${API}/reviews`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data)
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al registrar reseña")
        }
        
        toast.success('Reseña registrada exitosamente')
        fetchReviews()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al registrar reseña")
        throw error
      }
    },
    // Handler para editar reseña
    onEdit: async (id, data) => {
      try {
        const response = await fetch(`${API}/reviews/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data)
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al actualizar reseña")
        }
        
        toast.success('Reseña actualizada exitosamente')
        fetchReviews()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al actualizar reseña")
        throw error
      }
    },
    // Handler para eliminar reseña
    onDelete: async (id) => {
      try {
        const response = await window.fetch(`${API}/reviews/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include"
        })
        
        if (!response.ok) throw new Error("Hubo un error al eliminar la reseña")
        
        toast.success('Reseña eliminada exitosamente')
        await fetchReviews()
      } catch (error) {
        console.error("Error al eliminar reseña:", error)
        toast.error("Error al eliminar reseña")
        throw error
      }
    }
  }), [reviews, loading, fetchReviews])

  return {
    reviews,
    customers,
    products,
    loading,
    fetch: refreshData,
    fetchReviews,
    fetchCustomers,
    fetchProducts,
    createHandlers
  }
}
// Exporta el hook para su uso en otros componentes
export default useDataReviews