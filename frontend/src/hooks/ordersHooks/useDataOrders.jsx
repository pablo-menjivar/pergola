import { useEffect, useState, useCallback } from "react"
import { toast } from "react-hot-toast"

// Hook personalizado para manejar datos de pedidos
const useDataOrders = () => {
  const API = "https://pergola.onrender.com/api/orders"
  // Estado para almacenar pedidos, clientes, productos y estado de carga
  const [orders, setOrders] = useState([])
  const [customers, setCustomers] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      const response = await window.fetch(API, {
        credentials: "include"
      })
      
      if (response.status === 403) {
        console.log("Sin permisos para pedidos")
        setOrders([])
        setLoading(false)
        return
      }
      
      if (!response.ok) {
        throw new Error("Hubo un error al obtener los pedidos")
      }
      
      const data = await response.json()
      setOrders(data)
    } catch (error) {
      console.error("Error al obtener pedidos:", error)
      if (!error.message.includes("403") && !error.message.includes("sin permisos")) {
        toast.error("Error al cargar pedidos")
      }
      setOrders([])
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
          fetchOrders(),
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
        fetchOrders(),
        fetchCustomers(),
        fetchProducts()
      ])
    } catch (error) {
      console.error("Error en fetch unificado:", error)
    }
  }, [fetchOrders, fetchCustomers, fetchProducts])

  // Crea los handlers para agregar, editar y eliminar pedidos
  const createHandlers = useCallback((API) => ({
    data: orders,
    loading,
    // Handler para agregar pedido
    onAdd: async (data) => {
      try {
        // Validar que existan items
        if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
          toast.error('Debe agregar al menos un producto al pedido')
          throw new Error('Debe agregar al menos un producto al pedido')
        }
        
        // Procesar items para asegurar estructura correcta
        const processedItems = data.items.map((item) => ({
          itemId: item.itemId || item._id || item,
          quantity: Number(item.quantity) || 1,
          price: Number(item.price) || 0
        }))
        
        // Crear objeto final a enviar
        const orderData = {
          ...data,
          items: processedItems,
          subtotal: Number(data.subtotal) || 0,
          total: Number(data.total) || 0
        }
        
        const response = await fetch(`${API}/orders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(orderData)
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al registrar pedido")
        }
        
        toast.success('Pedido registrado exitosamente')
        fetchOrders()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al registrar pedido")
        throw error
      }
    },
    // Handler para editar pedido
    onEdit: async (id, data) => {
      try {
        // Validar que existan items
        if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
          toast.error('Debe agregar al menos un producto al pedido')
          throw new Error('Debe agregar al menos un producto al pedido')
        }
        
        // Procesar items para asegurar estructura correcta
        const processedItems = data.items.map((item) => ({
          itemId: item.itemId || item._id || item,
          quantity: Number(item.quantity) || 1,
          price: Number(item.price) || 0
        }))
        
        // Crear objeto final a enviar
        const orderData = {
          ...data,
          items: processedItems,
          subtotal: Number(data.subtotal) || 0,
          total: Number(data.total) || 0
        }
        
        const response = await fetch(`${API}/orders/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(orderData)
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al actualizar pedido")
        }
        
        toast.success('Pedido actualizado exitosamente')
        fetchOrders()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al actualizar pedido")
        throw error
      }
    },
    // Handler para eliminar pedido
    onDelete: async (id) => {
      try {
        const response = await window.fetch(`${API}/orders/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include"
        })
        
        if (!response.ok) throw new Error("Hubo un error al eliminar el pedido")
        
        toast.success('Pedido eliminado exitosamente')
        await fetchOrders()
      } catch (error) {
        console.error("Error al eliminar pedido:", error)
        toast.error("Error al eliminar pedido")
        throw error
      }
    }
  }), [orders, loading, fetchOrders])

  return {
    orders,
    customers,
    products,
    loading,
    fetch: refreshData,
    fetchOrders,
    fetchCustomers,
    fetchProducts,
    createHandlers
  }
}
// Exporto el hook para su uso en otros componentes
export default useDataOrders