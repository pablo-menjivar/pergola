// Función para validar una categoría
export function validateCategory(data) {
  const { name, description, image, isActive } = data;
  // Nombre
  if (!name || name.trim() === "") return "El nombre de la categoría es obligatorio";
  if (name.trim().length < 3) return "El nombre debe tener al menos 3 caracteres";
  if (name.trim().length > 100) return "El nombre no puede exceder los 100 caracteres";
  // Descripción
  if (!description || description.trim() === "") return "La descripción es obligatoria";
  if (description.trim().length < 10) return "La descripción debe tener al menos 10 caracteres";
  if (description.trim().length > 500) return "La descripción no puede exceder los 500 caracteres";
  // Imagen
  if (image && image.trim() !== "") {
    const regex = /^https?:\/\/.+\.(jpg|jpeg|png|webp|svg|gif)$/i;
    if (!regex.test(image.trim())) {
      return "La URL debe ser válida (jpg/jpeg/png/webp/svg/gif)";
    }
  }
  // isActive
  if (isActive !== undefined && typeof isActive !== "boolean") {
    return "El campo 'isActive' debe ser booleano";
  }
  // Si pasa todo
  return null;
}
// Función para validar una colección
export function validateCollection(data) {
  const { name, description, image, isActive } = data;
  // Nombre
  if (!name || name.trim() === "") return "El nombre de la colección es obligatorio";
  if (name.trim().length < 3) return "El nombre debe tener al menos 3 caracteres";
  if (name.trim().length > 100) return "El nombre no puede exceder los 100 caracteres";
  // Descripción
  if (!description || description.trim() === "") return "La descripción es obligatoria";
  if (description.trim().length < 10) return "La descripción debe tener al menos 10 caracteres";
  if (description.trim().length > 500) return "La descripción no puede exceder los 500 caracteres";
  // Imagen
  if (image && image.trim() !== "") {
    const regex = /^https?:\/\/.+\.(jpg|jpeg|png|webp|svg)$/i;
    if (!regex.test(image.trim())) {
      return "La URL debe ser válida (jpg/jpeg/png/webp/svg)";
    }
  }
  // isActive
  if (isActive !== undefined && typeof isActive !== "boolean") {
    return "El campo 'isActive' debe ser booleano";
  }
  // Si pasa todo
  return null;
}
// Función para validar una subcategoría
export function validateSubcategory(data) {
  const { name, description, image, isActive } = data;
  // Nombre
  if (!name || name.trim() === "") return "El nombre de la subcategoría es obligatorio";
  if (name.trim().length < 3) return "El nombre debe tener al menos 3 caracteres";
  if (name.trim().length > 100) return "El nombre no puede exceder los 100 caracteres";
  // Descripción
  if (!description || description.trim() === "") return "La descripción es obligatoria";
  if (description.trim().length < 10) return "La descripción debe tener al menos 10 caracteres";
  if (description.trim().length > 500) return "La descripción no puede exceder los 500 caracteres";
  // Imagen
  if (image && image.trim() !== "") {
    const regex = /^https?:\/\/.+\.(jpg|jpeg|png|webp|svg)$/i;
    if (!regex.test(image.trim())) {
      return "La URL debe ser válida (jpg/jpeg/png/webp/svg)";
    }
  }
  // isActive
  if (isActive !== undefined && typeof isActive !== "boolean") {
    return "El campo 'isActive' debe ser booleano";
  }

  return null;
}
// Función para validar un proveedor
export function validateSupplier(data) {
  const { name, contactPerson, phoneNumber, email, address } = data;
  // Nombre
  if (!name || name.trim() === "") return "El nombre del proveedor es obligatorio";
  if (name.trim().length < 3) return "El nombre debe tener al menos 3 caracteres";
  if (name.trim().length > 255) return "El nombre no puede exceder los 255 caracteres";
  // Contacto
  if (!contactPerson || contactPerson.trim() === "") return "El nombre de la persona de contacto es obligatorio";
  if (contactPerson.trim().length < 3) return "El nombre debe tener al menos 3 caracteres";
  if (contactPerson.trim().length > 255) return "El nombre no puede exceder los 255 caracteres";
  // Teléfono
  if (!phoneNumber || phoneNumber.trim() === "") return "El número de teléfono es obligatorio";
  if (!/^(\+503\s?)?(6|7)\d{3}-?\d{4}$/.test(phoneNumber)) return "El teléfono no es válido en El Salvador";
  // Email
  if (!email || email.trim() === "") return "El email es obligatorio";
  if (!/^[\w-]+@[\w-]+\.[\w-]+$/.test(email)) return "El correo no es válido";
  // Dirección
  if (!address || address.trim() === "") return "La dirección es obligatoria";
  if (address.trim().length < 5) return "La dirección debe tener al menos 5 caracteres";
  if (!address.trim().length > 500) return "La dirección no puede exceder los 255 caracteres";
  // Si pasa todo
  return null;
}
// Función para validar un diseño único
export function validateCustomDesign(data) {
  const { codeRequest, piece, base, baseLength, decoration, clasp, customerComments } = data;
  // Código de solicitud
  if (!codeRequest || typeof codeRequest !== "string" || codeRequest.trim() === "") return "El código de solicitud es obligatorio";
  if (codeRequest.trim().length < 5) return "El código debe tener al menos 5 caracteres";
  // Pieza
  const validPieces = ["Pulsera", "Cadena", "Tobillera"];
  if (!piece || typeof piece !== "string" || piece.trim() === "") return "La pieza es obligatoria";
  if (!validPieces.includes(piece)) return "La pieza debe ser Pulsera, Cadena o Tobillera";
  // Base
  if (!base) return "La base es obligatoria";
  // Longitud de la base
  if (!baseLength || typeof baseLength !== "string" || baseLength.trim() === "") return "La longitud de la base es obligatoria";
  if (!/^\d{1,3}(cm|mm)?$/.test(baseLength.trim())) {
    return "La longitud debe tener formato válido: 123cm o 123mm";
  }
  // Decoración
  if (!Array.isArray(decoration) || decoration.length === 0) {
    return "Debe proporcionar al menos un elemento de decoración";
  }
  // Validar que todos los elementos sean ObjectId (string o tipo válido)
  for (const elem of decoration) {
    if (!elem) return "Todos los elementos de decoración deben ser válidos";
  }
  // Cierre
  if (!clasp) return "El cierre es obligatorio";
  // Comentarios de cliente
  if (customerComments !== undefined && customerComments !== null) {
    if (typeof customerComments !== "string") return "El comentario debe ser texto";
    if (customerComments.trim().length > 300) {
      return "El comentario no puede exceder los 300 caracteres";
    }
    // Si existe, no puede estar vacío (según el modelo)
    if (customerComments.trim() === "" && customerComments.length > 0) {
      return "Los comentarios no pueden estar vacíos";
    }
  }
  // Si pasa todo
  return null;
}
// Función para validar un elemento de diseño
export function validateDesignElement(data) {
  const { type, name, image } = data;
  // Tipo
  if (!type || type.trim() === "") return "El tipo es obligatorio";
  if (type.trim().length < 3) return "El tipo debe tener al menos 3 caracteres";
  if (type.trim().length > 100) return "El tipo no puede exceder los 100 caracteres";
  // Nombre
  if (!name || name.trim() === "") return "El nombre del elemento del diseño es obligatorio";
  if (name.trim().length < 2) return "El nombre debe tener al menos 2 caracteres";
  if (name.trim().length > 100) return "El nombre no puede exceder los 100 caracteres";
  // Imagen
  if (image && image.trim() !== "") {
    const regex = /^https?:\/\/.+\.(jpg|jpeg|png|webp|svg)$/i;
    if (!regex.test(image.trim())) {
      return "La URL debe ser válida (jpg/jpeg/png/webp/svg)";
    }
  }
  // Si pasa todo
  return null;
}
// Función para validar un empleado
export function validateEmployee(data) {
  const { name, lastName, username, email, phoneNumber, birthDate, DUI, password, profilePic, hireDate, isVerified } = data;
  // Nombre
  if (!name || name.trim() === "") return "El nombre es obligatorio";
  if (name.trim().length < 2) return "El nombre debe tener al menos 2 caracteres";
  if (name.trim().length > 100) return "El nombre no puede exceder los 100 caracteres";
  // Apellido
  if (!lastName || lastName.trim() === "") return "El apellido es obligatorio";
  if (lastName.trim().length < 2) return "El apellido debe tener al menos 2 caracteres";
  if (lastName.trim().length > 100) return "El apellido no puede exceder los 100 caracteres";
  // Usuario
  if (!username || username.trim() === "") return "El nombre de usuario es obligatorio";
  if (username.trim().length < 5) return "El nombre de usuario debe tener al menos 5 caracteres";
  if (username.trim().length > 50) return "El nombre de usuario no puede exceder los 50 caracteres";
  // Email
  if (!email || email.trim() === "") return "El correo electrónico es obligatorio";
  if (!/^[\w.-]+@([\w-]+\.)+[a-zA-Z]{2,}$/.test(email.trim())) return "El correo no es válido";
  // Teléfono
  if (!phoneNumber || phoneNumber.trim() === "") return "El número de teléfono es obligatorio";
  if (!/^\+503[-\d]{8,12}$/.test(phoneNumber.trim())) return "El teléfono debe ser válido en El Salvador";
  // Fecha de nacimiento
  if (!birthDate) return "La fecha de nacimiento es obligatoria";
  const birth = new Date(birthDate);
  if (isNaN(birth.getTime())) return "La fecha de nacimiento no es válida";
  const today = new Date();
  if (birth > today) return "La fecha de nacimiento debe ser anterior a la actual";
  const maxBirthDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());
  if (birth < maxBirthDate) return "La fecha de nacimiento no puede ser anterior a 120 años";
  // DUI
  if (!DUI || DUI.trim() === "") return "El DUI es obligatorio";
  if (!/^\d{8}-\d$/.test(DUI.trim())) return "El DUI debe tener formato 12345678-9";
  // Contraseña
  if (!password || password.trim() === "") return "La contraseña es obligatoria";
  if (password.trim().length < 8) return "La contraseña debe tener al menos 8 caracteres";
  if (password.trim().length > 100) return "La contraseña no puede exceder los 100 caracteres";
  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password.trim())) {
    return "La contraseña debe incluir mayúsculas, minúsculas, números y caracteres especiales";
  }
  // Foto de perfil
  if (profilePic && profilePic.trim() !== "") {
    const regex = /^https?:\/\/.+\.(jpg|jpeg|png|webp|svg)$/i;
    if (!regex.test(profilePic.trim())) {
      return "La URL de la foto debe ser válida (jpg/jpeg/png/webp/svg)";
    }
  }
  // Fecha de contratación
  if (!hireDate) return "La fecha de contratación es obligatoria";
  const hire = new Date(hireDate);
  if (isNaN(hire.getTime())) return "La fecha de contratación no es válida";
  if (hire > new Date()) return "La fecha de contratación no puede estar en el futuro";
  // Si pasa todo
  return null;
}
// Función para validar un cliente
export function validateCustomer(data) {
  const { name, lastName, username, email, phoneNumber, birthDate, DUI, password, profilePic, address, isVerified, preferredColors, preferredMaterials, preferredJewelStyle, purchaseOpportunity, allergies, jewelSize, budget } = data;
  // Nombre
  if (!name || name.trim() === "") return "El nombre es obligatorio";
  if (name.trim().length < 2) return "El nombre debe tener al menos 2 caracteres";
  if (name.trim().length > 100) return "El nombre no puede exceder los 100 caracteres";
  // Apellido
  if (!lastName || lastName.trim() === "") return "El apellido es obligatorio";
  if (lastName.trim().length < 2) return "El apellido debe tener al menos 2 caracteres";
  if (lastName.trim().length > 100) return "El apellido no puede exceder los 100 caracteres";
  // Usuario
  if (!username || username.trim() === "") return "El nombre de usuario es obligatorio";
  if (username.trim().length < 5) return "El nombre de usuario debe tener al menos 5 caracteres";
  if (username.trim().length > 50) return "El nombre de usuario no puede exceder los 50 caracteres";
  // Email
  if (!email || email.trim() === "") return "El correo electrónico es obligatorio";
  if (!/^[\w.-]+@([\w-]+\.)+[a-zA-Z]{2,}$/.test(email.trim())) return "El correo no es válido";
  // Teléfono
  if (!phoneNumber || phoneNumber.trim() === "") return "El número de teléfono es obligatorio";
  if (!/^\+503[-\d]{8,12}$/.test(phoneNumber.trim())) return "El teléfono debe ser válido en El Salvador";
  // Fecha de nacimiento
  if (!birthDate) return "La fecha de nacimiento es obligatoria";
  const birth = new Date(birthDate);
  if (isNaN(birth.getTime())) return "La fecha de nacimiento no es válida";
  const today = new Date();
  if (birth > today) return "La fecha de nacimiento debe ser anterior a la actual";
  const maxBirthDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());
  if (birth < maxBirthDate) return "La fecha de nacimiento no puede ser anterior a 120 años";
  // DUI
  if (!DUI || DUI.trim() === "") return "El DUI es obligatorio";
  if (!/^\d{8}-\d$/.test(DUI.trim())) return "El DUI debe tener formato 12345678-9";
  // Contraseña
  if (!password || password.trim() === "") return "La contraseña es obligatoria";
  if (password.trim().length < 8) return "La contraseña debe tener al menos 8 caracteres";
  if (password.trim().length > 100) return "La contraseña no puede exceder los 100 caracteres";
  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password.trim())) {
    return "La contraseña debe incluir mayúsculas, minúsculas, números y caracteres especiales";
  }
  // Foto de perfil
  if (profilePic && profilePic.trim() !== "") {
    const regex = /^https?:\/\/.+\.(jpg|jpeg|png|webp|svg)$/i;
    if (!regex.test(profilePic.trim())) {
      return "La URL de la foto debe ser válida (jpg/jpeg/png/webp/svg)";
    }
  }
  // Dirección
  if (!address || address.trim() === "") return "La dirección es obligatoria";
  if (address.trim().length < 5) return "La dirección debe tener al menos 5 caracteres";
  if (address.trim().length > 200) return "La dirección no puede exceder los 200 caracteres";
  // isVerified
  if (isVerified !== undefined && typeof isVerified !== "boolean") {
    return "El campo 'isVerified' debe ser booleano";
  }
  // Preferencias de colores
  if (preferredColors !== undefined && preferredColors !== null && !Array.isArray(preferredColors)) {
    return "Las preferencias de colores deben ser un arreglo";
  }
  // Preferencias de materiales
  if (preferredMaterials !== undefined && preferredMaterials !== null && !Array.isArray(preferredMaterials)) {
    return "Las preferencias de materiales deben ser un arreglo";
  }
  // Preferencias de estilos
  if (preferredJewelStyle !== undefined && preferredJewelStyle !== null && !Array.isArray(preferredJewelStyle)) {
    return "Las preferencias de estilos deben ser un arreglo";
  }
  // Oportunidad de compra
  if (purchaseOpportunity && typeof purchaseOpportunity !== "string") {
    return "La oportunidad de compra debe ser texto";
  }
  // Alergias
  if (allergies && typeof allergies !== "string") {
    return "Las alergias deben ser texto";
  }
  // Tamaño de joya
  if (jewelSize && !["pequeño", "mediano", "grande", "muy grande", ""].includes(jewelSize)) {
    return "El tamaño de joya no es válido";
  }
  // Presupuesto
  if (budget && typeof budget !== "string") {
    return "El presupuesto debe ser texto";
  }
  // Si pasa todo
  return null;
}
// Función para validar una materia prima
export function validateRawMaterial(data) {
  const { name, description, type, color, tone, toneType, texture, shape, dimension, provider, brand, presentation, quantity, piecesPerPresentation, totalPieces, piecesPrice, purchaseDate, stock } = data;
  // Nombre
  if (!name || name.trim() === "") return "El nombre es obligatorio";
  if (name.trim().length < 3) return "El nombre debe tener al menos 3 caracteres";
  if (name.trim().length > 100) return "El nombre no puede exceder los 100 caracteres";
  // Descripción
  if (!description || description.trim() === "") return "La descripción es obligatoria";
  if (description.trim().length < 10) return "La descripción debe tener al menos 10 caracteres";
  if (description.trim().length > 500) return "La descripción no puede exceder los 500 caracteres";
  // Tipo
  if (!type || type.trim() === "") return "El tipo es obligatorio";
  // Color
  if (!color || color.trim() === "") return "El color es obligatorio";
  // Tono
  if (!tone || tone.trim() === "") return "El tono es obligatorio";
  // Tipo de tono
  if (!toneType || toneType.trim() === "") return "El tipo de tono es obligatorio";
  // Textura
  if (!texture || texture.trim() === "") return "La textura es obligatoria";
  // Forma
  if (!shape || shape.trim() === "") return "La forma es obligatoria";
  // Dimensión
  if (!dimension || dimension.trim() === "") return "La dimensión es obligatoria";
  // Proveedor
  if (!provider) return "El proveedor es obligatorio";
  // Marca
  if (!brand || brand.trim() === "") return "La marca es obligatoria";
  // Presentación
  if (!presentation || presentation.trim() === "") return "La presentación es obligatoria";
  // Cantidad
  if (quantity === undefined || isNaN(quantity) || quantity < 0) return "La cantidad es oligatoria y no puede ser negativa";
  // Piezas por presentación
  if (piecesPerPresentation === undefined || isNaN(piecesPerPresentation) || piecesPerPresentation < 1) return "Debe haber al menos 1 pieza por presentación";
  // Total de piezas
  if (totalPieces === undefined || isNaN(totalPieces) || totalPieces < 0) return "La cantidad total de piezas es obligatoria y no puede ser negativa";
  // Precio por pieza
  if (piecesPrice === undefined || isNaN(piecesPrice) || piecesPrice < 0.01) return "El precio por pieza es obligatorio y debe ser mayor que 0";
  // Fecha de compra
  if (!purchaseDate) return "La fecha de compra es obligatoria";
  const purchase = new Date(purchaseDate);
  if (isNaN(purchase.getTime())) return "La fecha de compra no es válida";
  // Stock
  if (stock === undefined || isNaN(stock) || stock < 0) return "El stock es obligatorio y no puede ser negativo";
  // Si pasa todo
  return null;
}
// Función para validar un producto
export function validateProduct(data) {
  const { name, description, codeProduct, stock, price, productionCost, discount, images, collection, category, subcategory, rawMaterialsUsed, correlative, movementType, status, applicableCosts, hasDiscount } = data;
  // Nombre
  if (!name || name.trim() === "") return "El nombre es obligatorio";
  if (name.trim().length < 3) return "El nombre debe tener al menos 3 caracteres";
  if (name.trim().length > 100) return "El nombre no puede exceder los 100 caracteres";
  // Descripción
  if (!description || description.trim() === "") return "La descripción es obligatoria";
  if (description.trim().length < 10) return "La descripción debe tener al menos 10 caracteres";
  if (description.trim().length > 1000) return "La descripción no puede exceder los 1000 caracteres";
  // Código de producto
  if (!codeProduct || typeof codeProduct !== "string" || !/^[A-Z0-9-]+$/.test(codeProduct)) {
    return "El código de producto es obligatorio y solo puede contener letras mayúsculas, números y guiones";
  }
  // Stock
  if (stock === undefined || isNaN(stock) || stock < 0) return "El stock es obligatorio y no puede ser negativo";
  // Precio
  if (price === undefined || isNaN(price) || price < 0.01) return "El precio es obligatorio y debe ser mayor a 0";
  // Costo de producción
  if (productionCost === undefined || isNaN(productionCost) || productionCost < 0) return "El costo de producción es obligatorio y no puede ser negativo";
  // Descuento
  if (discount !== undefined) {
    if (isNaN(discount) || discount < 0 || discount > 1) {
      return "El descuento debe estar entre 0 y 1 (ejemplo: 0.2 para 20%)";
    }
  }
  // Imágenes
  if (!Array.isArray(images) || images.length === 0) return "Debes subir al menos una imagen";
  const regexImg = /^https?:\/\/.+\.(jpg|jpeg|png|webp|svg|gif)$/i;
  for (const img of images) {
    if (typeof img !== "string" || !regexImg.test(img)) {
      return "Todas las imágenes deben ser URLs válidas (jpg, jpeg, png, webp, svg, gif)";
    }
  }
  // Colección, categoría y subcategoría
  if (!collection) return "La colección es obligatoria";
  if (!category) return "La categoría es obligatoria";
  if (!subcategory) return "La subcategoría es obligatoria";
  // Materias primas
  if (!rawMaterialsUsed || (Array.isArray(rawMaterialsUsed) && rawMaterialsUsed.length === 0)) return "Debes incluir al menos un material";  
  // Correlativo
  if (!correlative || !/^[A-Z0-9-]+$/.test(correlative)) return "El correlativo es obligatorio y solo puede contener letras mayúsculas, números y guiones";  
  // Tipo de movimiento
  const validMovements = ["venta", "exhibición", "producción", "otro"];
  if (!movementType || !validMovements.includes(movementType)) return "El tipo de movimiento es obligatorio y debe ser válido (venta, exhibición, producción u otro)";  
  // Estado
  const validStatuses = ["disponible", "agotado", "en producción", "descontinuado"];
  if (!status || !validStatuses.includes(status)) return "El estado es obligatorio y debe ser válido (disponible, agotado, en producción, descontinuado)";
  // Costos aplicables
  if (applicableCosts && applicableCosts.trim() === "") return "Los costos aplicables no pueden estar vacíos";
  // 'hasDiscount'
  if (hasDiscount !== undefined && typeof hasDiscount !== "boolean") {
    return "El campo 'hasDiscount' debe ser booleano";
  }
  // Si pasa todo
  return null;
}
// Función para validar una reseña
export function validateReview(data) {
  const { product, customer, rating, comment, response } = data;
  // Producto y cliente
  if (!product) return "El producto es obligatorio";
  if (!customer) return "El cliente es obligatorio";
  // Calificación
  const parsedRating = Number(rating);
  if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
    return "La calificación debe ser un número entero entre 1 y 5";
  }
  // Comentario
  if (!comment || comment.trim() === "") return "El comentario es obligatorio";
  if (comment.trim().length < 10) return "El comentario debe tener al menos 10 caracteres";
  if (comment.trim().length > 500) return "El comentario no puede exceder los 500 caracteres";
  // Respuesta
  if (response !== undefined && response !== null) {
    if (response.trim() === "") return "La respuesta no puede estar vacía";
    if (response.trim().length > 500) return "La respuesta no puede exceder los 500 caracteres";
  }
  // Si pasa todo
  return null;
}
// Función para validar pedidos
export function validateOrder(data) {
  const { orderCode, customer, receiver, timetable, mailingAddress, paymentMethod, status, paymentStatus, receiptDate, items, subtotal } = data;
  // Código de pedido
  if (!orderCode || orderCode.trim() === "") return "El código de pedido es obligatorio";  
  if (!/^[A-Z0-9-]+$/.test(orderCode.trim())) return "El código solo puede contener letras mayúsculas, números y guiones";
  // Cliente
  if (!customer) return "El cliente es obligatorio";
  // Receptor
  if (!receiver || receiver.trim() === "") return "El nombre del receptor es obligatorio";
  if (receiver.trim().length < 5) return "El nombre debe tener al menos 5 caracteres";
  if (receiver.trim().length > 100) return "El nombre no puede exceder los 100 caracteres";
  // Horario (opcional pero si se da, no vacío)
  if (timetable !== undefined && timetable !== null) {
    if (timetable.trim() === "") {
      return "El horario no puede estar vacío";
    }
    if (timetable.trim().length > 100) {
      return "El horario no puede exceder los 100 caracteres";
    }
  }
  // Dirección de envío
  if (!mailingAddress || mailingAddress.trim() === "") return "La dirección de envío es obligatoria";
  if (mailingAddress.trim().length < 10) return "La dirección debe tener al menos 10 caracteres";
  if (mailingAddress.trim().length > 200) return "La dirección no puede exceder los 200 caracteres";
  // Método de pago
  const validPaymentMethods = ["efectivo", "tarjeta de crédito", "transferencia", "paypal", "otro"];
  if (!paymentMethod || paymentMethod.trim() === "") return "El método de pago es obligatorio";
  if (!validPaymentMethods.includes(paymentMethod.trim())) return "Método de pago no válido";
  // Estado de pedido
  const validStatuses = ["pendiente", "en proceso", "enviado", "entregado", "cancelado"];
  if (!status || status.trim() === "") return "El estado del pedido es obligatorio";
  if (!validStatuses.includes(status.trim())) return "Estado de pedido no válido";
  // Estado de pago
  const validPaymentStatuses = ["pendiente", "pagado", "reembolsado", "fallido"];
  if (!paymentStatus || paymentStatus.trim() === "") return "El estado del pago es obligatorio";
  if (!validPaymentStatuses.includes(paymentStatus.trim())) return "Estado de pago no válido";
  // Fecha de recepción
  if (!receiptDate) return "La fecha de recepción es obligatoria";
  const dateValue = new Date(receiptDate);
  if (isNaN(dateValue.getTime())) return "La fecha de recepción no es válida";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  dateValue.setHours(0, 0, 0, 0);
  if (dateValue < today)  return "La fecha de recepción debe ser futura";
  // Items (al menos uno)
  if (!Array.isArray(items) || items.length === 0) return "Al menos un producto es obligatorio";
  // Subtotal
  if (subtotal === undefined || subtotal === null) return "El subtotal es obligatorio";
  if (isNaN(Number(subtotal)) || Number(subtotal) < 0) return "El subtotal no puede ser negativo";
  // Total
  if (total === undefined || total === null) return "El total es obligatorio";
  if (isNaN(Number(total)) || Number(total) < 0) return "El total no puede ser negativo";
  // Si pasa todo
  return null;
}
// Función para validar devoluciones
export function validateRefund(data) {
  const { refundCode, order, customer, requestDate, reason, comments, items, status, amount, refundMethod } = data;
  // Código de devolución
  if (!refundCode || refundCode.trim() === "") return "El código de devolución es obligatorio";  
  if (!/^[A-Z0-9-]+$/.test(refundCode.trim())) return "El código solo puede contener letras mayúsculas, números y guiones";
  // Pedido y cliente
  if (!order) return "El pedido es obligatorio";
  if (!customer) return "El cliente es obligatorio";
  // Fecha de solicitud
  if (!requestDate) return "La fecha de solicitud es obligatoria";
  const request = new Date(requestDate);
  if (isNaN(request.getTime())) return "La fecha de solicitud no es válida";
  // Razón
  if (!reason || reason.trim() === "") return "La razón es obligatoria";
  if (reason.trim().length < 10) return "La razón debe tener al menos 10 caracteres";
  if (reason.trim().length > 200) return "La razón no puede exceder los 200 caracteres";
  // Comentarios
  if (comments !== undefined && comments !== null) {
    if (comments.trim() === "") return "La respuesta no puede estar vacía";
    if (comments.trim().length > 500) return "La respuesta no puede exceder los 500 caracteres";
  }
  // Items (al menos uno)
  if (!Array.isArray(items) || items.length === 0) return "Al menos un producto es obligatorio";
  // Estado 
  const validStatuses = ["pendiente", "aprobado", "rechazado", "en proceso"];
  if (!status || status.trim() === "") return "El estado del pedido es obligatorio";
  if (!validStatuses.includes(status.trim())) return "Estado de pedido no válido";
  // Monto
  if (amount === undefined || isNaN(amount) || amount < 0.01) return "El monto es obligatorio y debe ser mayor a 0";
  // Método de reembolso
  const validRefundMethods = ["efectivo", "tarjeta de crédito", "transferencia", "vale", "mismo método de pago", "otro"];
  if (!refundMethod || refundMethod.trim() === "") return "El método de reembolso es obligatorio";
  if (!validRefundMethods.includes(refundMethod.trim())) return "Método de reembolso no válido";
  // Si pasa todo
  return null;
}
// Función para validar transacciones
export function validateTransaction(data) {
  const { transactionCode, order, customer, amount, type, paymentMethod, status } = data;
  // Código de devolución
  if (!transactionCode || transactionCode.trim() === "") return "El código de transacción es obligatorio";  
  if (!/^[A-Z0-9-]+$/.test(transactionCode.trim())) return "El código solo puede contener letras mayúsculas, números y guiones";
  // Pedido y cliente
  if (!order) return "El pedido es obligatorio";
  if (!customer) return "El cliente es obligatorio";
  // Monto
  if (amount === undefined || isNaN(amount) || amount < 0.01) return "El monto es obligatorio y debe ser mayor a 0";
  // Tipo
  const validTypes = ["pago", "reembolso", "ajuste"];
  if (!type || type.trim() === "") return "El tipo de transacción es obligatorio";
  if (!validTypes.includes(validTypes.trim())) return "Tipo de transacción no válido";
  // Método de pago
  const validPaymentMethods = ["efectivo", "tarjeta de crédito", "transferencia", "paypal", "otro"];
  if (!paymentMethod || paymentMethod.trim() === "") return "El método de pago es obligatorio";
  if (!validPaymentMethods.includes(paymentMethod.trim())) return "Método de pago no válido";
  // Estado
  const validStatuses = ["pendiente", "completado", "fallido", "revertido"];
  if (!status || status.trim() === "") return "El estado del pedido es obligatorio";
  if (!validStatuses.includes(status.trim())) return "Estado de pedido no válido";
}