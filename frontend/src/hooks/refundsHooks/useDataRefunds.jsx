import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

// Hook para manejar reembolsos y sus datos relacionados
const useDataRefunds = () => {
  const API = "https://pergola.onrender.com/api/refunds";
  const [refunds, setRefunds] = useState([]); // Lista de reembolsos
  const [orders, setOrders] = useState([]); // Lista de pedidos
  const [customers, setCustomers] = useState([]); // Lista de clientes
  const [products, setProducts] = useState([]); // lista de items
  const [loading, setLoading] = useState(true); // Estado de carga
  // Cargar reembolsos desde el servidor
  const fetchRefunds = async () => {
    try {
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
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener reembolsos:", error);
      if (!error.message.includes("403") && !error.message.includes("sin permisos")) {
        toast.error("Error al cargar reembolsos");
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
  const fetchOrders = async () => {
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
    fetchRefunds();
    fetchCustomers();
    fetchOrders();
    fetchProducts();
  }, []);
  // Handlers para CRUD de pedidos
  const createHandlers = (API) => ({
    data: refunds, // Devuelve los reembolsos
    loading, // Devuelve si está cargando
    // Agregar reembolso
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
    // Eliminar reembolso
    onDelete: deleteRefund // Usa la función para borrar reembolso
  });
  // Eliminar reembolso por ID
  const deleteRefund = async (id) => {
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
  };
  // Devuelve los datos y funciones listas para usar en componentes
  return {
    refunds,
    customers,
    orders,
    products,
    loading,
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