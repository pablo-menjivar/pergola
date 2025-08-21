import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

// Hook para manejar pedidos y sus datos relacionados
const useDataOrders = () => {
  const API = "https://pergola.onrender.com/api/orders";
  const [orders, setOrders] = useState([]); // Lista de pedidos
  const [customers, setCustomers] = useState([]); // Lista de clientes
  const [products, setProducts] = useState([]); // Lista de productos
  const [loading, setLoading] = useState(true); // Estado de carga
  // Cargar pedidos desde el servidor
  const fetchOrders = async () => {
    try {
      const response = await fetch(API, {
        credentials: "include"
      });
      if (response.status === 403) {
        console.log("⚠️ Sin permisos para pedidos - usuario no autorizado");
        setOrders([]);
        setLoading(false);
        return;
      }
      if (!response.ok) {
        throw new Error("Hubo un error al obtener los pedidos");
      }
      const data = await response.json();
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener pedidos:", error);
      if (!error.message.includes("403") && !error.message.includes("sin permisos")) {
        toast.error("Error al cargar pedidos");
      }
      setLoading(false);
    }
  };
  // Cargar clientes desde el servidor
  const fetchCustomers = async () => {
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
    }
  };
  // Cargar productos desde el servidor
  const fetchProducts = async () => {
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
    }
  };
  // Cargar todos los datos relacionados al montar el componente
  useEffect(() => {
    fetchOrders();
    fetchCustomers();
    fetchProducts();
  }, []);
  // Handlers para CRUD de pedidos
  const createHandlers = (API) => ({
    data: orders, // Devuelve los pedidos
    loading, // Devuelve si está cargando
    // Agregar pedido
    onAdd: async (data) => {
      try {
        const headers = { "Content-Type": "application/json" };
        const body = JSON.stringify(data);
        const response = await fetch(`${API}/orders`, {
          method: "POST",
          headers,
          credentials: "include",
          body
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al registrar pedido");
        }
        toast.success('Pedido registrado exitosamente');
        fetchOrders();
      } catch (error) {
        console.error("Error:", error);
        toast.error(error.message || "Error al registrar pedido");
        throw error;
      }
    },
    // Editar pedido
    onEdit: async (id, data) => {
      try {
        const headers = { "Content-Type": "application/json" };
        const body = JSON.stringify(data);
        const response = await fetch(`${API}/orders/${id}`, {
          method: "PUT",
          headers,
          credentials: "include",
          body
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al actualizar pedido");
        }
        toast.success('Pedido actualizado exitosamente');
        fetchOrders();
      } catch (error) {
        console.error("Error:", error);
        toast.error(error.message || "Error al actualizar pedido");
        throw error;
      }
    },
    // Eliminar pedido
    onDelete: deleteOrder // Usa la función para borrar pedido
  });
  // Eliminar pedido por ID
  const deleteOrder = async (id) => {
    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      });
      if (!response.ok) {
        throw new Error("Hubo un error al eliminar el pedido");
      }
      toast.success('Pedido eliminado exitosamente');
      fetchOrders();
    } catch (error) {
      console.error("Error al eliminar pedido:", error);
      toast.error("Error al eliminar pedido");
    }
  };
  // Devuelve los datos y funciones listas para usar en componentes
  return {
    orders,
    customers,
    products,
    loading,
    fetchOrders,
    fetchCustomers,
    fetchProducts,
    deleteOrder,
    createHandlers
  };
};
// Exporta el hook para su uso en otros componentes
export default useDataOrders;