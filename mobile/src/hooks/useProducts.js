// hooks/useProducts.js
import { useState, useCallback, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const useProducts = () => {
  const { API, authToken } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const baseUrl = `${API}/products`;

  const getHeaders = (contentType = "application/json") => ({
    "Content-Type": contentType,
    ...(authToken && { Authorization: `Bearer ${authToken}` }),
  });

  const handleResponse = async (response, defaultMsg) => {
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || defaultMsg);
    return data;
  };

  const getAllProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(baseUrl, { headers: getHeaders() });
      const data = await handleResponse(res, "Error al obtener productos");
      setProducts(data.products || []);
      return { success: true, data: data.products || [] };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [baseUrl, authToken]);

  const getProductById = useCallback(async (id) => {
    if (!id) return { success: false, error: "ID inválido" };
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/${id}`, { headers: getHeaders() });
      const data = await handleResponse(res, "Error al obtener el producto");
      setProduct(data.product);
      return { success: true, data: data.product };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [baseUrl, authToken]);

  const createProduct = useCallback(async (newProduct) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(baseUrl, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(newProduct),
      });
      const data = await handleResponse(res, "Error al crear el producto");
      setProducts((prev) => [...prev, data.product]);
      return { success: true, data: data.product };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [baseUrl, authToken]);

  const updateProduct = useCallback(async (id, updatedProduct) => {
    if (!id) return { success: false, error: "ID inválido" };
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(updatedProduct),
      });
      const data = await handleResponse(res, "Error al actualizar el producto");
      setProducts((prev) => prev.map((p) => (p._id === id ? data.product : p)));
      return { success: true, data: data.product };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [baseUrl, authToken]);

  const deleteProduct = useCallback(async (id) => {
    if (!id) return { success: false, error: "ID inválido" };
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/${id}`, { method: "DELETE", headers: getHeaders() });
      await handleResponse(res, "Error al eliminar el producto");
      setProducts((prev) => prev.filter((p) => p._id !== id));
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [baseUrl, authToken]);

  const getProductsByCategory = useCallback(async (categoryId) => {
    if (!categoryId) return { success: false, error: "ID de categoría inválido" };
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/category/${categoryId}`, { headers: getHeaders() });
      const data = await handleResponse(res, "Error al obtener productos por categoría");
      setProducts(data.products || []);
      return { success: true, data: data.products || [] };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [baseUrl, authToken]);

  const getProductsByCollection = useCallback(async (collectionId) => {
    if (!collectionId) return { success: false, error: "ID de colección inválido" };
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/collection/${collectionId}`, { headers: getHeaders() });
      const data = await handleResponse(res, "Error al obtener productos por colección");
      setProducts(data.products || []);
      return { success: true, data: data.products || [] };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [baseUrl, authToken]);

  const getHighlightedProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/highlighted`, { headers: getHeaders() });
      const data = await handleResponse(res, "Error al obtener productos destacados");
      setProducts(data.products || []);
      return { success: true, data: data.products || [] };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [baseUrl, authToken]);

  return {
    products,
    product,
    loading,
    error,
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductsByCategory,
    getProductsByCollection,
    getHighlightedProducts,
    setProducts,
    setProduct,
    setError,
  };
};

export default useProducts;
