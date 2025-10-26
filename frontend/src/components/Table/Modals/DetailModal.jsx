// Importa iconos y el modal base
import { Package, Tag, DollarSign, Star, Hash, FileText, Eye, Image, Layers, Building, Boxes, MessageSquare, CheckCircle, XCircle, Gem, Archive, Palette, Calendar, User, Mail, Phone, MapPin, Ruler, Paintbrush, Link, CreditCard, RefreshCcw, Receipt, Check, Cake, IdCard, RulerDimensionLine, Eclipse, SprayCan, SquaresIntersect, Diameter, Percent, GalleryHorizontal, Clock, ShoppingCart, TrendingUp, AlertCircle } from 'lucide-react'
import BaseModal from './BaseModal'

// Componente modal para mostrar detalles de un elemento
const DetailModal = ({ isOpen, onClose, data, title = "Detalles", type = "generic" }) => {
  // Si no hay datos, no renderiza nada
  if (!data) return null

  // Función para formatear fechas
  const formatDate = (dateString) => {
    if (!dateString) return '-'
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return dateString
      return date.toLocaleDateString('es-ES', {
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
      // Fechas y tiempo
      createdAt: Calendar,
      updatedAt: Calendar,
      purchaseDate: Calendar,
      requestDate: Calendar,
      receiptDate: Calendar,
      birthDate: Cake,
      hireDate: Calendar,
      timetable: Clock,
      
      // Usuarios y personas
      name: User,
      lastName: User,
      contactPerson: User,
      username: IdCard,
      customer: User,
      receiver: User,
      order: Package,
      
      // Preferencias de cliente
      preferredColors: Palette,
      preferredMaterials: Boxes, 
      preferredJewelStyle: Gem, 
      purchaseOpportunity: Tag,
      allergies: AlertCircle, 
      jewelSize: Ruler,
      budget: DollarSign,
      
      // Contacto
      email: Mail,
      phoneNumber: Phone,
      address: MapPin,
      mailingAddress: MapPin,
      
      // Dinero y precios
      price: DollarSign,
      piecePrice: DollarSign,
      productionCost: DollarSign,
      discount: Percent,
      amount: DollarSign,
      subtotal: DollarSign,
      total: DollarSign,
      
      // Inventario
      stock: Archive,
      quantity: Archive,
      totalPieces: Archive,
      piecesPerPresentation: Archive,
      
      // Categorización
      category: Tag,
      subcategory: Tag,
      collection: Layers,
      status: Tag,
      type: Tag,
      movementType: TrendingUp,
      paymentMethod: CreditCard,
      paymentStatus: CreditCard,
      refundMethod: RefreshCcw,
      
      // Proveedores y referencias
      provider: Building,
      supplier: Building,
      
      // Materiales y propiedades
      color: Palette,
      tone: Eclipse,
      toneType: SprayCan,
      texture: SquaresIntersect,
      shape: Diameter,
      dimension: RulerDimensionLine,
      brand: Tag,
      presentation: Package,
      correlative: Hash,
      
      // Productos y códigos
      codeProduct: Hash,
      orderCode: Hash,
      refundCode: Receipt,
      codeRequest: Hash,
      
      // Elementos de diseño
      piece: Gem,
      base: Gem,
      baseLength: Ruler,
      decoration: Paintbrush,
      clasp: Link,
      rawMaterialsUsed: Boxes,
      
      // Calificaciones y reseñas
      rating: Star,
      comment: MessageSquare,
      customerComments: MessageSquare,
      response: MessageSquare,
      reason: MessageSquare,
      comments: MessageSquare,
      
      // Productos e items
      items: ShoppingCart,
      product: Package,
      
      // Estados y verificaciones
      highlighted: Star,
      hasDiscount: Check,
      isActive: CheckCircle,
      isVerified: Check,
      
      // Imágenes
      image: Image,
      images: GalleryHorizontal,
      profilePic: Image,
      
      // Otros
      applicableCosts: DollarSign,
      description: FileText,
      _id: Hash,
      
      // Genérico por defecto
      default: Eye
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
            { key: 'preferredColors', label: 'Colores Preferidos', type: 'array-text' },
            { key: 'preferredMaterials', label: 'Materiales Preferidos', type: 'array-text' },
            { key: 'preferredJewelStyle', label: 'Estilo de Joya Preferido', type: 'array-text' },
            { key: 'purchaseOpportunity', label: 'Oportunidad de Compra', type: 'text' },
            { key: 'allergies', label: 'Alergias', type: 'text' },
            { key: 'jewelSize', label: 'Tamaño de Joya', type: 'text' },
            { key: 'budget', label: 'Presupuesto', type: 'text' },
            { key: 'createdAt', label: 'Fecha de Registro', type: 'date' }
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
            { key: 'hireDate', label: 'Fecha de Contratación', type: 'date' },
            { key: 'profilePic', label: 'Foto', type: 'image' },
            { key: 'createdAt', label: 'Fecha de Registro', type: 'date' }
          ]
        }

      case 'products':
        return {
          fields: [
            { key: 'codeProduct', label: 'Código de Producto', type: 'text' },
            { key: 'name', label: 'Nombre del Producto', type: 'text' },
            { key: 'description', label: 'Descripción', type: 'text' },
            { key: 'images', label: 'Imágenes', type: 'imageArray' },
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
            { key: 'createdAt', label: 'Fecha de Creación', type: 'date' }
          ]
        }

      case 'categories':
      case 'subcategories':
      case 'collections':
        return {
          fields: [
            { key: 'name', label: `Nombre de la ${type === 'categories' ? 'Categoría' : type === 'subcategories' ? 'Subcategoría' : 'Colección'}`, type: 'text' },
            { key: 'description', label: 'Descripción', type: 'text' },
            { key: 'image', label: 'Imagen', type: 'image' },
            { key: 'isActive', label: 'Activa', type: 'badge' },
            { key: 'createdAt', label: 'Fecha de Creación', type: 'date' }
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
            { key: 'createdAt', label: 'Fecha de Registro', type: 'date' }
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
            { key: 'createdAt', label: 'Fecha de Creación', type: 'date' }
          ]
        }

      case 'reviews':
        return {
          fields: [
            { key: 'product', label: 'Producto', type: 'reference' },
            { key: 'customer', label: 'Cliente', type: 'customer' },
            { key: 'rating', label: 'Calificación', type: 'rating' },
            { key: 'comment', label: 'Comentario', type: 'text' },
            { key: 'response', label: 'Respuesta', type: 'text' },
            { key: 'createdAt', label: 'Fecha de la Reseña', type: 'date' }
          ]
        }

      case 'customdesigns':
        return {
          fields: [
            { key: 'codeRequest', label: 'Código de Solicitud', type: 'text' },
            { key: 'piece', label: 'Pieza', type: 'badge' },
            { key: 'base', label: 'Base', type: 'reference' },
            { key: 'baseLength', label: 'Longitud de Base', type: 'text' },
            { key: 'decoration', label: 'Decoración', type: 'array' },
            { key: 'clasp', label: 'Cierre', type: 'reference' },
            { key: 'customerComments', label: 'Comentarios del Cliente', type: 'text' },
            { key: 'createdAt', label: 'Fecha de Solicitud', type: 'date' }
          ]
        }

      case 'designelements':
        return {
          fields: [
            { key: 'name', label: 'Nombre', type: 'text' },
            { key: 'type', label: 'Tipo', type: 'badge' },
            { key: 'image', label: 'Imagen', type: 'image' },
            { key: 'createdAt', label: 'Fecha de Creación', type: 'date' }
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
            { key: 'receiptDate', label: 'Fecha de Recepción', type: 'date' },
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

      default:
        // Si no hay tipo específico, muestra todos los campos como texto
        return {
          fields: Object.keys(data).map(key => ({
            key,
            label: key.charAt(0).toUpperCase() + key.slice(1),
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
        const badgeValue = value?.toString()?.toLowerCase() || 'unknown'
        const badgeColors = {
          // Booleanos
          'true': 'bg-green-100 text-green-800 border-green-200',
          'false': 'bg-red-100 text-red-800 border-red-200',
          'sí': 'bg-green-100 text-green-800 border-green-200',
          'no': 'bg-red-100 text-red-800 border-red-200',
          
          // Estados de productos
          'disponible': 'bg-green-100 text-green-800 border-green-200',
          'agotado': 'bg-red-100 text-red-800 border-red-200',
          'en producción': 'bg-blue-100 text-blue-800 border-blue-200',
          'descontinuado': 'bg-gray-100 text-gray-800 border-gray-200',
          
          // Tipos de movimiento
          'venta': 'bg-green-100 text-green-800 border-green-200',
          'exhibición': 'bg-blue-100 text-blue-800 border-blue-200',
          'producción': 'bg-orange-100 text-orange-800 border-orange-200',
          'otro': 'bg-gray-100 text-gray-800 border-gray-200',
          
          // Estados de pedidos
          'pendiente': 'bg-yellow-100 text-yellow-800 border-yellow-200',
          'en proceso': 'bg-blue-100 text-blue-800 border-blue-200',
          'enviado': 'bg-purple-100 text-purple-800 border-purple-200',
          'entregado': 'bg-green-100 text-green-800 border-green-200',
          'cancelado': 'bg-red-100 text-red-800 border-red-200',
          
          // Estados de pago
          'pagado': 'bg-green-100 text-green-800 border-green-200',
          'reembolsado': 'bg-orange-100 text-orange-800 border-orange-200',
          'fallido': 'bg-red-100 text-red-800 border-red-200',
          
          // Estados de reembolso
          'aprobado': 'bg-green-100 text-green-800 border-green-200',
          'rechazado': 'bg-red-100 text-red-800 border-red-200',
          'procesado': 'bg-blue-100 text-blue-800 border-blue-200',
          
          // Tipos de diseño
          'pulsera': 'bg-pink-100 text-pink-800 border-pink-200',
          'cadena': 'bg-yellow-100 text-yellow-800 border-yellow-200',
          'tobillera': 'bg-purple-100 text-purple-800 border-purple-200',
          
          // Elementos de diseño
          'base': 'bg-blue-100 text-blue-800 border-blue-200',
          'decoration': 'bg-pink-100 text-pink-800 border-pink-200',
          'decoración': 'bg-pink-100 text-pink-800 border-pink-200',
          'clasp': 'bg-gray-100 text-gray-800 border-gray-200',
          'cierre': 'bg-gray-100 text-gray-800 border-gray-200'
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
        if (typeof value === 'object' && value) {
          const displayName = value.name || value.contactPerson || value.orderCode || value.refundCode || value.code || value._id?.slice(-6) || 'Sin nombre'
          return (
            <div className="bg-[#E8E1D8] px-3 py-2 rounded-lg border">
              <div className="font-medium text-[#3D1609]">{displayName}</div>
              {value.email && (
                <div className="text-sm text-gray-600">{value.email}</div>
              )}
              {value.description && (
                <div className="text-sm text-gray-600 mt-1 line-clamp-2">{value.description}</div>
              )}
            </div>
          )
        }
        return <span className="text-gray-500 italic">Referencia no encontrada</span>

      case 'customer':
        if (typeof value === 'object' && value) {
          const customerName = value.name || value.username || value.email?.split('@')[0] || 'Cliente'
          const customerLastName = value.lastName || ''
          const customerEmail = value.email || ''
          
          return (
            <div className="bg-[#E8E1D8] px-3 py-2 rounded-lg border">
              <div className="font-medium text-[#3D1609]">
                {customerLastName ? `${customerName} ${customerLastName}` : customerName}
              </div>
              {customerEmail && (
                <div className="text-sm text-gray-600">{customerEmail}</div>
              )}
              {value.phoneNumber && (
                <div className="text-sm text-gray-600">{value.phoneNumber}</div>
              )}
            </div>
          )
        }
        return <span className="text-gray-500 italic">Cliente no encontrado</span>

      case 'array':
        if (Array.isArray(value) && value.length > 0) {
          return (
            <div className="space-y-2">
              {value.map((item, index) => (
                <div key={index} className="bg-[#E8E1D8] px-3 py-2 rounded-lg border">
                  <div className="font-medium text-[#3D1609]">
                    {(() => {
                      if (typeof item === 'object' && item) {
                        // Para items de orden con estructura anidada
                        if (item.itemId && typeof item.itemId === 'object') {
                          const product = item.itemId
                          const productName = product.name || 'Producto sin nombre'
                          const productPrice = product.price ? ` - ${formatCurrency(product.price)}` : ''
                          return `${productName}${productPrice}`
                        }
                        
                        // Para productos directos
                        if (item.name) {
                          const productPrice = item.price ? ` - ${formatCurrency(item.price)}` : ''
                          return `${item.name}${productPrice}`
                        }
                        
                        // Para materiales con correlativo
                        if (item.correlative) {
                          return `${item.correlative} - ${item.name || 'Material'}`
                        }
                        
                        // Para referencias de design elements
                        if (item.type && item.name) {
                          return `${item.name} (${item.type})`
                        }
                        
                        // Para cualquier objeto con nombre
                        return item.name || item.username || item.orderCode || item.code || `Elemento ${index + 1}`
                      }
                      
                      // Para valores primitivos
                      return item.toString()
                    })()}
                  </div>
                  
                  {/* Información adicional para items */}
                  {typeof item === 'object' && item && (
                    <div className="text-sm text-gray-600 mt-1 space-y-1">
                      {item.quantity && (
                        <div>Cantidad: {item.quantity}</div>
                      )}
                      {item.price && !item.itemId && (
                        <div>Precio: {formatCurrency(item.price)}</div>
                      )}
                      {item.description && (
                        <div className="line-clamp-2">{item.description}</div>
                      )}
                      {item.stock && (
                        <div>Stock: {item.stock}</div>
                      )}
                      {item.correlative && (
                        <div>Código: {item.correlative}</div>
                      )}
                    </div>
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

      case 'array-text':
        // Para arrays que vienen como strings separados por comas
        if (Array.isArray(value)) {
          return (
            <div className="flex flex-wrap gap-2">
              {value.map((item, index) => (
                <span key={index} className="px-2 py-1 bg-[#E8E1D8] text-[#3D1609] rounded-md text-sm border">
                  {item}
                </span>
              ))}
            </div>
          )
        }
        // Si es un string con comas, lo convertimos a array
        if (typeof value === 'string' && value.includes(',')) {
          const items = value.split(',').map(item => item.trim()).filter(item => item)
          return (
            <div className="flex flex-wrap gap-2">
              {items.map((item, index) => (
                <span key={index} className="px-2 py-1 bg-[#E8E1D8] text-[#3D1609] rounded-md text-sm border">
                  {item}
                </span>
              ))}
            </div>
          )
        }
        return <span className="text-gray-700">{value?.toString() || '-'}</span>

      case 'rating':
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
        if (value && typeof value === 'string') {
          return (
            <div className="mt-2">
              <img 
                src={value} 
                alt="Imagen" 
                className="max-w-full h-auto max-h-64 object-contain rounded-lg border-2 border-[#E8E1D8] shadow-sm bg-white" 
                onError={(e) => { 
                  console.error("Error loading image:", value);
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
                onLoad={() => console.log("Image loaded successfully:", value)}
              />
              <div 
                className="text-sm text-gray-500 italic mt-2" 
                style={{ display: 'none' }}
              >
                Error al cargar la imagen
              </div>
            </div>
          )
        }
        return <span className="text-gray-500 italic">Sin imagen</span>

      case 'imageArray':
        if (Array.isArray(value) && value.length > 0) {
          return (
            <div className="mt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {value.map((img, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={img} 
                      alt={`Imagen ${index + 1}`} 
                      className="w-full h-32 object-cover rounded-lg border-2 border-[#E8E1D8] shadow-sm bg-white hover:shadow-md transition-shadow cursor-pointer" 
                      onError={(e) => { 
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                      onClick={() => {
                        // Abrir imagen en nueva ventana para vista completa
                        window.open(img, '_blank');
                      }}
                    />
                    <div 
                      className="absolute inset-0 flex items-center justify-center bg-gray-100 border-2 border-[#E8E1D8] rounded-lg text-sm text-gray-500" 
                      style={{ display: 'none' }}
                    >
                      Error al cargar imagen {index + 1}
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-600 font-medium mt-3">
                Total: {value.length} imagen{value.length !== 1 ? 'es' : ''}
              </div>
            </div>
          )
        }
        return <span className="text-gray-500 italic">Sin imágenes</span>

      default:
        return <span className="text-gray-700">{value?.toString() || '-'}</span>
    }
  }

  // Obtiene la configuración de campos
  const config = getTypeConfig()

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={title} size="lg">
      <div className="p-6">
        {/* Muestra el ID si existe */}
        {data._id && (
          <div className="mb-6 p-4 bg-[#E8E1D8] rounded-lg border-2 border-[#A73249]/20">
            <div className="flex items-center gap-2 text-sm text-[#3D1609]">
              <Hash className="w-4 h-4 text-[#A73249]" />
              <span className="font-semibold font-[Quicksand]">ID:</span>
              <code className="bg-white px-3 py-1 rounded border font-mono text-xs text-[#3D1609] select-all">
                {data._id}
              </code>
            </div>
          </div>
        )}

        {/* Grid adaptativo para los campos */}
        <div className="space-y-6">
          {config.fields.map((field) => {
            const value = data[field.key]
            const IconComponent = getFieldIcon(field.key)
            
            // No mostrar campos de sistema
            if (field.key === '_id' || field.key === '__v') return null
            
            // Determinar si el campo debe ocupar toda la fila
            const isFullWidth = field.type === 'imageArray' || 
                               field.type === 'array' || 
                               (field.type === 'text' && (field.key === 'description' || field.key === 'customerComments' || field.key === 'reason' || field.key === 'comments' || field.key === 'response')) ||
                               field.key === 'mailingAddress' ||
                               field.key === 'address'

            return (
              <div key={field.key} className={`${isFullWidth ? 'col-span-full' : ''}`}>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-5 h-5 text-[#A73249] flex-shrink-0" />
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

        {/* Información adicional de metadatos si existe */}
        {(data.updatedAt || data.createdAt) && (
          <div className="mt-8 pt-6 border-t border-[#E8E1D8]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              {data.createdAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#A73249]" />
                  <span>Creado: {formatDate(data.createdAt)}</span>
                </div>
              )}
              {data.updatedAt && data.updatedAt !== data.createdAt && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#A73249]" />
                  <span>Actualizado: {formatDate(data.updatedAt)}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </BaseModal>
  )
}

export default DetailModal