// useDataReviews.jsx
import { useEffect, useState, useCallback } from "react"
import { toast } from "react-hot-toast"

// Hook personalizado para manejar reseñas, clientes y productos
const useDataReviews = () => {
  const API = "https://pergola.onrender.com/api/reviews"
  const [reviews, setReviews] = useState([])
  const [customers, setCustomers] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // ✅ USAR useCallback para evitar re-creaciones innecesarias
  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(API, {
        credentials: "include"
      })
      
      if (response.status === 403) {
        console.log("⚠️ Sin permisos para reseñas - usuario no autorizado")
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
      // Solo muestra toast si no es error de permisos
      if (!error.message.includes("403") && !error.message.includes("sin permisos")) {
        toast.error("Error al cargar reseñas") // Muestra error si no es por permisos
      }
      setReviews([])
    } finally {
      setLoading(false)
    }
  }, [API])

  // ✅ USAR useCallback
  const fetchCustomers = useCallback(async () => {
    try {
      const response = await fetch("https://pergola.onrender.com/api/customers", {
        credentials: "include"
      })
      if (!response.ok) {
        throw new Error("Error al obtener clientes")
      }
      const data = await response.json()
      setCustomers(data)
    } catch (error) {
      console.error("Error al obtener clientes:", error)
      setCustomers([])
    }
  }, [])

  // ✅ USAR useCallback
  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch("https://pergola.onrender.com/api/products", {
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

  // ✅ useEffect CON DEPENDENCIAS CONTROLADAS
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
  }, [fetchReviews, fetchCustomers, fetchProducts])

  // ✅ Función fetch unificada
  const fetch = useCallback(async () => {
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

  // ✅ Borra una reseña por su ID con useCallback
  const deleteReview = useCallback(async (id) => {
    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      })
      if (!response.ok) {
        throw new Error("Hubo un error al eliminar la reseña")
      }
      toast.success('Reseña eliminada exitosamente')
      fetchReviews()
    } catch (error) {
      console.error("Error al eliminar reseña:", error)
      toast.error("Error al eliminar reseña")
    }
  }, [API, fetchReviews])

  // ✅ Handlers protegidos contra errores
  const createHandlers = useCallback((API) => ({
    data: reviews,
    loading,
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
    // Edita una reseña existente
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
    onDelete: deleteReview
  }), [reviews, loading, fetchReviews, deleteReview])

  return {
    reviews,
    customers,
    products,
    loading,
    fetch,
    deleteReview,
    fetchReviews,
    fetchCustomers,
    fetchProducts,
    createHandlers
  }
}
export default useDataReviews