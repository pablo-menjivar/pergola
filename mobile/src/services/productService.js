import { apiCall } from '../apiService';

/**
 * Módulo de servicio para manejar todas las operaciones relacionadas con Productos.
 * CRUD (Create, Read, Update, Delete)
 */

const PRODUCT_BASE_URL = '/products';

/**
 * Obtiene una lista de productos con opciones de paginación y filtrado.
 * @param {object} params - Parámetros de consulta (page, limit, filters, sort).
 * @returns {Promise<object>} Objeto con lista de productos y metadatos de paginación.
 */
export const getProducts = async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `${PRODUCT_BASE_URL}${queryString ? `?${queryString}` : ''}`;
    return apiCall(endpoint);
};

/**
 * Obtiene los detalles de un producto específico por su ID.
 * @param {string} productId - ID único del producto.
 * @returns {Promise<object>} Los datos del producto.
 */
export const getProductById = async (productId) => {
    const endpoint = `${PRODUCT_BASE_URL}/${productId}`;
    return apiCall(endpoint);
};

/**
 * Crea un nuevo producto. (Requiere autenticación de administrador)
 * @param {object} productData - Datos del nuevo producto.
 * @returns {Promise<object>} El producto recién creado.
 */
export const createProduct = async (productData) => {
    return apiCall(PRODUCT_BASE_URL, {
        method: 'POST',
        body: JSON.stringify(productData),
    });
};

/**
 * Actualiza un producto existente. (Requiere autenticación de administrador)
 * @param {string} productId - ID del producto a actualizar.
 * @param {object} updateData - Datos a actualizar.
 * @returns {Promise<object>} El producto actualizado.
 */
export const updateProduct = async (productId, updateData) => {
    const endpoint = `${PRODUCT_BASE_URL}/${productId}`;
    return apiCall(endpoint, {
        method: 'PUT',
        body: JSON.stringify(updateData),
    });
};

/**
 * Elimina un producto. (Requiere autenticación de administrador)
 * @param {string} productId - ID del producto a eliminar.
 * @returns {Promise<object>} Respuesta vacía o de éxito.
 */
export const deleteProduct = async (productId) => {
    const endpoint = `${PRODUCT_BASE_URL}/${productId}`;
    return apiCall(endpoint, {
        method: 'DELETE',
    });
};

export default {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
