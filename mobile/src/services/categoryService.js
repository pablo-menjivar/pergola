import { apiCall } from '../apiService';

/**
 * Módulo de servicio para manejar las operaciones relacionadas con Categorías.
 */

const CATEGORY_BASE_URL = '/categories';

/**
 * Obtiene la lista completa de categorías y subcategorías.
 * @returns {Promise<Array<object>>} Lista de objetos de categoría.
 */
export const getCategories = async () => {
    return apiCall(CATEGORY_BASE_URL);
};

/**
 * Obtiene los detalles de una categoría específica.
 * @param {string} categoryId - ID único de la categoría.
 * @returns {Promise<object>} Los datos de la categoría.
 */
export const getCategoryById = async (categoryId) => {
    const endpoint = `${CATEGORY_BASE_URL}/${categoryId}`;
    return apiCall(endpoint);
};

export default {
    getCategories,
    getCategoryById,
};
