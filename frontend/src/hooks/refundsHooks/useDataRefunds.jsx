import { useEffect, useState, useCallback } from "react"
import { toast } from "react-hot-toast"

// Hook personalizado para manejar datos de reembolsos
const useDataRefunds = () => {
  const API = "https://pergola.onrender.com/api/refunds"
  // Estado para almacenar reembolsos, clientes, pedidos, productos y estado de carga
  const [refunds, setRefunds] = useState([])
  const [customers, setCustomers] = useState([])
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchRefunds = useCallback(async () => {
    try {
      setLoading(true)
      const response = await window.fetch(API, {
        credentials: "include"
      })
      
      if (response.status === 403) {
        console.log("Sin permisos para reembolsos")
        setRefunds([])
        setLoading(false)
        return
      }
      
      if (!response.ok) {
        throw new Error("Hubo un error al obtener los reembolsos")
      }
      
      const data = await response.json()
      setRefunds(data)
    } catch (error) {
      console.error("Error al obtener reembolsos:", error)
      if (!error.message.includes("403") && !error.message.includes("sin permisos")) {
        toast.error("Error al cargar reembolsos")
      }
      setRefunds([])
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

  const fetchOrders = useCallback(async () => {
    try {
      const response = await window.fetch("https://pergola.onrender.com/api/orders", {
        credentials: "include"
      })
      if (!response.ok) {
        throw new Error("Error al obtener los pedidos")
      }
      const data = await response.json()
      setOrders(data)
    } catch (error) {
      console.error("Error al obtener pedidos:", error)
      setOrders([])
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
          fetchRefunds(),
          fetchCustomers(),
          fetchOrders(),
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
        fetchRefunds(),
        fetchCustomers(),
        fetchOrders(),
        fetchProducts()
      ])
    } catch (error) {
      console.error("Error en fetch unificado:", error)
    }
  }, [fetchRefunds, fetchCustomers, fetchOrders, fetchProducts])

  // Crea los handlers para agregar, editar y eliminar reembolsos
  const createHandlers = useCallback((API) => ({
    data: refunds,
    loading,
    // Handler para agregar reembolso
    onAdd: async (data) => {
      try {
        const response = await fetch(`${API}/refunds`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data)
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al registrar reembolso")
        }
        
        toast.success('Reembolso registrado exitosamente')
        fetchRefunds()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al registrar reembolso")
        throw error
      }
    },
    // Handler para editar reembolso
    onEdit: async (id, data) => {
      try {
        const response = await fetch(`${API}/refunds/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data)
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al actualizar reembolso")
        }
        
        toast.success('Reembolso actualizado exitosamente')
        fetchRefunds()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al actualizar reembolso")
        throw error
      }
    },
    // Handler para eliminar reembolso
    onDelete: async (id) => {
      try {
        const response = await window.fetch(`${API}/refunds/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include"
        })
        
        if (!response.ok) throw new Error("Hubo un error al eliminar el reembolso")
        
        toast.success('Reembolso eliminado exitosamente')
        await fetchRefunds()
      } catch (error) {
        console.error("Error al eliminar reembolso:", error)
        toast.error("Error al eliminar reembolso")
        throw error
      }
    }
  }), [refunds, loading, fetchRefunds])

  return {
    refunds,
    customers,
    orders,
    products,
    loading,
    fetch: refreshData,
    fetchRefunds,
    fetchCustomers,
    fetchOrders,
    fetchProducts,
    createHandlers
  }
}
// Exporto el hook para su uso en otros componentes
export default useDataRefunds