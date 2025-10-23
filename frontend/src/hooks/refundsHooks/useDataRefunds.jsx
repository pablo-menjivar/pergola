import { useEffect, useState, useCallback } from "react";
import { toast } from "react-hot-toast";

// Hook para manejar reembolsos y sus datos relacionados
const useDataRefunds = () => {
  const API = "https://pergola.onrender.com/api/refunds";
  const [refunds, setRefunds] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ USAR useCallback para evitar re-creaciones innecesarias
  const fetchRefunds = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(API, {
        credentials: "include"
      });
      
      if (response.status === 403) {
        console.log("⚠️ Sin permisos para reembolsos - usuario no autorizado");
        setRefunds([]);
        setLoading(false);
        return;
      }
      
      if (!response.ok) {
        throw new Error("Hubo un error al obtener los reembolsos");
      }
      
      const data = await response.json();
      setRefunds(data);
    } catch (error) {
      console.error("Error al obtener reembolsos:", error);
      if (!error.message.includes("403") && !error.message.includes("sin permisos")) {
        toast.error("Error al cargar reembolsos");
      }
      setRefunds([]);
    } finally {
      setLoading(false);
    }
  }, [API]);

  // ✅ USAR useCallback
  const fetchCustomers = useCallback(async () => {
    try {
      const response = await fetch("https://pergola.onrender.com/api/customers", {
        credentials: "include"
      });
      if (!response.ok) {
        throw new Error("Error al obtener clientes");
      }
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error("Error al obtener clientes:", error);
      setCustomers([]);
    }
  }, []);

  // ✅ USAR useCallback
  const fetchOrders = useCallback(async () => {
    try {
      const response = await fetch("https://pergola.onrender.com/api/orders", {
        credentials: "include"
      });
      if (!response.ok) {
        throw new Error("Error al obtener pedidos");
      }
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error al obtener pedidos:", error);
      setOrders([]);
    }
  }, []);

  // ✅ USAR useCallback
  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch("https://pergola.onrender.com/api/products", {
        credentials: "include"
      });
      if (!response.ok) {
        throw new Error("Error al obtener productos");
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
      setProducts([]);
    }
  }, []);

  // ✅ useEffect CON DEPENDENCIAS CONTROLADAS
  useEffect(() => {
    let mounted = true;
    
    const loadData = async () => {
      if (mounted) {
        await Promise.all([
          fetchRefunds(),
          fetchCustomers(),
          fetchOrders(),
          fetchProducts()
        ]);
      }
    };

    loadData();
    
    return () => {
      mounted = false;
    }
  }, [fetchRefunds, fetchCustomers, fetchOrders, fetchProducts]);

  // ✅ Función fetch unificada
  const fetch = useCallback(async () => {
    try {
      await Promise.all([
        fetchRefunds(),
        fetchCustomers(),
        fetchOrders(),
        fetchProducts()
      ]);
    } catch (error) {
      console.error("Error en fetch unificado:", error);
    }
  }, [fetchRefunds, fetchCustomers, fetchOrders, fetchProducts]);

  // ✅ Eliminar reembolso por ID con useCallback
  const deleteRefund = useCallback(async (id) => {
    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      });
      if (!response.ok) {
        throw new Error("Hubo un error al eliminar el reembolso");
      }
      toast.success('Reembolso eliminado exitosamente');
      fetchRefunds();
    } catch (error) {
      console.error("Error al eliminar reembolso:", error);
      toast.error("Error al eliminar reembolso");
    }
  }, [API, fetchRefunds]);

  // ✅ Handlers protegidos contra errores
  const createHandlers = useCallback((API) => ({
    data: refunds,
    loading,
    onAdd: async (data) => {
      try {
        const headers = { "Content-Type": "application/json" };
        const body = JSON.stringify(data);
        const response = await fetch(`${API}/refunds`, {
          method: "POST",
          headers,
          credentials: "include",
          body
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al registrar reembolso");
        }
        toast.success('Reembolso registrado exitosamente');
        fetchRefunds();
      } catch (error) {
        console.error("Error:", error);
        toast.error(error.message || "Error al registrar reembolso");
        throw error;
      }
    },
    // Editar reembolso
    onEdit: async (id, data) => {
      try {
        const headers = { "Content-Type": "application/json" };
        const body = JSON.stringify(data);
        const response = await fetch(`${API}/refunds/${id}`, {
          method: "PUT",
          headers,
          credentials: "include",
          body
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al actualizar reembolso");
        }
        toast.success('Reembolso actualizado exitosamente');
        fetchRefunds();
      } catch (error) {
        console.error("Error:", error);
        toast.error(error.message || "Error al actualizar reembolso");
        throw error;
      }
    },
    onDelete: deleteRefund
  }), [refunds, loading, fetchRefunds, deleteRefund]);

  return {
    refunds,
    customers,
    orders,
    products,
    loading,
    fetch,
    fetchRefunds,
    fetchCustomers,
    fetchOrders,
    fetchProducts,
    deleteRefund,
    createHandlers
  };
};
// Exporta el hook para su uso en otros componentes
export default useDataRefunds;