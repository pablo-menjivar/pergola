// hooks/useCustomer.js
import { useState, useCallback } from "react";

const useCustomer = (authToken) => {
  const [customers, setCustomers] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = "https://pergola.onrender.com/api/public/customers";

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
  const createCustomer = useCallback(async (customerData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(customerData),
      });
      const result = await handleResponse(response, "Error al crear cliente");
      setCustomers(prev => [...prev, result.data]);
      return { success: true, data: result.data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  // READ ALL
  const getAllCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL, { headers: getHeaders() });
      const result = await handleResponse(response, "Error al obtener clientes");
      setCustomers(result);
      return { success: true, data: result };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  // READ ALL PUBLIC
  const getPublicCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/public`, { headers: getHeaders() });
      const result = await handleResponse(response, "Error al obtener clientes públicos");
      setCustomers(result);
      return { success: true, data: result };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  // READ ONE BY ID
  const getCustomerById = useCallback(async (id) => {
    if (!id) return { success: false, error: "ID inválido" };
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/${id}`, { headers: getHeaders() });
      const result = await handleResponse(response, "Error al obtener cliente");
      setCustomer(result);
      return { success: true, data: result };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  // UPDATE
  const updateCustomer = useCallback(async (id, updates) => {
    if (!id) return { success: false, error: "ID inválido" };
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(updates),
      });
      const result = await handleResponse(response, "Error al actualizar cliente");
      setCustomers(prev => prev.map(c => (c._id === id ? result.data : c)));
      setCustomer(result.data);
      return { success: true, data: result.data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  // DELETE
  const deleteCustomer = useCallback(async (id) => {
    if (!id) return { success: false, error: "ID inválido" };
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE", headers: getHeaders() });
      await handleResponse(response, "Error al eliminar cliente");
      setCustomers(prev => prev.filter(c => c._id !== id));
      if (customer?._id === id) setCustomer(null);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [authToken, customer]);

  // DELETE PROFILE PICTURE
  const deleteProfilePic = useCallback(async (id) => {
    if (!id) return { success: false, error: "ID inválido" };
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/${id}/profile-pic`, { method: "DELETE", headers: getHeaders() });
      const result = await handleResponse(response, "Error al eliminar foto de perfil");
      setCustomer(prev => prev ? { ...prev, profilePic: null } : null);
      setCustomers(prev => prev.map(c => (c._id === id ? { ...c, profilePic: null } : c)));
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  return {
    customers,
    customer,
    loading,
    error,
    createCustomer,
    getAllCustomers,
    getPublicCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer,
    deleteProfilePic,
    setCustomer,
    setCustomers,
    setError,
  };
};

export default useCustomer;
