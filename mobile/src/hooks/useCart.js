// hooks/useCategories.js
import { useState, useCallback, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useCategories = () => {
  const { API, authToken } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const baseUrl = `${API}/categories`;

  const handleResponse = async (response, defaultMsg) => {
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || defaultMsg);
    return data;
  };

  const getAllCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(baseUrl, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` } });
      const data = await handleResponse(response, "Error al obtener categorías");
      setCategories(data.categories || []);
      return { success: true, data: data.categories || [] };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [baseUrl, authToken]);

  const getCategoryById = useCallback(async (id) => {
    if (!id) return { success: false, error: "ID inválido" };
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseUrl}/${id}`, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` } });
      const data = await handleResponse(response, "Error al obtener categoría");
      setCategory(data.category);
      return { success: true, data: data.category };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [baseUrl, authToken]);

  const createCategory = useCallback(async (newCategory) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(baseUrl, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` }, body: JSON.stringify(newCategory) });
      const data = await handleResponse(response, "Error al crear categoría");
      setCategories(prev => [...prev, data.category]);
      return { success: true, data: data.category };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [baseUrl, authToken]);

  const updateCategory = useCallback(async (id, updatedCategory) => {
    if (!id) return { success: false, error: "ID inválido" };
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseUrl}/${id}`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` }, body: JSON.stringify(updatedCategory) });
      const data = await handleResponse(response, "Error al actualizar categoría");
      setCategories(prev => prev.map(cat => (cat._id === id ? data.category : cat)));
      return { success: true, data: data.category };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [baseUrl, authToken]);

  const deleteCategory = useCallback(async (id) => {
    if (!id) return { success: false, error: "ID inválido" };
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseUrl}/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${authToken}` } });
      const data = await handleResponse(response, "Error al eliminar categoría");
      setCategories(prev => prev.filter(cat => cat._id !== id));
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [baseUrl, authToken]);

  const toggleCategoryStatus = useCallback(async (id, isActive) => {
    if (!id) return { success: false, error: "ID inválido" };
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseUrl}/${id}/status`, { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` }, body: JSON.stringify({ isActive }) });
      const data = await handleResponse(response, "Error al cambiar estado");
      setCategories(prev => prev.map(cat => (cat._id === id ? data.category : cat)));
      return { success: true, data: data.category };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [baseUrl, authToken]);

  return {
    categories,
    category,
    loading,
    error,
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryStatus,
    setCategories,
    setCategory
  };
};

export default useCategories;
