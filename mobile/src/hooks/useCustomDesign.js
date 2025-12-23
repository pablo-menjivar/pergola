// hooks/useCustomDesign.js
import { useState, useCallback } from "react";

const useCustomDesign = (authToken) => {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = "https://pergola.onrender.com/api/public/customdesigns";

  const getHeaders = (contentType = "application/json") => ({
    "Content-Type": contentType,
    ...(authToken && { Authorization: `Bearer ${authToken}` }),
  });

  const handleResponse = async (response, defaultMsg) => {
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || defaultMsg);
    return data;
  };

  // CREATE DESIGN
  const createDesign = useCallback(async (designData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(designData),
      });
      const result = await handleResponse(response, "Error al crear diseño");
      setDesigns(prev => [...prev, result.data]);
      return { success: true, data: result.data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  // CREATE PUBLIC DESIGN
  const createPublicDesign = useCallback(async (designData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/public`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(designData),
      });
      const result = await handleResponse(response, "Error al crear solicitud pública");
      setDesigns(prev => [...prev, result.data]);
      return { success: true, data: result.data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  // READ ALL DESIGNS
  const getAllDesigns = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL, { headers: getHeaders() });
      const result = await handleResponse(response, "Error al obtener diseños");
      setDesigns(result);
      return { success: true, data: result };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  // READ ONE BY ID
  const getDesignById = useCallback(async (id) => {
    if (!id) return { success: false, error: "ID inválido" };
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/${id}`, { headers: getHeaders() });
      const result = await handleResponse(response, "Error al obtener diseño");
      return { success: true, data: result };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  // UPDATE DESIGN
  const updateDesign = useCallback(async (id, updates) => {
    if (!id) return { success: false, error: "ID inválido" };
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(updates),
      });
      const result = await handleResponse(response, "Error al actualizar diseño");
      setDesigns(prev => prev.map(d => (d._id === id ? result.data : d)));
      return { success: true, data: result.data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  // DELETE DESIGN
  const deleteDesign = useCallback(async (id) => {
    if (!id) return { success: false, error: "ID inválido" };
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE", headers: getHeaders() });
      await handleResponse(response, "Error al eliminar diseño");
      setDesigns(prev => prev.filter(d => d._id !== id));
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  return {
    designs,
    loading,
    error,
    createDesign,
    createPublicDesign,
    getAllDesigns,
    getDesignById,
    updateDesign,
    deleteDesign,
    setDesigns,
    setError,
  };
};

export default useCustomDesign;
