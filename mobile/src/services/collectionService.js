import { apiCall } from '../apiService';

/**
 * Módulo de servicio para manejar las operaciones relacionadas con Colecciones.
 */

const COLLECTION_BASE_URL = '/collections';

/**
 * Obtiene la lista completa de colecciones.
 * @returns {Promise<Array<object>>} Lista de objetos de colección.
 */
export const getCollections = async () => {
    return apiCall(COLLECTION_BASE_URL);
};

/**
 * Obtiene los detalles de una colección específica.
 * @param {string} collectionId - ID único de la colección.
 * @returns {Promise<object>} Los datos de la colección.
 */
export const getCollectionById = async (collectionId) => {
    const endpoint = `${COLLECTION_BASE_URL}/${collectionId}`;
    return apiCall(endpoint);
};

export default {
    getCollections,
    getCollectionById,
};
