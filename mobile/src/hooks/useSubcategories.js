import { useState, useCallback, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useSubcategories = () => {
  const { API, authToken } = useContext(AuthContext);
  const [subcategories, setSubcategories] = useState([]);
  const [subcategory, setSubcategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const baseUrl = `${API}/subcategories`;

  const handleResponse = async (response, defaultMsg) => {
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || defaultMsg);
    return data;
  };

  const getAllSubcategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(baseUrl, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
      });
      const data = await handleResponse(response, "Error al obtener subcategorías");
      setSubcategories(data.subcategories || []);
      return { success: true, data: data.subcategories || [] };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [baseUrl, authToken]);

  const getSubcategoriesByCategoryId = useCallback(async (categoryId) => {
    if (!categoryId) return { success: false, error: "ID de categoría inválido" };
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseUrl}/category/${categoryId}`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
      });
      const data = await handleResponse(response, "Error al obtener subcategorías por categoría");
      setSubcategories(data.subcategories || []);
      return { success: true, data: data.subcategories || [] };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [baseUrl, authToken]);

  const getSubcategoryById = useCallback(async (id) => {
    if (!id) return { success: false, error: "ID inválido" };
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseUrl}/${id}`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
      });
      const data = await handleResponse(response, "Error al obtener subcategoría");
      setSubcategory(data.subcategory);
      return { success: true, data: data.subcategory };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [baseUrl, authToken]);

  const createSubcategory = useCallback(async (newSubcategory) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
        body: JSON.stringify(newSubcategory),
      });
      const data = await handleResponse(response, "Error al crear subcategoría");
      setSubcategories(prev => [...prev, data.subcategory]);
      return { success: true, data: data.subcategory };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [baseUrl, authToken]);

  const updateSubcategory = useCallback(async (id, updatedSubcategory) => {
    if (!id) return { success: false, error: "ID inválido" };
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseUrl}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
        body: JSON.stringify(updatedSubcategory),
      });
      const data = await handleResponse(response, "Error al actualizar subcategoría");
      setSubcategories(prev => prev.map(sub => (sub._id === id ? data.subcategory : sub)));
      return { success: true, data: data.subcategory };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [baseUrl, authToken]);

  const deleteSubcategory = useCallback(async (id) => {
    if (!id) return { success: false, error: "ID inválido" };
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseUrl}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authToken}` },
      });
      await handleResponse(response, "Error al eliminar subcategoría");
      setSubcategories(prev => prev.filter(sub => sub._id !== id));
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [baseUrl, authToken]);

  const toggleSubcategoryStatus = useCallback(async (id, isActive) => {
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
      setSubcategories(prev => prev.map(sub => (sub._id === id ? data.subcategory : sub)));
      return { success: true, data: data.subcategory };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [baseUrl, authToken]);

  return {
    subcategories,
    subcategory,
    loading,
    error,
    getAllSubcategories,
    getSubcategoriesByCategoryId,
    getSubcategoryById,
    createSubcategory,
    updateSubcategory,
    deleteSubcategory,
    toggleSubcategoryStatus,
    setSubcategories,
    setSubcategory
  };
};

export default useSubcategories;