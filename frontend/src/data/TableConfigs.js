// Configuración optimizada para Clientes
export const customersConfig = {
  title: "Clientes",
  columns: [
    { key: 'name', label: 'Nombre', sortable: true, searchable: true, priority: 1 },
    { key: 'lastName', label: 'Apellido', sortable: true, searchable: true, priority: 1 },
    { key: 'email', label: 'Email', sortable: true, searchable: true, priority: 1 },
    { key: 'phoneNumber', label: 'Teléfono', searchable: true, priority: 2 },
    { key: 'isVerified', label: 'Verificado', sortable: true, type: 'boolean', priority: 2 },
    { key: 'createdAt', label: 'Registro', sortable: true, type: 'date', priority: 3 },
    // Campos ocultos por defecto (visibles en detalles)
    { key: 'username', label: 'Usuario', sortable: true, searchable: true, hidden: true },
    { key: 'birthDate', label: 'F. Nacimiento', sortable: true, type: 'date', hidden: true },
    { key: 'DUI', label: 'DUI', sortable: true, searchable: true, hidden: true },
    { key: 'address', label: 'Dirección', searchable: true, hidden: true },
    { key: 'profilePic', label: 'Foto', type: 'image', hidden: true },
    { key: 'preferredColors', label: 'Colores Pref.', searchable: true, hidden: true },
    { key: 'preferredMaterials', label: 'Materiales Pref.', searchable: true, hidden: true },
    { key: 'preferredJewelStyle', label: 'Estilo Pref.', searchable: true, hidden: true },
    { key: 'purchaseOpportunity', label: 'Oportunidad', searchable: true, hidden: true },
    { key: 'allergies', label: 'Alergias', searchable: true, hidden: true },
    { key: 'jewelSize', label: 'Tamaño', sortable: true, hidden: true },
    { key: 'budget', label: 'Presupuesto', sortable: true, hidden: true }
  ],
  actions: {
    canAdd: true,
    canEdit: true,
    canDelete: true,
    canExport: true,
    canView: true,
    canToggleColumns: true // Nueva funcionalidad para mostrar/ocultar columnas
  },
  formFields: [
    { name: 'name', type: 'text', label: 'Nombre', required: true, placeholder: 'Ej: Juan' },
    { name: 'lastName', type: 'text', label: 'Apellido', required: true, placeholder: 'Ej: Pérez' },
    { name: 'username', type: 'text', label: 'Usuario', required: true, placeholder: 'Ej: juanperez' },
    { name: 'email', type: 'email', label: 'Correo Electrónico', required: true, placeholder: 'correo@ejemplo.com' },
    { name: 'phoneNumber', type: 'tel', label: 'Teléfono', required: true, placeholder: 'Ej: +503-7123-4567', helperText: 'Formato: +503 seguido de 8 dígitos (ej: +503-7123-4567)' },
    { name: 'birthDate', type: 'date', label: 'Fecha de Nacimiento', required: true },
    { name: 'DUI', type: 'text', label: 'DUI', required: true, placeholder: '12345678-9' },
    { name: 'password', type: 'password', label: 'Contraseña', required: true, placeholder: '********' },
    { name: 'profilePic', type: 'image', label: 'Foto de Perfil', accept: 'image/*', placeholder: 'Seleccionar imagen' },
    { name: 'address', type: 'textarea', label: 'Dirección', required: true, placeholder: 'Dirección completa...', rows: 2 },
    { name: 'isVerified', type: 'checkbox', label: 'Verificado' },
    { name: 'preferredColors', type: 'text', label: 'Colores Preferidos', required: false, placeholder: 'Ej: dorado, plateado' },
    { name: 'preferredMaterials', type: 'text', label: 'Materiales Preferidos', required: false, placeholder: 'Ej: oro, plata' },
    { name: 'preferredJewelStyle', type: 'text', label: 'Estilo de Joya Preferido', required: false, placeholder: 'Ej: clásico, moderno' },
    { name: 'purchaseOpportunity', type: 'text', label: 'Oportunidad de Compra', required: false, placeholder: 'Ej: cumpleaños' },
    { name: 'allergies', type: 'text', label: 'Alergias', required: false, placeholder: 'Ej: níquel' },
    { name: 'jewelSize', type: 'select', label: 'Tamaño de Joya', required: false, options: [
      { value: 'pequeño', label: 'Pequeño' },
      { value: 'mediano', label: 'Mediano' },
      { value: 'grande', label: 'Grande' },
      { value: 'muy grande', label: 'Muy grande' }
    ] },
    { name: 'budget', type: 'text', label: 'Presupuesto', required: false, placeholder: 'Ej: $100' }
  ]
}

// Configuración optimizada para Empleados
export const employeesConfig = {
  title: "Empleados",
  columns: [
    { key: 'name', label: 'Nombre', sortable: true, searchable: true, priority: 1 },
    { key: 'lastName', label: 'Apellido', sortable: true, searchable: true, priority: 1 },
    { key: 'email', label: 'Email', sortable: true, searchable: true, priority: 1 },
    { key: 'hireDate', label: 'F. Contrato', sortable: true, type: 'date', priority: 2 },
    { key: 'isVerified', label: 'Verificado', sortable: true, type: 'boolean', priority: 2 },
    // Campos ocultos por defecto
    { key: 'username', label: 'Usuario', sortable: true, searchable: true, hidden: true },
    { key: 'phoneNumber', label: 'Teléfono', searchable: true, hidden: true },
    { key: 'birthDate', label: 'F. Nacimiento', sortable: true, type: 'date', hidden: true },
    { key: 'DUI', label: 'DUI', sortable: true, searchable: true, hidden: true },
    { key: 'profilePic', label: 'Foto', type: 'image', hidden: true },
    { key: 'createdAt', label: 'Registro', sortable: true, type: 'date', hidden: true }
  ],
  actions: {
    canAdd: true,
    canEdit: true,
    canDelete: true,
    canExport: true,
    canView: true,
    canToggleColumns: true
  },
  formFields: [
    { name: 'name', type: 'text', label: 'Nombre', required: true, placeholder: 'Ej: Juan' },
    { name: 'lastName', type: 'text', label: 'Apellido', required: true, placeholder: 'Ej: Pérez' },
    { name: 'username', type: 'text', label: 'Usuario', required: true, placeholder: 'Ej: juanperez' },
    { name: 'email', type: 'email', label: 'Correo Electrónico', required: true, placeholder: 'correo@ejemplo.com' },
    { name: 'phoneNumber', type: 'tel', label: 'Teléfono', required: true, placeholder: 'Ej: +503-7123-4567', helperText: 'Formato: +503 seguido de 8 dígitos (ej: +503-7123-4567)' },
    { name: 'birthDate', type: 'date', label: 'Fecha de Nacimiento', required: true },
    { name: 'DUI', type: 'text', label: 'DUI', required: true, placeholder: '12345678-9' },
    { name: 'password', type: 'password', label: 'Contraseña', required: true, placeholder: '********' },
    { name: 'hireDate', type: 'date', label: 'Fecha de Contratación', required: true },
    { name: 'profilePic', type: 'image', label: 'Foto de Perfil', accept: 'image/*', placeholder: 'Seleccionar imagen' },
    { name: 'isVerified', type: 'checkbox', label: 'Verificado' }
  ]
}

// Configuración optimizada para Categorías
export const categoriesConfig = {
  title: "Categorías",
  columns: [
    { key: 'name', label: 'Nombre', sortable: true, searchable: true, priority: 1 },
    { key: 'description', label: 'Descripción', searchable: true, priority: 2, truncate: 50 },
    { key: 'isActive', label: 'Estado', sortable: true, type: 'status', priority: 1 },
    { key: 'createdAt', label: 'Creada', sortable: true, type: 'date', priority: 3 },
    // Campos ocultos
    { key: 'image', label: 'Imagen', type: 'image', hidden: true }
  ],
  actions: {
    canAdd: true,
    canEdit: true,
    canDelete: true,
    canExport: true,
    canView: true,
    canToggleColumns: true
  },
  formFields: [
    { name: 'name', type: 'text', label: 'Nombre de la Categoría', required: true, placeholder: 'Ej: Diseños pre-establecidos' },
    { name: 'description', type: 'textarea', label: 'Descripción', required: true, placeholder: 'Describe la categoría...', rows: 3 },
    { name: 'image', type: 'image', label: 'Imagen', accept: 'image/*', placeholder: 'Seleccionar imagen' }
  ]
}

// Configuración optimizada para Subcategorías
export const subcategoriesConfig = {
  title: "Subcategorías",
  columns: [
    { key: 'name', label: 'Nombre', sortable: true, searchable: true, priority: 1 },
    { key: 'description', label: 'Descripción', searchable: true, priority: 2, truncate: 50 },
    { key: 'isActive', label: 'Estado', sortable: true, type: 'status', priority: 1 },
    { key: 'createdAt', label: 'Creada', sortable: true, type: 'date', priority: 3 },
    // Campos ocultos
    { key: 'image', label: 'Imagen', type: 'image', hidden: true }
  ],
  actions: {
    canAdd: true,
    canEdit: true,
    canDelete: true,
    canExport: true,
    canView: true,
    canToggleColumns: true
  },
  formFields: [
    { name: 'name', type: 'text', label: 'Nombre de la Subcategoría', required: true, placeholder: 'Ej: Dijes' },
    { name: 'description', type: 'textarea', label: 'Descripción', required: true, placeholder: 'Describe la categoría...', rows: 3 },
    { name: 'image', type: 'image', label: 'Imagen', accept: 'image/*', placeholder: 'Seleccionar imagen' }
  ]
}

// Configuración optimizada para Colecciones
export const collectionsConfig = {
  title: "Colecciones",
  columns: [
    { key: 'name', label: 'Nombre', sortable: true, searchable: true, priority: 1 },
    { key: 'description', label: 'Descripción', searchable: true, priority: 2, truncate: 50 },
    { key: 'isActive', label: 'Estado', sortable: true, type: 'status', priority: 1 },
    { key: 'createdAt', label: 'Creada', sortable: true, type: 'date', priority: 3 },
    // Campos ocultos
    { key: 'image', label: 'Imagen', type: 'image', hidden: true }
  ],
  actions: {
    canAdd: true,
    canEdit: true,
    canDelete: true,
    canExport: true,
    canView: true,
    canToggleColumns: true
  },
  formFields: [
    { name: 'name', type: 'text', label: 'Nombre de la Colección', required: true, placeholder: 'Ej: Cristal Bohemio' },
    { name: 'description', type: 'textarea', label: 'Descripción', required: true, placeholder: 'Describe la categoría...', rows: 3 },
    { name: 'image', type: 'image', label: 'Imagen', accept: 'image/*', placeholder: 'Seleccionar imagen' }
  ]
}

// Configuración optimizada para Proveedores
export const suppliersConfig = {
  title: "Proveedores",
  columns: [
    { key: 'name', label: 'Proveedor', sortable: true, searchable: true, priority: 1 },
    { key: 'contactPerson', label: 'Contacto', sortable: true, searchable: true, priority: 1 },
    { key: 'email', label: 'Email', sortable: true, searchable: true, priority: 2 },
    { key: 'phoneNumber', label: 'Teléfono', searchable: true, priority: 2 },
    { key: 'createdAt', label: 'Registro', sortable: true, type: 'date', priority: 3 },
    // Campos ocultos
    { key: 'address', label: 'Dirección', searchable: true, hidden: true }
  ],
  actions: {
    canAdd: true,
    canEdit: true,
    canDelete: true,
    canExport: true,
    canView: true,
    canToggleColumns: true
  },
  formFields: [
    { name: 'name', type: 'text', label: 'Nombre del Proveedor', required: true, placeholder: 'Ej: Distcaribe' },
    { name: 'contactPerson', type: 'text', label: 'Persona de Contacto', required: true, placeholder: 'Ej: Juan Pérez' },
    { name: 'phoneNumber', type: 'tel', label: 'Teléfono', required: true, placeholder: 'Ej: +503-7123-4567', helperText: 'Formato: +503 seguido de 8 dígitos (ej: +503-7123-4567)' },
    { name: 'email', type: 'email', label: 'Correo electrónico', required: true, placeholder: 'proveedor@email.com' },
    { name: 'address', type: 'textarea', label: 'Dirección', required: true, placeholder: 'Dirección completa...', rows: 2 }
  ]
}

// Configuración optimizada para Productos
export const productsConfig = {
  title: "Productos",
  columns: [
    { key: 'codeProduct', label: 'Código', sortable: true, searchable: true, priority: 1, width: 120 },
    { key: 'name', label: 'Producto', sortable: true, searchable: true, priority: 1, width: 200 },
    { key: 'price', label: 'Precio', sortable: true, type: 'currency', priority: 1, width: 100 },
    { key: 'stock', label: 'Stock', sortable: true, type: 'number', priority: 1, width: 80 },
    { key: 'status', label: 'Estado', sortable: true, type: 'badge', priority: 1, width: 100 },
    { key: 'highlighted', label: 'Destacado', sortable: true, type: 'boolean', priority: 2, width: 90 },
    // Campos ocultos por defecto
    { key: 'description', label: 'Descripción', searchable: true, hidden: true },
    { key: 'images', label: 'Imágenes', type: 'image-gallery', hidden: true },
    { key: 'productionCost', label: 'Costo Prod.', sortable: true, type: 'currency', hidden: true },
    { key: 'discount', label: 'Descuento', sortable: true, type: 'percentage', hidden: true },
    { key: 'collection', label: 'Colección', sortable: true, hidden: true },
    { key: 'category', label: 'Categoría', sortable: true, hidden: true },
    { key: 'subcategory', label: 'Subcategoría', sortable: true, hidden: true },
    { key: 'rawMaterialsUsed', label: 'Materiales', type: 'badge-list', hidden: true },
    { key: 'correlative', label: 'Correlativo', sortable: true, hidden: true },
    { key: 'movementType', label: 'Tipo Mov.', sortable: true, type: 'badge', hidden: true },
    { key: 'applicableCosts', label: 'Costos Aplic.', searchable: true, hidden: true },
    { key: 'hasDiscount', label: 'Con Descuento', sortable: true, type: 'boolean', hidden: true },
    { key: 'createdAt', label: 'Creado', sortable: true, type: 'date', hidden: true }
  ],
  actions: {
    canAdd: true,
    canEdit: true,
    canDelete: true,
    canExport: true,
    canView: true,
    canToggleColumns: true
  },
  formFields: [
    { name: 'name', type: 'text', label: 'Nombre del Producto', required: true, placeholder: 'Ej: Anillo de oro' },
    { name: 'description', type: 'textarea', label: 'Descripción', required: true, placeholder: 'Descripción detallada...', rows: 4 },
    { name: 'codeProduct', type: 'text', label: 'Código de Producto', required: true, placeholder: 'Ej: AN-OR-001' },
    { name: 'images', type: 'imageArray', label: 'Imágenes', accept: 'image/*', multiple: true, placeholder: 'Seleccionar imágenes' },
    { name: 'price', type: 'number', label: 'Precio de Venta', required: true, placeholder: '0.00', min: 0.01, step: 0.01 },
    { name: 'productionCost', type: 'number', label: 'Costo de Producción', required: true, placeholder: '0.00', min: 0, step: 0.01 },
    { name: 'stock', type: 'number', label: 'Stock Disponible', required: true, placeholder: '0', min: 0 },
    { name: 'discount', type: 'number', label: 'Descuento (0-1)', placeholder: '0', min: 0, max: 1, step: 0.01 },
    { name: 'collection', type: 'select', label: 'Colección', required: true, options: 'collections' },
    { name: 'category', type: 'select', label: 'Categoría', required: true, options: 'categories' },
    { name: 'subcategory', type: 'select', label: 'Subcategoría', required: true, options: 'subcategories' },
    { name: 'rawMaterialsUsed', type: 'select-multiple', label: 'Materiales Usados', required: true, options: 'rawmaterials' },
    { name: 'highlighted', type: 'checkbox', label: 'Producto Destacado' },
    { name: 'correlative', type: 'text', label: 'Correlativo', required: true, placeholder: 'Ej: 001' },
    { name: 'movementType', type: 'select', label: 'Tipo de Movimiento', required: true, 
      options: [
        { value: 'venta', label: 'Venta' },
        { value: 'exhibición', label: 'Exhibición' },
        { value: 'producción', label: 'Producción' },
        { value: 'otro', label: 'Otro' }
      ]
    },
    { name: 'status', type: 'select', label: 'Estado', required: true,
      options: [
        { value: 'disponible', label: 'Disponible' },
        { value: 'agotado', label: 'Agotado' },
        { value: 'en producción', label: 'En Producción' },
        { value: 'descontinuado', label: 'Descontinuado' }
      ]
    },
    { name: 'applicableCosts', type: 'text', label: 'Costos Aplicables', placeholder: 'Ej: fabricación, embalaje' },
    { name: 'hasDiscount', type: 'checkbox', label: 'Aplica Descuento' }
  ]
}

// Configuración optimizada para Materias Primas
export const rawMaterialsConfig = {
  title: "Materias Primas",
  columns: [
    { key: 'correlative', label: 'Código', sortable: true, searchable: true, priority: 1, width: 120 },
    { key: 'name', label: 'Material', sortable: true, searchable: true, priority: 1, width: 180 },
    { key: 'type', label: 'Tipo', sortable: true, priority: 1, width: 100 },
    { key: 'piecePrice', label: 'Precio/U', sortable: true, type: 'currency', priority: 1, width: 100 },
    { key: 'stock', label: 'Stock', sortable: true, type: 'number', priority: 1, width: 80 },
    { key: 'provider', label: 'Proveedor', sortable: true, priority: 2, width: 150 },
    // Campos ocultos por defecto
    { key: 'description', label: 'Descripción', searchable: true, hidden: true },
    { key: 'color', label: 'Color', sortable: true, hidden: true },
    { key: 'tone', label: 'Tono', sortable: true, hidden: true },
    { key: 'toneType', label: 'Tipo Tono', sortable: true, hidden: true },
    { key: 'texture', label: 'Textura', sortable: true, hidden: true },
    { key: 'shape', label: 'Forma', sortable: true, hidden: true },
    { key: 'dimension', label: 'Dimensión', sortable: true, hidden: true },
    { key: 'brand', label: 'Marca', sortable: true, hidden: true },
    { key: 'presentation', label: 'Presentación', sortable: true, hidden: true },
    { key: 'quantity', label: 'Cantidad', sortable: true, type: 'number', hidden: true },
    { key: 'piecesPerPresentation', label: 'Piezas x Pres.', sortable: true, type: 'number', hidden: true },
    { key: 'totalPieces', label: 'Total Piezas', sortable: true, type: 'number', hidden: true },
    { key: 'purchaseDate', label: 'F. Compra', sortable: true, type: 'date', hidden: true },
    { key: 'createdAt', label: 'Creado', sortable: true, type: 'date', hidden: true }
  ],
  actions: {
    canAdd: true,
    canEdit: true,
    canDelete: true,
    canExport: true,
    canView: true,
    canToggleColumns: true
  },
  formFields: [
    { name: 'correlative', type: 'text', label: 'Código Correlativo', required: true, placeholder: 'Ej: MP-001' },
    { name: 'name', type: 'text', label: 'Nombre', required: true, placeholder: 'Ej: Oro 18k' },
    { name: 'description', type: 'textarea', label: 'Descripción', required: true, placeholder: 'Descripción detallada...', rows: 3 },
    { name: 'type', type: 'text', label: 'Tipo', required: true, placeholder: 'Ej: metal, piedra, etc.' },
    { name: 'color', type: 'text', label: 'Color', placeholder: 'Ej: dorado' },
    { name: 'tone', type: 'text', label: 'Tono', placeholder: 'Ej: brillante' },
    { name: 'toneType', type: 'text', label: 'Tipo de Tono', placeholder: 'Ej: claro' },
    { name: 'texture', type: 'text', label: 'Textura', placeholder: 'Ej: liso' },
    { name: 'shape', type: 'text', label: 'Forma', placeholder: 'Ej: lingote' },
    { name: 'dimension', type: 'text', label: 'Dimensión', placeholder: 'Ej: 5x2x1 cm' },
    { name: 'provider', type: 'select', label: 'Proveedor', required: true, options: 'suppliers' },
    { name: 'brand', type: 'text', label: 'Marca', placeholder: 'Ej: Metalor' },
    { name: 'presentation', type: 'text', label: 'Presentación', required: true, placeholder: 'Ej: lingote, rollo' },
    { name: 'quantity', type: 'number', label: 'Cantidad', required: true, placeholder: '0', min: 0 },
    { name: 'piecesPerPresentation', type: 'number', label: 'Piezas por Presentación', required: true, placeholder: '1', min: 1 },
    { name: 'totalPieces', type: 'number', label: 'Total Piezas', required: true, placeholder: '0', min: 0 },
    { name: 'piecePrice', type: 'number', label: 'Precio por Pieza', required: true, placeholder: '0.00', min: 0.01, step: 0.01 },
    { name: 'purchaseDate', type: 'date', label: 'Fecha de Compra', required: true },
    { name: 'stock', type: 'number', label: 'Stock Actual', required: true, placeholder: '0', min: 0 }
  ]
}

// Configuración optimizada para Reseñas
export const reviewsConfig = {
  title: "Reseñas",
  columns: [
    { key: 'rating', label: 'Calificación', sortable: true, type: 'rating', priority: 1, width: 120 },
    { key: 'product', label: 'Producto', sortable: true, priority: 1, width: 180 },
    { key: 'customer', label: 'Cliente', sortable: true, priority: 1, width: 150 },
    { key: 'comment', label: 'Comentario', searchable: true, priority: 2, truncate: 60 },
    { key: 'createdAt', label: 'Fecha', sortable: true, type: 'date', priority: 2, width: 120 },
    // Campos ocultos
    { key: 'response', label: 'Respuesta', searchable: true, hidden: true }
  ],
  actions: {
    canAdd: true,
    canEdit: true,
    canDelete: true,
    canExport: true,
    canView: true,
    canToggleColumns: true
  },
  formFields: [
    { name: 'rating', type: 'number', label: 'Calificación (1-5)', required: true, min: 1, max: 5, step: 1, validate: { validator: Number.isInteger, message: "La calificación debe ser un número entero" } },
    { name: 'comment', type: 'textarea', label: 'Comentario', required: true, placeholder: 'Escribe un comentario (mínimo 10 caracteres)...', rows: 4, minlength: 10, maxlength: 500 },
    { name: 'product', type: 'select', label: 'Producto', required: true, options: 'products' },
    { name: 'customer', type: 'select', label: 'Cliente', required: true, options: 'customers' },
    { name: 'response', type: 'textarea', label: 'Respuesta', required: false, placeholder: 'Escribe una respuesta...', rows: 4, maxlength: 500 }
  ]
}

// Configuración optimizada para Diseños únicos
export const customDesignsConfig = {
  title: "Diseños únicos",
  columns: [
    { key: 'codeRequest', label: 'Código', sortable: true, searchable: true, priority: 1, width: 120 },
    { key: 'piece', label: 'Pieza', sortable: true, searchable: true, priority: 1, width: 100 },
    { key: 'base', label: 'Base', sortable: true, searchable: true, priority: 1, width: 150 },
    { key: 'baseLength', label: 'Longitud', sortable: true, searchable: true, priority: 2, width: 100 },
    { key: 'createdAt', label: 'Solicitud', sortable: true, type: 'date', priority: 2, width: 120 },
    // Campos ocultos
    { key: 'decoration', label: 'Decoración', sortable: true, searchable: true, hidden: true },
    { key: 'clasp', label: 'Cierre', sortable: true, searchable: true, hidden: true },
    { key: 'customerComments', label: 'Comentarios', searchable: true, hidden: true }
  ],
  actions: {
    canAdd: true,
    canEdit: true,
    canDelete: true,
    canExport: true,
    canView: true,
    canToggleColumns: true
  },
  formFields: [
    { name: 'codeRequest', type: 'text', label: 'Código de Solicitud', required: true, placeholder: 'Ej: D-001', minLength: 5 },
    { name: 'piece', type: 'select', label: 'Pieza', required: true, 
      options: [
        { value: 'Pulsera', label: 'Pulsera' },
        { value: 'Cadena', label: 'Cadena' },
        { value: 'Tobillera', label: 'Tobillera' }
      ]
    },
    { name: 'base', type: 'select', label: 'Base', required: true, options: 'designelements' },
    { name: 'baseLength', type: 'text', label: 'Longitud de Base', required: true, placeholder: 'Ej: 18cm o 180mm', helperText: 'Formato: 1-3 dígitos seguidos de cm o mm (ej: 18cm, 180mm)', pattern: '^\\d{1,3}(cm|mm)' , patternMessage: 'La longitud debe tener formato: 123cm o 123mm' },
    { name: 'decoration', type: 'select-multiple', label: 'Decoración', required: true, options: 'designelements' },
    { name: 'clasp', type: 'select', label: 'Cierre', required: true, options: 'designelements' },
    { name: 'customerComments', type: 'textarea', label: 'Comentarios del Cliente', required: true, placeholder: 'Comentarios adicionales del cliente...', rows: 3, maxLength: 300 }
  ]
}

// Configuración optimizada para Elementos de Diseño
export const designElementsConfig = {
  title: "Elementos de Diseño",
  columns: [
    { key: 'name', label: 'Nombre', sortable: true, searchable: true, priority: 1, width: 200 },
    { key: 'type', label: 'Tipo', sortable: true, searchable: true, priority: 1, width: 120 },
    { key: 'createdAt', label: 'Creado', sortable: true, type: 'date', priority: 2, width: 120 },
    // Campos ocultos
    { key: 'image', label: 'Imagen', type: 'image', hidden: true }
  ],
  actions: {
    canAdd: true,
    canEdit: true,
    canDelete: true,
    canExport: true,
    canView: true,
    canToggleColumns: true
  },
  formFields: [
    { name: 'name', type: 'text', label: 'Nombre', required: true, placeholder: 'Ej: Cadena de eslabones' },
    { name: 'type', type: 'select', label: 'Tipo', required: true, 
      options: [
        { value: 'base', label: 'Base' },
        { value: 'decoration', label: 'Decoración' },
        { value: 'clasp', label: 'Cierre' }
      ]
    },
    { name: 'image', type: 'image', label: 'Imagen', required: true, accept: 'image/*', placeholder: 'Seleccionar imagen' }
  ]
}

// Configuración optimizada para Pedidos
export const ordersConfig = {
  title: "Pedidos",
  columns: [
    { key: 'orderCode', label: 'Código', sortable: true, searchable: true, priority: 1, width: 120 },
    { key: 'customer', label: 'Cliente', sortable: true, searchable: true, priority: 1, width: 150 },
    { key: 'total', label: 'Total', sortable: true, type: 'currency', priority: 1, width: 100 },
    { key: 'status', label: 'Estado', sortable: true, type: 'badge', priority: 1, width: 110 },
    { key: 'paymentStatus', label: 'Pago', sortable: true, type: 'badge', priority: 1, width: 100 },
    { key: 'createdAt', label: 'Fecha', sortable: true, type: 'date', priority: 2, width: 120 },
    // Campos ocultos
    { key: 'receiver', label: 'Receptor', sortable: true, searchable: true, hidden: true },
    { key: 'timetable', label: 'Horario', sortable: true, searchable: true, hidden: true },
    { key: 'mailingAddress', label: 'Dirección', sortable: true, searchable: true, hidden: true },
    { key: 'paymentMethod', label: 'Método Pago', sortable: true, searchable: true, hidden: true },
    { key: 'items', label: 'Items', type: 'badge-list', hidden: true },
    { key: 'subtotal', label: 'Subtotal', sortable: true, type: 'currency', hidden: true },
    { key: 'deliveryDate', label: 'F. Entrega', sortable: true, type: 'date', hidden: true }
  ],
  actions: {
    canAdd: true,
    canEdit: true,
    canDelete: true,
    canExport: true,
    canView: true,
    canToggleColumns: true
  },
  formFields: [
    { name: 'orderCode', type: 'text', label: 'Código de Pedido', required: true, placeholder: 'Ej: 001' },
    { name: 'customer', type: 'select', label: 'Cliente', required: true, options: 'customers' },
    { name: 'receiver', type: 'text', label: 'Receptor', required: true, placeholder: 'Ej: Juan Pérez' },
    { name: 'timetable', type: 'text', label: 'Horario', required: true, placeholder: 'Ej: 10:00 - 12:00' },
    { name: 'mailingAddress', type: 'text', label: 'Dirección de Envío', required: true, placeholder: 'Ej: Calle 123, Ciudad, País' },
    { name: 'paymentMethod', type: 'select', label: 'Método de Pago', required: true,
      options: [
        { value: 'efectivo contra entrega', label: 'Efectivo' },
        { value: 'transferencia bancaria', label: 'Transferencia' }
      ]
    },
    { name: 'items', type: 'order-items', label: 'Productos del Pedido', required: true },
    { name: 'subtotal', type: 'number', label: 'Subtotal', required: true, placeholder: '0.00', min: 0.01, step: 0.01 },
    { name: 'total', type: 'number', label: 'Total', required: true, placeholder: '0.00', min: 0.01, step: 0.01 },
    { name: 'status', type: 'select', label: 'Estado', required: true,
      options: [
        { value: 'pendiente', label: 'Pendiente' },
        { value: 'en proceso', label: 'En Proceso' },
        { value: 'enviado', label: 'Enviado' },
        { value: 'entregado', label: 'Entregado' },
        { value: 'cancelado', label: 'Cancelado' }
      ]
    },
    { name: 'paymentStatus', type: 'select', label: 'Estado de Pago', required: true,
      options: [
        { value: 'pendiente', label: 'Pendiente' },
        { value: 'pagado', label: 'Pagado' },
        { value: 'reembolsado', label: 'Reembolsado' },
        { value: 'fallido', label: 'Fallido' }
      ]
    },
    { name: 'deliveryDate', type: 'date', label: 'Fecha de Entrega', required: true }
  ]
}

// Configuración optimizada para Reembolsos
export const refundsConfig = {
  title: "Reembolsos",
  columns: [
    { key: 'refundCode', label: 'Código', sortable: true, searchable: true, priority: 1, width: 120 },
    { key: 'customer', label: 'Cliente', sortable: true, searchable: true, priority: 1, width: 150 },
    { key: 'amount', label: 'Monto', sortable: true, type: 'currency', priority: 1, width: 100 },
    { key: 'status', label: 'Estado', sortable: true, type: 'badge', priority: 1, width: 100 },
    { key: 'requestDate', label: 'F. Solicitud', sortable: true, type: 'date', priority: 2, width: 120 },
    // Campos ocultos
    { key: 'order', label: 'Pedido', sortable: true, searchable: true, hidden: true },
    { key: 'reason', label: 'Motivo', sortable: true, searchable: true, hidden: true },
    { key: 'comments', label: 'Comentarios', searchable: true, hidden: true },
    { key: 'items', label: 'Items', type: 'badge-list', hidden: true },
    { key: 'refundMethod', label: 'Método', sortable: true, searchable: true, hidden: true }
  ],
  actions: {
    canAdd: true,
    canEdit: true,
    canDelete: true,
    canExport: true,
    canView: true,
    canToggleColumns: true
  },
  formFields: [
    { name: 'refundCode', type: 'text', label: 'Código de Reembolso', required: true, placeholder: 'Ej: 001' },
    { name: 'order', type: 'select', label: 'Pedido', required: true, options: 'orders' },
    { name: 'customer', type: 'select', label: 'Cliente', required: true, options: 'customers' },
    { name: 'requestDate', type: 'date', label: 'Fecha de Solicitud', required: true },
    { name: 'reason', type: 'text', label: 'Motivo', required: true, placeholder: 'Ej: Producto defectuoso' },
    { name: 'comments', type: 'textarea', label: 'Comentarios', required: true, placeholder: 'Ej: El producto llegó con daños visibles' },
    { name: 'items', type: 'select-multiple', label: 'Items', required: true, options: 'products' },
    { name: 'status', type: 'select', label: 'Estado', required: true,
      options: [
        { value: 'pendiente', label: 'Pendiente' },
        { value: 'aprobado', label: 'Aprobado' },
        { value: 'rechazado', label: 'Rechazado' }
      ]
    },
    { name: 'amount', type: 'number', label: 'Monto', required: true, placeholder: '0.00', min: 0.01, step: 0.01 },
    { name: 'refundMethod', type: 'select', label: 'Método de Reembolso', required: true,
      options: [
        { value: 'efectivo contra entrega', label: 'Efectivo' },
        { value: 'transferencia bancaria', label: 'Transferencia' }
      ]
    }
  ]
}

// Configuración optimizada para Transacciones
export const transactionsConfig = {
  title: "Transacciones",
  columns: [
    { key: 'transactionCode', label: 'Código', sortable: true, searchable: true, priority: 1, width: 130 },
    { key: 'customer', label: 'Cliente', sortable: true, searchable: true, priority: 1, width: 150 },
    { key: 'amount', label: 'Monto', sortable: true, type: 'currency', priority: 1, width: 100 },
    { key: 'type', label: 'Tipo', sortable: true, searchable: true, priority: 1, width: 100 },
    { key: 'status', label: 'Estado', sortable: true, type: 'badge', priority: 1, width: 100 },
    { key: 'createdAt', label: 'Fecha', sortable: true, type: 'date', priority: 2, width: 120 },
    // Campos ocultos
    { key: 'order', label: 'Pedido', sortable: true, searchable: true, hidden: true },
    { key: 'paymentMethod', label: 'Método Pago', sortable: true, searchable: true, hidden: true }
  ],
  actions: {
    canAdd: true,
    canEdit: true,
    canDelete: true,
    canExport: true,
    canView: true,
    canToggleColumns: true
  },
  formFields: [
    { name: 'transactionCode', type: 'text', label: 'Código de Transacción', required: true, placeholder: 'Ej: 001' },
    { name: 'order', type: 'select', label: 'Pedido', required: true, options: 'orders' },
    { name: 'customer', type: 'select', label: 'Cliente', required: true, options: 'customers' },
    { name: 'amount', type: 'number', label: 'Monto', required: true, placeholder: '0.00', min: 0.01, step: 0.01 },
    { name: 'type', type: 'select', label: 'Tipo', required: true,
      options: [
        { value: 'pago', label: 'Pago' },
        { value: 'reembolso', label: 'Reembolso' },
        { value: 'ajuste', label: 'Ajuste' }
      ]
    },
    { name: 'status', type: 'select', label: 'Estado', required: true,
      options: [
        { value: 'pendiente', label: 'Pendiente' },
        { value: 'completado', label: 'Completado' },
        { value: 'cancelado', label: 'Cancelado' }
      ]
    },
    { name: 'paymentMethod', type: 'select', label: 'Método de Pago', required: true,
      options: [
        { value: 'efectivo contra entrega', label: 'Efectivo' },
        { value: 'transferencia bancaria', label: 'Transferencia' }
      ]
    }
  ]
}

// Configuración de visualización por defecto
export const defaultTableSettings = {
  // Número máximo de columnas visibles por defecto
  maxVisibleColumns: 6,
  
  // Configuración de prioridades
  priorityLevels: {
    1: 'Siempre visible',
    2: 'Visible en pantallas medianas+',
    3: 'Visible en pantallas grandes+'
  },
  
  // Configuración responsiva
  responsive: {
    mobile: { maxColumns: 3, priorities: [1] },
    tablet: { maxColumns: 5, priorities: [1, 2] },
    desktop: { maxColumns: 8, priorities: [1, 2, 3] }
  }
}