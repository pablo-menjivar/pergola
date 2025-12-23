// hooks/useCollections.js
import { useState, useCallback, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useCollections = () => {
  const { API, authToken } = useContext(AuthContext);
  const [collections, setCollections] = useState([]);
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const baseUrl = `${API}/collections`;

  const handleResponse = async (response, defaultMsg) => {
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || defaultMsg);
    return data;
  };

  const getAllCollections = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(baseUrl, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
      });
      const data = await handleResponse(response, "Error al obtener colecciones");
      setCollections(data.collections || []);
      return { success: true, data: data.collections || [] };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [baseUrl, authToken]);

  const getCollectionById = useCallback(async (id) => {
    if (!id) return { success: false, error: "ID inválido" };
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseUrl}/${id}`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
      });
      const data = await handleResponse(response, "Error al obtener colección");
      setCollection(data.collection);
      return { success: true, data: data.collection };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [baseUrl, authToken]);

  const createCollection = useCallback(async (newCollection) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
        body: JSON.stringify(newCollection),
      });
      const data = await handleResponse(response, "Error al crear colección");
      setCollections(prev => [...prev, data.collection]);
      return { success: true, data: data.collection };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [baseUrl, authToken]);

  const updateCollection = useCallback(async (id, updatedCollection) => {
    if (!id) return { success: false, error: "ID inválido" };
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseUrl}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
        body: JSON.stringify(updatedCollection),
      });
      const data = await handleResponse(response, "Error al actualizar colección");
      setCollections(prev => prev.map(col => (col._id === id ? data.collection : col)));
      return { success: true, data: data.collection };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [baseUrl, authToken]);

  const deleteCollection = useCallback(async (id) => {
    if (!id) return { success: false, error: "ID inválido" };
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseUrl}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authToken}` },
      });
      await handleResponse(response, "Error al eliminar colección");
      setCollections(prev => prev.filter(col => col._id !== id));
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [baseUrl, authToken]);

  const toggleCollectionStatus = useCallback(async (id, isActive) => {
    if (!id) return { success: false, error: "ID inválido" };
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseUrl}/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
        body: JSON.stringify({ isActive }),
      });
      const data = await handleResponse(response, "Error al cambiar estado");
      setCollections(prev => prev.map(col => (col._id === id ? data.collection : col)));
      return { success: true, data: data.collection };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [baseUrl, authToken]);

  return {
    collections,
    collection,
    loading,
    error,
    getAllCollections,
    getCollectionById,
    createCollection,
    updateCollection,
    deleteCollection,
    toggleCollectionStatus,
    setCollections,
    setCollection
  };
};

export default useCollections;