// Utility functions para manejar referencias de productos de forma segura

/**
 * Función helper para obtener información de categoría de forma segura
 * @param {Object} product - El objeto producto
 * @returns {Object} - Información de categoría con fallbacks
 */
export const getProductCategoryInfo = (product) => {
  if (!product) return { id: null, name: 'Sin producto' };
  
  return {
    collection: {
      id: product.collection?._id || null,
      name: product.collection?.name || 'Sin colección'
    },
    category: {
      id: product.category?._id || null,
      name: product.category?.name || 'Sin categoría'
    },
    subcategory: {
      id: product.subcategory?._id || null,
      name: product.subcategory?.name || 'Sin subcategoría'
    }
  };
};

/**
 * Función helper para validar si un producto tiene las referencias necesarias
 * @param {Object} product - El objeto producto
 * @returns {Boolean} - True si el producto tiene referencias válidas
 */
export const hasValidReferences = (product) => {
  return !!(product && product.category && product.subcategory && product.collection);
};

/**
 * Función helper para filtrar productos por categoría de forma segura
 * @param {Array} products - Array de productos
 * @param {String} categoryId - ID de la categoría a filtrar
 * @returns {Array} - Productos filtrados
 */
export const filterProductsByCategory = (products, categoryId) => {
  if (!categoryId || !Array.isArray(products)) return products;
  
  return products.filter(product => 
    product && 
    product.category && 
    product.category._id === categoryId
  );
};

/**
 * Función helper para filtrar productos por subcategoría de forma segura
 * @param {Array} products - Array de productos
 * @param {String} subcategoryId - ID de la subcategoría a filtrar
 * @returns {Array} - Productos filtrados
 */
export const filterProductsBySubcategory = (products, subcategoryId) => {
  if (!subcategoryId || !Array.isArray(products)) return products;
  
  return products.filter(product => 
    product && 
    product.subcategory && 
    product.subcategory._id === subcategoryId
  );
};

/**
 * Función helper para filtrar productos por colección de forma segura
 * @param {Array} products - Array de productos
 * @param {String} collectionId - ID de la colección a filtrar
 * @returns {Array} - Productos filtrados
 */
export const filterProductsByCollection = (products, collectionId) => {
  if (!collectionId || !Array.isArray(products)) return products;
  
  return products.filter(product => 
    product && 
    product.collection && 
    product.collection._id === collectionId
  );
};

/**
 * Función helper para obtener subcategorías por categoría de forma segura
 * @param {Array} subcategories - Array de subcategorías
 * @param {String} categoryId - ID de la categoría padre
 * @returns {Array} - Subcategorías filtradas
 */
export const getSubcategoriesByCategory = (subcategories, categoryId) => {
  if (!categoryId || !Array.isArray(subcategories)) return [];
  
  return subcategories.filter(subcategory => 
    subcategory && 
    subcategory.category && 
    subcategory.category._id === categoryId
  );
};

/**
 * Función helper para validar datos de review de forma segura
 * @param {Object} review - El objeto review
 * @returns {Object} - Review con datos seguros
 */
export const getSafeReviewData = (review) => {
  if (!review) return null;
  
  return {
    _id: review._id || null,
    rating: review.rating || 0,
    comment: review.comment || '',
    response: review.response || null,
    createdAt: review.createdAt || new Date().toISOString(),
    customer: {
      _id: review.customer?._id || null,
      username: review.customer?.username || 'Usuario anónimo',
      email: review.customer?.email || null
    },
    product: {
      _id: review.product?._id || review.product || null,
      name: review.product?.name || 'Producto'
    }
  };
};

/**
 * Función helper para calcular precio con descuento de forma segura
 * @param {Object} product - El objeto producto
 * @returns {Object} - Información de precios
 */
export const getProductPricing = (product) => {
  if (!product || !product.price) {
    return {
      originalPrice: 0,
      finalPrice: 0,
      discount: 0,
      hasDiscount: false,
      savings: 0
    };
  }

  const originalPrice = parseFloat(product.price) || 0;
  const discount = parseFloat(product.discount) || 0;
  const hasDiscount = discount > 0 && discount <= 1;
  const finalPrice = hasDiscount ? originalPrice * (1 - discount) : originalPrice;
  const savings = hasDiscount ? originalPrice - finalPrice : 0;

  return {
    originalPrice,
    finalPrice,
    discount,
    hasDiscount,
    savings,
    discountPercentage: hasDiscount ? Math.round(discount * 100) : 0
  };
};

/**
 * Función helper para formatear precio de forma consistente
 * @param {Number} price - El precio a formatear
 * @param {String} currency - Símbolo de moneda (default: '$')
 * @returns {String} - Precio formateado
 */
export const formatPrice = (price, currency = '$') => {
  const numPrice = parseFloat(price) || 0;
  return `${currency}${numPrice.toFixed(2)}`;
};

/**
 * Función helper para obtener estado del producto de forma segura
 * @param {Object} product - El objeto producto
 * @returns {Object} - Información del estado
 */
export const getProductStatus = (product) => {
  if (!product) {
    return {
      status: 'unknown',
      displayText: 'Estado desconocido',
      color: '#9E9E9E',
      available: false
    };
  }

  const status = product.status || 'unknown';
  const stock = parseInt(product.stock) || 0;

  const statusMap = {
    'disponible': {
      status: 'disponible',
      displayText: stock > 0 ? 'Disponible' : 'Sin stock',
      color: stock > 0 ? '#4CAF50' : '#F44336',
      available: stock > 0
    },
    'agotado': {
      status: 'agotado',
      displayText: 'Agotado',
      color: '#F44336',
      available: false
    },
    'en producción': {
      status: 'en producción',
      displayText: 'En producción',
      color: '#FF9800',
      available: false
    },
    'descontinuado': {
      status: 'descontinuado',
      displayText: 'Descontinuado',
      color: '#9E9E9E',
      available: false
    }
  };

  return statusMap[status] || statusMap['unknown'] || {
    status: 'unknown',
    displayText: 'Estado desconocido',
    color: '#9E9E9E',
    available: false
  };
};

/**
 * Función helper para validar y limpiar datos de producto
 * @param {Object} product - El objeto producto
 * @returns {Object} - Producto validado y limpio
 */
export const sanitizeProduct = (product) => {
  if (!product) return null;

  return {
    _id: product._id || null,
    name: product.name || 'Producto sin nombre',
    description: product.description || 'Sin descripción',
    price: parseFloat(product.price) || 0,
    discount: parseFloat(product.discount) || 0,
    stock: parseInt(product.stock) || 0,
    status: product.status || 'unknown',
    images: Array.isArray(product.images) ? product.images : [],
    highlighted: Boolean(product.highlighted),
    // AÑADIR ESTOS CAMPOS:
    codeProduct: product.codeProduct || null,
    movementType: product.movementType || null,
    correlative: product.correlative || null,
    applicableCosts: product.applicableCosts || null,
    hasDiscount: Boolean(product.hasDiscount),
    collection: product.collection ? {
      _id: product.collection._id || null,
      name: product.collection.name || 'Sin nombre'
    } : null,
    category: product.category ? {
      _id: product.category._id || null,
      name: product.category.name || 'Sin nombre'
    } : null,
    subcategory: product.subcategory ? {
      _id: product.subcategory._id || null,
      name: product.subcategory.name || 'Sin nombre'
    } : null
  };
};
/**
 * Función helper para capitalizar texto
 * @param {String} text - Texto a capitalizar
 * @returns {String} - Texto con primera letra mayúscula
 */
export const capitalizeFirst = (text) => {
  if (!text || typeof text !== 'string') return text;
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};