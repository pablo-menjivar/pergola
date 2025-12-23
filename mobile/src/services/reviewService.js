import { apiCall } from '../apiService';

/**
 * Módulo de servicio para manejar las operaciones relacionadas con Reseñas de Productos.
 */

const REVIEW_BASE_URL = '/reviews';

/**
 * Obtiene todas las reseñas para un producto dado.
 * Endpoint sugerido: /products/{productId}/reviews
 * @param {string} productId - ID único del producto.
 * @returns {Promise<Array<object>>} Lista de objetos de reseña.
 */
export const getReviewsByProductId = async (productId) => {
    const endpoint = `/products/${productId}/reviews`;
    return apiCall(endpoint);
};

/**
 * Publica una nueva reseña.
 * @param {object} reviewData - Datos de la reseña (productId, rating, comment).
 * @returns {Promise<object>} La reseña recién creada.
 */
export const postReview = async (reviewData) => {
    return apiCall(REVIEW_BASE_URL, {
        method: 'POST',
        body: JSON.stringify(reviewData),
    });
};

/**
 * Elimina una reseña. (Requiere autenticación de usuario/administrador)
 * @param {string} reviewId - ID de la reseña a eliminar.
 * @returns {Promise<object>} Respuesta vacía o de éxito.
 */
export const deleteReview = async (reviewId) => {
    const endpoint = `${REVIEW_BASE_URL}/${reviewId}`;
    return apiCall(endpoint, {
        method: 'DELETE',
    });
};

export default {
    getReviewsByProductId,
    postReview,
    deleteReview,
};
