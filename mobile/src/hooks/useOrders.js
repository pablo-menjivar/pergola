// hooks/useOrders.js
import { useState, useCallback } from "react";

const useOrders = (authToken) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = "https://pergola.onrender.com/api/public/orders";

  const getHeaders = (contentType = "application/json") => ({
    "Content-Type": contentType,
    ...(authToken && { Authorization: `Bearer ${authToken}` }),
  });

  const handleResponse = async (response, defaultMsg) => {
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || defaultMsg);
    return data;
  };

  // CREATE
  const createOrder = useCallback(async (orderData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(orderData),
      });
      const result = await handleResponse(response, "Error al crear pedido");
      setOrders((prev) => [...prev, result.data]);
      return { success: true, data: result.data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  // READ ALL
  const getAllOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL, { headers: getHeaders() });
      const result = await handleResponse(response, "Error al obtener pedidos");
      setOrders(result);
      return { success: true, data: result };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  // READ PUBLIC ORDERS
  const getPublicOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/public`, { headers: getHeaders() });
      const result = await handleResponse(response, "Error al obtener pedidos públicos");
      setOrders(result);
      return { success: true, data: result };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  // READ ONE BY ID
  const getOrderById = useCallback(async (id) => {
    if (!id) return { success: false, error: "ID inválido" };
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/${id}`, { headers: getHeaders() });
      const result = await handleResponse(response, "Error al obtener pedido");
      return { success: true, data: result };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  // UPDATE
  const updateOrder = useCallback(async (id, updates) => {
    if (!id) return { success: false, error: "ID inválido" };
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(updates),
      });
      const result = await handleResponse(response, "Error al actualizar pedido");
      setOrders((prev) => prev.map((order) => (order._id === id ? result.data : order)));
      return { success: true, data: result.data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  // DELETE
  const deleteOrder = useCallback(async (id) => {
    if (!id) return { success: false, error: "ID inválido" };
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE", headers: getHeaders() });
      await handleResponse(response, "Error al eliminar pedido");
      setOrders((prev) => prev.filter((order) => order._id !== id));
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  return {
    orders,
    loading,
    error,
    createOrder,
    getAllOrders,
    getPublicOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
    setOrders,
    setError,
  };
};

export default useOrders;
