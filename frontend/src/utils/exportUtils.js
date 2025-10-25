// Utilidades de formato y extracción para exportación
const getDisplayFromObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj
  // ✅ PRODUCTOS: Mostrar nombre y precio
  if (obj.name && obj.price) return `${obj.name} - $${obj.price}`
  if (obj.name && obj.codeProduct) return `${obj.name} (${obj.codeProduct})`
  // Preferencias por tipo de entidad/referencia
  if (obj.orderCode) return obj.orderCode
  if (obj.codeProduct) return obj.codeProduct
  if (obj.refundCode) return obj.refundCode
  if (obj.name && obj.lastName) return `${obj.name} ${obj.lastName}`
  if (obj.name) return obj.name
  if (obj.username) return obj.username
  if (obj.contactPerson) return obj.contactPerson
  // ✅ NUNCA devolver _id
  return 'Sin información'
}

const formatDateCell = (value) => {
  if (!value) return ''
  
  // Si ya es una fecha válida
  if (value instanceof Date && !isNaN(value)) {
    return value.toLocaleString('es-ES')
  }
  
  // Si es string o número, intentar convertir
  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value)
    if (!isNaN(date.getTime())) {
      return date.toLocaleString('es-ES')
    }
  }
  
  // Si no se puede convertir, devolver el valor original
  return value.toString()
}
// ✅ DESPUÉS: Ser más específico con las claves de fecha
const isDateKey = (key) => {
  if (!key) return false
  const lowerKey = key.toLowerCase()
  
  // Claves específicas que son fechas
  const dateKeys = [
    'createdat', 'updatedat', 'date', 'birthdate', 'hiredate', 
    'purchasedate', 'requestdate', 'receiptDate'
  ]
  
  // Verificar si es una clave de fecha específica
  return dateKeys.includes(lowerKey) || 
         lowerKey.endsWith('date') || 
         lowerKey.endsWith('at') && (lowerKey.includes('created') || lowerKey.includes('updated'))
}
const isCurrencyKey = (key) => ['price','productionCost','piecePrice','subtotal','total','amount'].includes(key)

export const exportToCSV = (data, filename = 'datos') => {
  if (!data || data.length === 0) {
    console.warn('No hay datos para exportar')
    return
  }
  // Obtener las claves del primer objeto para los headers
  const headers = Object.keys(data[0])
  // Crear el contenido CSV
  const csvContent = [
    // Headers
    headers.join(','),
    // Datos
    ...data.map(row => 
      headers.map(header => {
        let value = row[header]
        // Objetos de referencia
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          value = getDisplayFromObject(value)
        }
        // Arrays
        else if (Array.isArray(value)) {
          const joined = value.map(v => (typeof v === 'object' ? getDisplayFromObject(v) : v)).join(' | ')
          value = joined || `${value.length} elementos`
        }
        // ✅ FECHAS: Solo procesar si realmente es una fecha
        else if (isDateKey(header) && value) {
          value = formatDateCell(value)
        }
        // Booleans
        else if (typeof value === 'boolean') {
          value = value ? 'Sí' : 'No'
        }        
        // Moneda: mantener numérico para Excel/CSV
        if (isCurrencyKey(header) && typeof value === 'number') {
          // sin formato para cálculos
        }
        // Escapar comas y comillas en el valor
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          value = `"${value.replace(/"/g, '""')}"`
        }
        return value ?? ''
      }).join(',')
    )
  ].join('\n')
  // Crear y descargar el archivo
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}
export const exportToExcel = (data, filename = 'datos') => {
  if (!data || data.length === 0) {
    console.warn('No hay datos para exportar')
    return
  }
  // Preparar datos para Excel (similar a CSV pero con mejor formato)
  const processedData = data.map(row => {
    const processedRow = {}
    
    Object.keys(row).forEach(key => {
      let value = row[key]
      // Manejar objetos anidados
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        processedRow[key] = getDisplayFromObject(value)
      }
      // Manejar arrays
      else if (Array.isArray(value)) {
        processedRow[key] = value.map(v => (typeof v === 'object' ? getDisplayFromObject(v) : v)).join(' | ')
      }
      // Manejar fechas
      else if (isDateKey(key)) {
        processedRow[key] = value ? new Date(value).toLocaleString('es-ES') : ''
      }
      // Booleans
      else if (typeof value === 'boolean') {
        processedRow[key] = value ? 'Sí' : 'No'
      }
      // Valores normales
      else {
        processedRow[key] = value
      }
    })
    
    return processedRow
  })
  // Crear headers en español
  const headerTranslations = {
    _id: 'ID',
    name: 'Nombre',
    lastName: 'Apellido',
    email: 'Email',
    phoneNumber: 'Teléfono',
    username: 'Usuario',
    categoryName: 'Categoría',
    supplierName: 'Proveedor',
    price: 'Precio',
    description: 'Descripción',
    stock: 'Stock',
    discount: 'Descuento',
    customer: 'Cliente',
    items: 'Ítems',
    total: 'Total',
    status: 'Estado',
    rating: 'Calificación',
    comment: 'Comentario',
    createdAt: 'Fecha de Creación',
    updatedAt: 'Fecha de Actualización',
    isVerified: 'Verificado',
    userType: 'Tipo de Usuario',
    // Customers
    birthDate: 'Fecha de Nacimiento',
    DUI: 'DUI',
    address: 'Dirección',
    profilePic: 'Foto de Perfil',
    preferredColors: 'Colores Preferidos',
    preferredMaterials: 'Materiales Preferidos',
    preferredJewelStyle: 'Estilo de Joya Preferido',
    purchaseOpportunity: 'Oportunidad de Compra',
    allergies: 'Alergias',
    jewelSize: 'Tamaño de Joya',
    budget: 'Presupuesto',
    hireDate: 'Fecha de Contratación',
    // Products
    codeProduct: 'Código de Producto',
    productionCost: 'Costo de Producción',
    hasDiscount: 'Tiene Descuento',
    highlighted: 'Destacado',
    movementType: 'Tipo de Movimiento',
    correlative: 'Correlativo',
    applicableCosts: 'Costos Aplicables',
    collection: 'Colección',
    category: 'Categoría',
    subcategory: 'Subcategoría',
    rawMaterialsUsed: 'Materias Primas',
    images: 'Imágenes',
    // Categories/Subcategories/Collections
    image: 'Imagen',
    isActive: 'Activa',
    // Suppliers
    contactPerson: 'Persona de Contacto',
    // Raw Materials
    type: 'Tipo',
    color: 'Color',
    tone: 'Tono',
    toneType: 'Tipo de Tono',
    texture: 'Textura',
    shape: 'Forma',
    dimension: 'Dimensión',
    brand: 'Marca',
    presentation: 'Presentación',
    quantity: 'Cantidad',
    piecesPerPresentation: 'Piezas por Presentación',
    totalPieces: 'Total Piezas',
    piecePrice: 'Precio por Pieza',
    provider: 'Proveedor',
    purchaseDate: 'Fecha de Compra',
    // Orders
    orderCode: 'Código de Pedido',
    receiver: 'Receptor',
    timetable: 'Horario',
    mailingAddress: 'Dirección de Envío',
    paymentMethod: 'Método de Pago',
    subtotal: 'Subtotal',
    paymentStatus: 'Estado de Pago',
    receiptDate: 'Fecha de Entrega',
    // Reviews
    response: 'Respuesta',
    // Custom Designs
    codeRequest: 'Código de Solicitud',
    piece: 'Pieza',
    base: 'Base',
    baseLength: 'Longitud de Base',
    decoration: 'Decoración',
    clasp: 'Cierre',
    customerComments: 'Comentarios del Cliente',
    // Refunds
    refundCode: 'Código de Reembolso',
    requestDate: 'Fecha de Solicitud',
    reason: 'Motivo',
    comments: 'Comentarios',
    amount: 'Monto',
    refundMethod: 'Método de Reembolso',
  }
  // Crear CSV con headers en español
  const headers = Object.keys(processedData[0])
  const translatedHeaders = headers.map(header => headerTranslations[header] || header)
  
  const csvContent = [
    translatedHeaders.join(','),
    ...processedData.map(row => 
      headers.map(header => {
        let value = row[header]
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          value = `"${value.replace(/"/g, '""')}"`
        }
        return value || ''
      }).join(',')
    )
  ].join('\n')
  // Descargar como archivo Excel (CSV compatible)
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}.xlsx`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}
export const exportToPDF = (data, filename = 'datos', title = 'Reporte de Datos') => {
  if (!data || data.length === 0) {
    console.warn('No hay datos para exportar')
    return
  }
  
  // Crear contenido HTML para el PDF
  const processedData = data.slice(0, 50) // Limitar a 50 registros para PDF
  console.log('Debugging data processing:')
  processedData.forEach((row, index) => {
    if (index === 0) { // Solo el primer registro
      Object.keys(row).forEach(key => {
        const value = row[key]
        const isDate = isDateKey(key)
        console.log(`${key}: ${value} (isDate: ${isDate}, type: ${typeof value})`)
        
        if (isDate && value) {
          const formatted = formatDateCell(value)
          console.log(`  Formatted: ${formatted}`)
        }
      })
    }
  })
  const headerTranslations = {
    _id: 'ID',
    name: 'Nombre',
    lastName: 'Apellido',
    email: 'Email',
    phoneNumber: 'Teléfono',
    username: 'Usuario',
    categoryName: 'Categoría',
    supplierName: 'Proveedor',
    price: 'Precio',
    description: 'Descripción',
    stock: 'Stock',
    discount: 'Descuento',
    customer: 'Cliente',
    total: 'Total',
    status: 'Estado',
    rating: 'Calificación',
    comment: 'Comentario',
    createdAt: 'Fecha de Creación',
    isVerified: 'Verificado',
    userType: 'Tipo',
    // Extras por dominio
    orderCode: 'Código de Pedido',
    refundCode: 'Código de Reembolso',
    amount: 'Monto'
  }
  // Seleccionar solo las columnas más importantes para PDF
  const preferredOrder = [
    'refundCode','orderCode','codeProduct','name','customer','order','price','amount','subtotal','total','status','paymentStatus','createdAt'
  ]
  const keys = Object.keys(processedData[0]).filter(k => k !== '__v')
  const importantColumns = [
    ...preferredOrder.filter(k => keys.includes(k)),
    ...keys.filter(k => !preferredOrder.includes(k) && !k.startsWith('_'))
  ].slice(0, 6)

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          margin: 20px;
          font-size: 12px;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #A73249;
          padding-bottom: 10px;
        }
        .header h1 {
          color: #A73249;
          margin: 0;
        }
        .header p {
          color: #3D1609;
          margin: 5px 0;
        }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin-top: 20px;
        }
        th, td { 
          border: 1px solid #ddd; 
          padding: 8px; 
          text-align: left;
          font-size: 10px;
        }
        th { 
          background-color: #A73249; 
          color: white;
          font-weight: bold;
        }
        tr:nth-child(even) { 
          background-color: #f9f9f9; 
        }
        .footer {
          margin-top: 30px;
          text-align: center;
          font-size: 10px;
          color: #3D1609;
          border-top: 1px solid #ddd;
          padding-top: 10px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Pergola</h1>
        <h2>${title}</h2>
        <p>Generado el: ${new Date().toLocaleDateString('es-ES', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</p>
        <p>Total de registros: ${data.length}${processedData.length < data.length ? ` (Mostrando primeros ${processedData.length})` : ''}</p>
      </div>   
      <table>
        <thead>
          <tr>
            ${importantColumns.map(col => `<th>${headerTranslations[col] || col}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${processedData.map(row => `<tr>${
            importantColumns.map(header => {
              let value = row[header]
              // Objetos de referencia
              if (value && typeof value === 'object' && !Array.isArray(value)) {
                value = getDisplayFromObject(value)
              }
              // Arrays
              else if (Array.isArray(value)) {
                const joined = value.map(v => (typeof v === 'object' ? getDisplayFromObject(v) : v)).join(' | ')
                value = joined || `${value.length} elementos`
              }
              // Fechas
              else if (isDateKey(header) && value) {
                value = formatDateCell(value)
              }
              // Booleans
              else if (typeof value === 'boolean') {
                value = value ? 'Sí' : 'No'
              }
              // Escapar comas y comillas
              if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                value = value.replace(/"/g, '""')
              }
              return `<td>${value ?? ''}</td>`
            }).join('')
          }</tr>`).join('')}
        </tbody>
      </table>
      <div class="footer">
        <p>© 2025 Pergola - Sistema de Gestión</p>
        <p>Este reporte contiene información confidencial de la empresa</p>
      </div>
    </body>
    </html>
  `
  // Crear y descargar PDF
  const printWindow = window.open('', '_blank')
  printWindow.document.write(htmlContent)
  printWindow.document.close()
  
  // Esperar a que se cargue y luego imprimir
  printWindow.onload = () => {
    setTimeout(() => {
      printWindow.print()
      // No cerrar automáticamente para que el usuario pueda guardar como PDF
    }, 500)
  }
}
// Funcion principal que maneja todos los formatos
export const handleExport = (format, data, filename, title) => {
  if (!data || data.length === 0) {
    alert('No hay datos para exportar')
    return
  }
  const timestamp = new Date().toISOString().slice(0, 10)
  const fullFilename = `${filename}_${timestamp}`

  switch (format) {
    case 'csv':
      exportToCSV(data, fullFilename)
      break
    case 'excel':
      exportToExcel(data, fullFilename)
      break
    case 'pdf':
      exportToPDF(data, fullFilename, title)
      break
    default:
      console.warn('Formato de exportación no soportado:', format)
  }
}