import { useEffect, useState, useCallback } from "react"
import { toast } from "react-hot-toast"

// Hook para manejar pedidos y sus datos relacionados
const useDataOrders = () => {
  const API = "https://pergola.onrender.com/api/orders"
  const [orders, setOrders] = useState([])
  const [customers, setCustomers] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // ✅ USAR useCallback para evitar re-creaciones innecesarias
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(API, {
        credentials: "include"
      })
      
      if (response.status === 403) {
        console.log("⚠️ Sin permisos para pedidos - usuario no autorizado")
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
  }, [fetchOrders, fetchCustomers, fetchProducts])

  // ✅ Función fetch unificada
  const fetch = useCallback(async () => {
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

  // ✅ Eliminar pedido por ID con useCallback
  const deleteOrder = useCallback(async (id) => {
    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      })
      if (!response.ok) {
        throw new Error("Hubo un error al eliminar el pedido")
      }
      toast.success('Pedido eliminado exitosamente')
      fetchOrders()
    } catch (error) {
      console.error("Error al eliminar pedido:", error)
      toast.error("Error al eliminar pedido")
    }
  }, [API, fetchOrders])

  // ✅ Handlers protegidos contra errores
  const createHandlers = useCallback((API) => ({
    data: orders,
    loading,
    onAdd: async (data) => {
      try {
        console.log('🔵🔵🔵 [FRONTEND] Iniciando creación de pedido 🔵🔵🔵');
        console.log('📦 Datos originales recibidos en onAdd:', JSON.stringify(data, null, 2));
        
        // Validar que existan items
        if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
          console.log('❌ Error: No hay items en el pedido');
          toast.error('Debe agregar al menos un producto al pedido');
          throw new Error('Debe agregar al menos un producto al pedido');
        }
        
        console.log('📋 Items antes de procesar:', JSON.stringify(data.items, null, 2));
        
        // Procesar items para asegurar estructura correcta
        const processedItems = data.items.map((item, index) => {
          console.log(`🔍 Procesando item ${index}:`, JSON.stringify(item, null, 2));
          
          const processed = {
            itemId: item.itemId || item._id || item,
            quantity: Number(item.quantity) || 1,
            price: Number(item.price) || 0
          };
          
          console.log(`✨ Item ${index} procesado:`, JSON.stringify(processed, null, 2));
          return processed;
        });
        
        console.log('📋 Items procesados finales:', JSON.stringify(processedItems, null, 2));
        
        // Crear objeto final a enviar
        const orderData = {
          ...data,
          items: processedItems,
          subtotal: Number(data.subtotal) || 0,
          total: Number(data.total) || 0
        };
        
        console.log('📦 Datos finales a enviar:', JSON.stringify(orderData, null, 2));
        
        const headers = { "Content-Type": "application/json" };
        const body = JSON.stringify(orderData);
        
        console.log('📡 Enviando petición POST a:', `${API}/orders`);
        console.log('📡 Body stringificado:', body);
        
        const response = await fetch(`${API}/orders`, {
          method: "POST",
          headers,
          credentials: "include",
          body
        });
        
        console.log('📥 Respuesta recibida - Status:', response.status);
        
        const responseData = await response.json();
        console.log('📥 Respuesta JSON:', JSON.stringify(responseData, null, 2));
        
        if (!response.ok) {
          console.log('❌ Error en respuesta del servidor');
          console.log('❌ Mensaje de error:', responseData.message);
          console.log('❌ Detalles:', responseData.details);
          throw new Error(responseData.message || "Error al registrar pedido");
        }
        
        console.log('✅✅✅ Pedido creado exitosamente ✅✅✅');
        toast.success('Pedido registrado exitosamente');
        fetchOrders();
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al registrar pedido")
        throw error
      }
    },
    // Editar pedido
    onEdit: async (id, data) => {
      try {
        console.log('🔵🔵🔵 [FRONTEND] Iniciando edición de pedido 🔵🔵🔵');
        console.log('🆔 ID del pedido:', id);
        console.log('📦 Datos originales recibidos en onEdit:', JSON.stringify(data, null, 2));
        
        // Validar que existan items
        if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
          console.log('❌ Error: No hay items en el pedido');
          toast.error('Debe agregar al menos un producto al pedido');
          throw new Error('Debe agregar al menos un producto al pedido');
        }
        
        console.log('📋 Items antes de procesar:', JSON.stringify(data.items, null, 2));
        
        // Procesar items para asegurar estructura correcta
        const processedItems = data.items.map((item, index) => {
          console.log(`🔍 Procesando item ${index}:`, JSON.stringify(item, null, 2));
          
          const processed = {
            itemId: item.itemId || item._id || item,
            quantity: Number(item.quantity) || 1,
            price: Number(item.price) || 0
          };
          
          console.log(`✨ Item ${index} procesado:`, JSON.stringify(processed, null, 2));
          return processed;
        });
        
        console.log('📋 Items procesados finales:', JSON.stringify(processedItems, null, 2));
        
        // Crear objeto final a enviar
        const orderData = {
          ...data,
          items: processedItems,
          subtotal: Number(data.subtotal) || 0,
          total: Number(data.total) || 0
        };
        
        console.log('📦 Datos finales a enviar:', JSON.stringify(orderData, null, 2));
        
        const headers = { "Content-Type": "application/json" };
        const body = JSON.stringify(orderData);
        
        console.log('📡 Enviando petición PUT a:', `${API}/orders/${id}`);
        console.log('📡 Body stringificado:', body);
        
        const response = await fetch(`${API}/orders/${id}`, {
          method: "PUT",
          headers,
          credentials: "include",
          body
        });
        
        console.log('📥 Respuesta recibida - Status:', response.status);
        
        const responseData = await response.json();
        console.log('📥 Respuesta JSON:', JSON.stringify(responseData, null, 2));
        
        if (!response.ok) {
          console.log('❌ Error en respuesta del servidor');
          console.log('❌ Mensaje de error:', responseData.message);
          console.log('❌ Detalles:', responseData.details);
          throw new Error(responseData.message || "Error al actualizar pedido");
        }
        
        console.log('✅✅✅ Pedido actualizado exitosamente ✅✅✅');
        toast.success('Pedido actualizado exitosamente');
        fetchOrders();
      } catch (error) {
        console.log('❌❌❌ ERROR EN onEdit (FRONTEND) ❌❌❌');
        console.log('Error completo:', error);
        console.log('Mensaje:', error.message);
        console.log('Stack:', error.stack);
        toast.error(error.message || "Error al actualizar pedido");
        throw error;
      }
    },
    onDelete: deleteOrder
  }), [orders, loading, fetchOrders, deleteOrder])

  return {
    orders,
    customers,
    products,
    loading,
    fetch,
    deleteOrder,
    fetchOrders,
    fetchCustomers,
    fetchProducts,
    createHandlers
  }
}

// Exporta el hook para su uso en otros componentes
export default useDataOrders;