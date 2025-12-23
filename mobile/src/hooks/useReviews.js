// hooks/useReviews.js
import { useState, useCallback } from "react";

const useReviews = (authToken) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_URL = "https://pergola.onrender.com/api/reviews";

  const getHeaders = (contentType = "application/json") => ({
    "Content-Type": contentType,
    ...(authToken && { Authorization: `Bearer ${authToken}` }),
  });

  const handleResponse = async (response, defaultMsg) => {
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || defaultMsg);
    return data;
  };

  const createReview = useCallback(async (reviewData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(reviewData),
      });
      const data = await handleResponse(res, "Error al crear reseña");
      setReviews((prev) => [...prev, data.data || data]);
      return { success: true, data: data.data || data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  const getAllReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL, { method: "GET", headers: getHeaders() });
      const data = await handleResponse(res, "Error al obtener reseñas");
      setReviews(data.data || data);
      return { success: true, data: data.data || data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  const getPublicReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/public`, { method: "GET", headers: getHeaders() });
      const data = await handleResponse(res, "Error al obtener reseñas públicas");
      setReviews(data.data || data);
      return { success: true, data: data.data || data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  const getReviewById = useCallback(async (id) => {
    if (!id) return { success: false, error: "ID inválido" };
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "GET", headers: getHeaders() });
      const data = await handleResponse(res, "Error al obtener reseña");
      return { success: true, data: data.data || data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  const updateReview = useCallback(async (id, updates) => {
    if (!id) return { success: false, error: "ID inválido" };
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(updates),
      });
      const data = await handleResponse(res, "Error al actualizar reseña");
      setReviews((prev) => prev.map((r) => (r._id === id ? data.data || data : r)));
      return { success: true, data: data.data || data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  const deleteReview = useCallback(async (id) => {
    if (!id) return { success: false, error: "ID inválido" };
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE", headers: getHeaders() });
      await handleResponse(res, "Error al eliminar reseña");
      setReviews((prev) => prev.filter((r) => r._id !== id));
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  return {
    reviews,
    loading,
    error,
    createReview,
    getAllReviews,
    getPublicReviews,
    getReviewById,
    updateReview,
    deleteReview,
    setReviews,
  };
};

export default useReviews;
