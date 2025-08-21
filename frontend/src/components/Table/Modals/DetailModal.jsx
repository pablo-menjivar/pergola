// Importa iconos y el modal base
import { Package, Tag, DollarSign, Star, Hash, FileText, Eye, Image, Layers, Building, Boxes, MessageSquare, CheckCircle, XCircle, Gem, Archive, Palette, Calendar, User, Mail, Phone, MapPin, Ruler, Paintbrush, Link, CreditCard, RefreshCcw, Receipt, Check, Cake, IdCard, RulerDimensionLine, Eclipse, SprayCan, SquaresIntersect, Diameter, Percent, GalleryHorizontal } from 'lucide-react'
import BaseModal from './BaseModal'

// Componente modal para mostrar detalles de un elemento
const DetailModal = ({ isOpen, onClose, data, title = "Detalles", type = "generic" }) => {
   // Agregar esto al inicio para debuggear
  console.log("DetailModal - type:", type);
  console.log("DetailModal - data:", data);
  // Si no hay datos, no renderiza nada
  if (!data) return null

  // Función para formatear fechas
  const formatDate = (dateString) => {
    if (!dateString) return '-'
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }
  // Función para formatear moneda
  const formatCurrency = (amount) => {
    const num = Number(amount) || 0
    return `$${num.toFixed(2)}`
  }
  // Función para obtener el ícono según el campo
  const getFieldIcon = (fieldKey) => {
    const iconMap = {
      // Fechas
      createdAt: Calendar,
      updatedAt: Calendar,
      purchaseDate: Calendar,
      requestDate: Calendar,
      deliveryDate: Calendar,
      birthDate: Cake,
      hireDate: Calendar,
      // Usuarios y personas
      name: User,
      lastName: User,
      contactPerson: User,
      username: IdCard,
      customer: User,
      order: Package,
      preferredColors: Palette,
      preferredMaterials: Boxes, 
      preferredJewelStyle: Gem, 
      purchaseOpportunity: Tag,
      allergies: XCircle, 
      jewelSize: Ruler,
      userType: Tag,
      // Email y contacto
      email: Mail,
      phoneNumber: Phone,
      // Dirección
      address: MapPin,
      // Dinero
      price: DollarSign,
      piecePrice: DollarSign,
      productionCost: DollarSign,
      discount: Percent,
      amount: DollarSign,
      // Productos y materiales
      stock: Archive,
      quantity: Archive,
      totalPieces: Archive,
      piecesPerPresentation: Archive,
      // Categorías y clasificaciones
      category: Tag,
      subcategory: Tag,
      collection: Layers,
      status: Tag,
      type: Tag,
      movementType: Tag,
      paymentMethod: CreditCard,
      refundMethod: RefreshCcw,
      // Proveedores
      provider: Building,
      supplier: Building,
      // Materiales
      color: Palette,
      tone: Eclipse,
      toneType: SprayCan,
      texture: SquaresIntersect,
      shape: Diameter,
      dimension: RulerDimensionLine,
      brand: Tag,
      presentation: Package,
      correlative: Hash,
      // Calificaciones
      rating: Star,
      // Productos
      codeProduct: Hash,
      orderCode: Hash,
      refundCode: Receipt,
      transactionCode: Receipt,
      rawMaterialsUsed: Boxes,
      highlighted: Star,
      hasDiscount: Check,
      applicableCosts: DollarSign,
      // IDs
      _id: Hash,
      // Texto y descripciones
      description: FileText,
      comment: MessageSquare,
      customerComments: MessageSquare,
      response: MessageSquare,
      // Imágenes
      image: Image,
      images: GalleryHorizontal,
      // Estados
      isActive: CheckCircle,
      // Genérico
      default: Eye,
      // Diseños únicos
      codeRequest: Hash,
      piece: Gem,
      base: Gem,
      baseLength: Ruler,
      decoration: Paintbrush,
      clasp: Link,
      isVerified: Check,
      profilePic: Image,
    }
    return iconMap[fieldKey] || iconMap.default
  }
  // Configuración de campos según el tipo de elemento
  const getTypeConfig = () => {
    switch (type) {
      case 'customers':
        return {
          fields: [
            { key: 'name', label: 'Nombre', type: 'text' },
            { key: 'lastName', label: 'Apellido', type: 'text' },
            { key: 'username', label: 'Usuario', type: 'text' },
            { key: 'email', label: 'Email', type: 'email' },
            { key: 'phoneNumber', label: 'Teléfono', type: 'text' },
            { key: 'birthDate', label: 'Fecha de Nacimiento', type: 'date' },
            { key: 'DUI', label: 'DUI', type: 'text' },
            { key: 'address', label: 'Dirección', type: 'text' },
            { key: 'isVerified', label: 'Verificado', type: 'badge' },
            { key: 'profilePic', label: 'Foto', type: 'image' },
            { key: 'createdAt', label: 'Fecha de Registro', type: 'date' },
            { key: 'preferredColors', label: 'Colores Preferidos', type: 'text' },
            { key: 'preferredMaterials', label: 'Materiales Preferidos', type: 'text' },
            { key: 'preferredJewelStyle', label: 'Estilo de Joya Preferido', type: 'text' },
            { key: 'purchaseOpportunity', label: 'Oportunidad de Compra', type: 'text' },
            { key: 'allergies', label: 'Alergias', type: 'text' },
            { key: 'jewelSize', label: 'Tamaño de Joya', type: 'text' },
            { key: 'budget', label: 'Presupuesto', type: 'currency' }
          ]
        }
      case 'employees':
        return {
          fields: [
            { key: 'name', label: 'Nombre', type: 'text' },
            { key: 'lastName', label: 'Apellido', type: 'text' },
            { key: 'username', label: 'Usuario', type: 'text' },
            { key: 'email', label: 'Email', type: 'email' },
            { key: 'phoneNumber', label: 'Teléfono', type: 'text' },
            { key: 'birthDate', label: 'Fecha de Nacimiento', type: 'date' },
            { key: 'DUI', label: 'DUI', type: 'text' },
            { key: 'userType', label: 'Tipo de Usuario', type: 'badge' },
            { key: 'hireDate', label: 'Fecha de Contratación', type: 'date' },
            { key: 'isVerified', label: 'Verificado', type: 'badge' },
            { key: 'profilePic', label: 'Foto', type: 'image' },
            { key: 'createdAt', label: 'Fecha de Registro', type: 'date' }
          ]
        }
      case 'products':
        return {
          fields: [
            { key: 'name', label: 'Nombre del Producto', type: 'text' },
            { key: 'description', label: 'Descripción', type: 'text' },
            { key: 'codeProduct', label: 'Código de Producto', type: 'text' },
            { key: 'price', label: 'Precio', type: 'currency' },
            { key: 'productionCost', label: 'Costo de Producción', type: 'currency' },
            { key: 'discount', label: 'Descuento', type: 'percentage' },
            { key: 'hasDiscount', label: 'Tiene Descuento', type: 'badge' },
            { key: 'stock', label: 'Stock', type: 'number' },
            { key: 'highlighted', label: 'Destacado', type: 'badge' },
            { key: 'status', label: 'Estado', type: 'badge' },
            { key: 'movementType', label: 'Tipo de Movimiento', type: 'badge' },
            { key: 'correlative', label: 'Correlativo', type: 'text' },
            { key: 'applicableCosts', label: 'Costos Aplicables', type: 'text' },
            { key: 'collection', label: 'Colección', type: 'reference' },
            { key: 'category', label: 'Categoría', type: 'reference' },
            { key: 'subcategory', label: 'Subcategoría', type: 'reference' },
            { key: 'rawMaterialsUsed', label: 'Materias Primas', type: 'array' },
            { key: 'images', label: 'Imágenes', type: 'imageArray' },
            { key: 'createdAt', label: 'Fecha de Creación', type: 'date' },
            { key: 'updatedAt', label: 'Última Actualización', type: 'date' }
          ]
        }
      case 'categories':
        return {
          fields: [
            { key: 'name', label: 'Nombre de la Categoría', type: 'text' },
            { key: 'description', label: 'Descripción', type: 'text' },
            { key: 'image', label: 'Imagen', type: 'image' },
            { key: 'isActive', label: 'Activa', type: 'badge' },
            { key: 'createdAt', label: 'Fecha de Creación', type: 'date' },
            { key: 'updatedAt', label: 'Última Actualización', type: 'date' }
          ]
        }
      case 'subcategories':
        return {
          fields: [
            { key: 'name', label: 'Nombre de la Subcategoría', type: 'text' },
            { key: 'description', label: 'Descripción', type: 'text' },
            { key: 'image', label: 'Imagen', type: 'image' },
            { key: 'isActive', label: 'Activa', type: 'badge' },
            { key: 'createdAt', label: 'Fecha de Creación', type: 'date' },
            { key: 'updatedAt', label: 'Última Actualización', type: 'date' }
          ]
        }
      case 'collections':
        return {
          fields: [
            { key: 'name', label: 'Nombre de la Colección', type: 'text' },
            { key: 'description', label: 'Descripción', type: 'text' },
            { key: 'image', label: 'Imagen', type: 'image' },
            { key: 'isActive', label: 'Activa', type: 'badge' },
            { key: 'createdAt', label: 'Fecha de Creación', type: 'date' },
            { key: 'updatedAt', label: 'Última Actualización', type: 'date' }
          ]
        }
      case 'suppliers':
        return {
          fields: [
            { key: 'name', label: 'Nombre del Proveedor', type: 'text' },
            { key: 'contactPerson', label: 'Persona de Contacto', type: 'text' },
            { key: 'phoneNumber', label: 'Teléfono', type: 'text' },
            { key: 'email', label: 'Email', type: 'email' },
            { key: 'address', label: 'Dirección', type: 'text' },
            { key: 'createdAt', label: 'Fecha de Registro', type: 'date' },
            { key: 'updatedAt', label: 'Última Actualización', type: 'date' }
          ]
        }
      case 'rawmaterials':
        return {
          fields: [
            { key: 'correlative', label: 'Correlativo', type: 'text' },
            { key: 'name', label: 'Nombre', type: 'text' },
            { key: 'description', label: 'Descripción', type: 'text' },
            { key: 'type', label: 'Tipo', type: 'text' },
            { key: 'color', label: 'Color', type: 'text' },
            { key: 'tone', label: 'Tono', type: 'text' },
            { key: 'toneType', label: 'Tipo de Tono', type: 'text' },
            { key: 'texture', label: 'Textura', type: 'text' },
            { key: 'shape', label: 'Forma', type: 'text' },
            { key: 'dimension', label: 'Dimensiones', type: 'text' },
            { key: 'brand', label: 'Marca', type: 'text' },
            { key: 'presentation', label: 'Presentación', type: 'text' },
            { key: 'quantity', label: 'Cantidad', type: 'number' },
            { key: 'piecesPerPresentation', label: 'Piezas por Presentación', type: 'number' },
            { key: 'totalPieces', label: 'Total de Piezas', type: 'number' },
            { key: 'piecePrice', label: 'Precio por Pieza', type: 'currency' },
            { key: 'stock', label: 'Stock', type: 'number' },
            { key: 'provider', label: 'Proveedor', type: 'reference' },
            { key: 'purchaseDate', label: 'Fecha de Compra', type: 'date' },
            { key: 'createdAt', label: 'Fecha de Creación', type: 'date' },
            { key: 'updatedAt', label: 'Última Actualización', type: 'date' }
          ]
        }
      case 'reviews':
        return {
          fields: [
            { key: 'product', label: 'Producto', type: 'reference' },
            { key: 'customer', label: 'Cliente', type: 'reference' },
            { key: 'rating', label: 'Calificación', type: 'rating' },
            { key: 'comment', label: 'Comentario', type: 'text' },
            { key: 'response', label: 'Respuesta', type: 'text' },
            { key: 'createdAt', label: 'Fecha de la Reseña', type: 'date' },
            { key: 'updatedAt', label: 'Última Actualización', type: 'date' }
          ]
        }
      case 'customdesigns':
        return {
          fields: [
            { key: 'codeRequest', label: 'Código de Solicitud', type: 'text' },
            { key: 'piece', label: 'Pieza', type: 'badge' }, // Cambiar a badge para mostrar mejor
            { key: 'base', label: 'Base', type: 'text'},
            { key: 'baseLength', label: 'Longitud de Base', type: 'text' },
            { key: 'decoration', label: 'Decoración', type: 'text' },
            { key: 'clasp', label: 'Cierre', type: 'text' },
            { key: 'customerComments', label: 'Comentarios del Cliente', type: 'text' },
            { key: 'createdAt', label: 'Fecha de solicitud', type: 'date' },
            { key: 'updatedAt', label: 'Fecha de actualización', type: 'date' },
          ]
        }
      // Corrección para la configuración de designelements en DetailModal.jsx
      case 'designelements':
        return {
          fields: [
            { key: 'name', label: 'Nombre', type: 'text' },
            { key: 'type', label: 'Tipo', type: 'badge' },
            { key: 'image', label: 'Imagen', type: 'image' }, // ¡DEBE ser 'image' no 'text'!
            { key: 'createdAt', label: 'Fecha de creación', type: 'date' },
            { key: 'updatedAt', label: 'Fecha de actualización', type: 'date' }
          ]
        }
      case 'orders':
        return {
          fields: [
            { key: 'orderCode', label: 'Código de Pedido', type: 'text' },
            { key: 'customer', label: 'Cliente', type: 'customer' },
            { key: 'receiver', label: 'Receptor', type: 'text' },
            { key: 'timetable', label: 'Horario', type: 'text' },
            { key: 'mailingAddress', label: 'Dirección de Envío', type: 'text' },
            { key: 'paymentMethod', label: 'Método de Pago', type: 'text' },
            { key: 'items', label: 'Items', type: 'array' },
            { key: 'subtotal', label: 'Subtotal', type: 'currency' },
            { key: 'total', label: 'Total', type: 'currency' },
            { key: 'status', label: 'Estado', type: 'badge' },
            { key: 'paymentStatus', label: 'Estado de Pago', type: 'badge' },
            { key: 'deliveryDate', label: 'Fecha de Entrega', type: 'date' },
            { key: 'createdAt', label: 'Fecha de Creación', type: 'date' }
          ]
        }
      case 'refunds':
        return {
          fields: [
            { key: 'refundCode', label: 'Código de Reembolso', type: 'text' },
            { key: 'order', label: 'Pedido', type: 'reference' },
            { key: 'customer', label: 'Cliente', type: 'customer' },
            { key: 'requestDate', label: 'Fecha de Solicitud', type: 'date' },
            { key: 'reason', label: 'Motivo', type: 'text' },
            { key: 'comments', label: 'Comentarios', type: 'text' },
            { key: 'items', label: 'Items', type: 'array' },
            { key: 'status', label: 'Estado', type: 'badge' },
            { key: 'amount', label: 'Monto', type: 'currency' },
            { key: 'refundMethod', label: 'Método de Reembolso', type: 'text' }
          ]
        }
      case 'transactions':
        return {
          fields: [
            { key: 'transactionCode', label: 'Código de Transacción', type: 'text' },
            { key: 'order', label: 'Pedido', type: 'reference' },
            { key: 'customer', label: 'Cliente', type: 'customer' },
            { key: 'amount', label: 'Monto', type: 'currency' },
            { key: 'type', label: 'Tipo', type: 'text' },
            { key: 'status', label: 'Estado', type: 'badge' },
            { key: 'paymentMethod', label: 'Método de Pago', type: 'text' },
            { key: 'createdAt', label: 'Fecha de Creación', type: 'date' }
          ]
        }
      default:
        // Si no hay tipo específico, muestra todos los campos como texto
        return {
          fields: Object.keys(data).map(key => ({
            key,
            label: key,
            type: 'text'
          }))
        }
    }
  }
  // Renderiza el valor según el tipo de campo
  const renderFieldValue = (field, value) => {
    if (value === null || value === undefined || value === '') {
      return <span className="text-gray-500 italic">No especificado</span>
    }
    switch (field.type) {
      case 'currency':
        return <span className="font-semibold text-[#A73249]">{formatCurrency(value)}</span>
      case 'percentage':
        const percentage = (Number(value) * 100).toFixed(1)
        return <span className="font-medium text-[#3D1609]">{percentage}%</span>
      case 'number':
        return <span className="font-medium text-[#3D1609]">{Number(value).toLocaleString()}</span>
      case 'date':
        return <span className="text-gray-700">{formatDate(value)}</span>
      case 'email':
        return (
          <a href={`mailto:${value}`} className="text-[#A73249] hover:text-[#A73249]/80 hover:underline transition-colors">
            {value}
          </a>
        )
      case 'badge':
        // Muestra un badge de color según el valor
        const badgeValue = value?.toString()?.toLowerCase() || 'unknown'
        const badgeColors = {
          true: 'bg-green-100 text-green-800 border-green-200',
          false: 'bg-red-100 text-red-800 border-red-200',
          'disponible': 'bg-green-100 text-green-800 border-green-200',
          'agotado': 'bg-red-100 text-red-800 border-red-200',
          'en producción': 'bg-blue-100 text-blue-800 border-blue-200',
          'descontinuado': 'bg-gray-100 text-gray-800 border-gray-200',
          'venta': 'bg-green-100 text-green-800 border-green-200',
          'exhibición': 'bg-blue-100 text-blue-800 border-blue-200',
          'producción': 'bg-orange-100 text-orange-800 border-orange-200',
          'otro': 'bg-gray-100 text-gray-800 border-gray-200'
        }
        let displayText = value
        if (typeof value === 'boolean') {
          displayText = value ? 'Sí' : 'No'
        }
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${badgeColors[badgeValue] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
            {displayText}
          </span>
        )
      case 'reference':
        // Muestra información de referencia si es objeto
        if (typeof value === 'object' && value) {
          const displayName = value.name || value.contactPerson || value.orderCode || value.code || value._id?.slice(-6) || 'Sin nombre'
          return (
            <div className="bg-[#E8E1D8] px-3 py-2 rounded-lg border">
              <div className="font-medium text-[#3D1609]">{displayName}</div>
              {value.email && (
                <div className="text-sm text-gray-600">{value.email}</div>
              )}
            </div>
          )
        }
        return <span className="text-gray-500 italic">Referencia no encontrada</span>
        case 'customer':
          if (typeof value === 'object' && value.name) {
            // ✅ VERIFICAR MÚLTIPLES FORMAS DE CLIENTE
            const customerName = value.name || value.username || value.email?.split('@')[0]
            const customerLastName = value.lastName || ''
            const customerEmail = value.email || ''
            
            if (customerName) {
              return (
                <div className="bg-[#E8E1D8] px-3 py-2 rounded-lg border">
                  <div className="font-medium text-[#3D1609]">
                    {customerLastName ? `${customerName} ${customerLastName}` : customerName}
                  </div>
                  {customerEmail && (
                    <div className="text-sm text-gray-600">{customerEmail}</div>
                  )}
                </div>
              )
            }
          }
          return <span className="text-gray-500 italic">Cliente no encontrado</span>
      case 'array':
        // Muestra lista de elementos si es array
        if (Array.isArray(value) && value.length > 0) {
          return (
            <div className="space-y-2">
              {value.map((item, index) => (
                <div key={index} className="bg-[#E8E1D8] px-3 py-2 rounded-lg border">
                  <div className="font-medium text-[#3D1609]">
                    {(() => {
                      if (typeof item === 'object') {
                        // ✅ ESTRUCTURA ANIDADA: items[].itemId
                        if (item.itemId && typeof item.itemId === 'object') {
                          const product = item.itemId
                          let productInfo = ''
                          
                          if (product.name && product.price) {
                            productInfo = `${product.name} - $${product.price}`
                          } else if (product.name) {
                            productInfo = product.name
                          } else {
                            productInfo = 'Producto sin nombre'
                          }
                          
                          return productInfo
                        }
                        // ✅ PRODUCTOS: Mostrar nombre y precio
                        if (item.name && item.price) {
                          return `${item.name} - $${item.price}`
                        }
                        // ✅ PRODUCTOS: Solo nombre
                        if (item.name) {
                          return item.name
                        }
                        // ✅ MATERIALES: Mostrar correlativo o nombre
                        if (item.correlative) {
                          return `${item.correlative} - ${item.name || 'Material'}`
                        }
                        // ✅ FALLBACK: Cualquier nombre disponible
                        return item.name || item.username || item.orderCode || `Elemento ${index + 1}`
                      }
                      return item.toString()
                    })()}
                  </div>
                  {/* ✅ MOSTRAR INFORMACIÓN ADICIONAL PARA ITEMS */}
                  {typeof item === 'object' && item.quantity && (
                    <div className="text-sm text-gray-600 mt-1">Cantidad: {item.quantity}</div>
                  )}
                  {/* ✅ MOSTRAR INFO ADICIONAL PARA PRODUCTOS */}
                  {typeof item === 'object' && item.description && (
                    <div className="text-sm text-gray-600 mt-1">{item.description}</div>
                  )}
                  {typeof item === 'object' && item.stock && (
                    <div className="text-sm text-gray-600 mt-1">Stock: {item.stock}</div>
                  )}
                </div>
              ))}
              <div className="text-sm text-gray-600 font-medium">
                Total: {value.length} elemento{value.length !== 1 ? 's' : ''}
              </div>
            </div>
          )
        }
        return <span className="text-gray-500 italic">Sin elementos</span>
      case 'rating':
        // Muestra estrellas según la calificación
        const rating = Number(value) || 0
        return (
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="font-medium text-[#3D1609]">({rating}/5)</span>
          </div>
        )
      case 'image':
        // Muestra imagen si existe
        console.log("Rendering image field:", field.key, "value:", value);
        if (value && typeof value === 'string') {
          return (
            <div className="mt-2">
              <img src={value} alt="Imagen" className="w-40 h-40 object-cover rounded-lg border-2 border-[#E8E1D8] shadow-sm" onError={(e) => { 
              console.error("Error loading image:", value);
              e.target.style.display = 'none';
            }}
            onLoad={() => console.log("Image loaded successfully:", value)}
          />
            </div>
          )
        }
        return <span className="text-gray-500 italic">Sin imagen</span>
      case 'imageArray':
        // Muestra galería de imágenes si es array
        if (Array.isArray(value) && value.length > 0) {
          return (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
              {value.map((img, index) => (
                <img key={index} src={img} alt={`Imagen ${index + 1}`} className="w-full h-32 object-cover rounded-lg border-2 border-[#E8E1D8] shadow-sm" onError={(e) => { e.target.style.display = 'none' }}/>
              ))}
            </div>
          )
        }
        return <span className="text-gray-500 italic">Sin imágenes</span>
      default:
        // Por defecto muestra el valor como texto
        return <span className="text-gray-700">{value?.toString() || '-'}</span>
    }
  }
  // Obtiene la configuración de campos
  const config = getTypeConfig()

  return (
    // Usa el modal base para mostrar los detalles
    <BaseModal isOpen={isOpen} onClose={onClose} title={title} size="lg">
      <div className="p-6">
        {/* Muestra el ID si existe */}
        {data._id && (
          <div className="mb-6 p-4 bg-[#E8E1D8] rounded-lg border-2 border-[#A73249]/20">
            <div className="flex items-center gap-2 text-sm text-[#3D1609]">
              <Hash className="w-4 h-4 text-[#A73249]" />
              <span className="font-semibold font-[Quicksand]">ID:</span>
              <code className="bg-white px-3 py-1 rounded border font-mono text-xs text-[#3D1609]">
                {data._id}
              </code>
            </div>
          </div>
        )}
        {/* Muestra los campos configurados */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {config.fields.map((field) => {
            const value = data[field.key]
            const IconComponent = getFieldIcon(field.key)
            // No mostrar campos de sistema
            if (field.key === '_id' || field.key === '__v') return null
            return (
              <div key={field.key} className={field.type === 'imageArray' || field.type === 'array' || (field.type === 'text' && field.key === 'description') ? 'md:col-span-2' : ''}>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-5 h-5 text-[#A73249]" />
                    <label className="text-sm font-bold text-[#3D1609] font-[Quicksand]">
                      {field.label}
                    </label>
                  </div>
                  <div className="pl-7">
                    {renderFieldValue(field, value)}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </BaseModal>
  )
}
// Exporta el componente para su uso en otras partes
export default DetailModal