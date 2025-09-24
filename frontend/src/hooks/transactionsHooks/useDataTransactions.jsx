import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

// Hook para manejar transacciones y sus datos relacionados
const useDataTransactions = () => {
  const API = "https://pergola-production.up.railway.app/api/transactions";
  const [transactions, setTransactions] = useState([]); // Lista de transacciones
  const [orders, setOrders] = useState([]); // Lista de pedidos
  const [customers, setCustomers] = useState([]); // Lista de clientes
  const [loading, setLoading] = useState(true); // Estado de carga
  // Cargar transacciones desde el servidor
  const fetchTransactions = async () => {
    try {
      const response = await fetch(API, {
        credentials: "include"
      });
      if (response.status === 403) {
        console.log("⚠️ Sin permisos para transacciones - usuario no autorizado");
        setTransactions([]);
        setLoading(false);
        return;
      }
      if (!response.ok) {
        throw new Error("Hubo un error al obtener las transacciones");
      }
      const data = await response.json();
      setTransactions(data);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener transacciones:", error);
      if (!error.message.includes("403") && !error.message.includes("sin permisos")) {
        toast.error("Error al cargar transacciones");
      }
      setLoading(false);
    }
  };
  // Cargar clientes desde el servidor
  const fetchCustomers = async () => {
    try {
      const response = await fetch("https://pergola-production.up.railway.app/api/customers", {
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
      const response = await fetch("https://pergola-production.up.railway.app/api/orders", {
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
  // Cargar todos los datos relacionados al montar el componente
  useEffect(() => {
    fetchTransactions();
    fetchCustomers();
    fetchOrders();
  }, []);
  // Handlers para CRUD de pedidos
  const createHandlers = (API) => ({
    data: transactions, // Devuelve las transacciones
    loading, // Devuelve si está cargando
    // Agregar transacción
    onAdd: async (data) => {
      try {
        const headers = { "Content-Type": "application/json" };
        const body = JSON.stringify(data);
        const response = await fetch(`${API}/transactions`, {
          method: "POST",
          headers,
          credentials: "include",
          body
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al registrar transacción");
        }
        toast.success('Transacción registrada exitosamente');
        fetchTransactions();
      } catch (error) {
        console.error("Error:", error);
        toast.error(error.message || "Error al registrar transacción");
        throw error;
      }
    },
    // Editar transacción
    onEdit: async (id, data) => {
      try {
        const headers = { "Content-Type": "application/json" };
        const body = JSON.stringify(data);
        const response = await fetch(`${API}/transactions/${id}`, {
          method: "PUT",
          headers,
          credentials: "include",
          body
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al actualizar transacción");
        }
        toast.success('Transacción actualizada exitosamente');
        fetchTransactions();
      } catch (error) {
        console.error("Error:", error);
        toast.error(error.message || "Error al actualizar transacción");
        throw error;
      }
    },
    // Eliminar transacción
    onDelete: deleteTransaction // Usa la función para borrar transacción
  });
  // Eliminar transacción por ID
  const deleteTransaction = async (id) => {
    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      });
      if (!response.ok) {
        throw new Error("Hubo un error al eliminar la transacción");
      }
      toast.success('Transacción eliminada exitosamente');
      fetchTransactions();
    } catch (error) {
      console.error("Error al eliminar la transacción:", error);
      toast.error("Error al eliminar la transacción:");
    }
  };
  // Devuelve los datos y funciones listas para usar en componentes
  return {
    transactions,
    customers,
    orders,
    loading,
    fetchTransactions,
    fetchCustomers,
    fetchOrders,
    deleteTransaction,
    createHandlers
  };
};
// Exporta el hook para su uso en otros componentes
export default useDataTransactions;