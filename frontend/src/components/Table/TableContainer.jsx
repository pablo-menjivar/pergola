import { useState, useMemo } from 'react'
import TableHeader from './TableHeader'
import DataTable from './DataTable'
import FormModal from './Modals/FormModal'
import ConfirmModal from './Modals/ConfirmModal'
import DetailModal from './Modals/DetailModal'

// Componente contenedor principal para la tabla y sus acciones/modales
const TableContainer = ({config, data = [], onAdd, onEdit, onDelete, onExport, isLoading = false, className = "", categoriesData, subcategoriesData, collectionsData, suppliersData, customersData, rawMaterialsData, productsData, ordersData, refundsData, transactionsData, employeesData, designElementsData}) => {
  // Estados para búsqueda, ordenamiento, paginación y modales
  const [searchValue, setSearchValue] = useState("")
  const [sortBy, setSortBy] = useState(null)
  const [sortOrder, setSortOrder] = useState('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [detailModalType, setDetailModalType] = useState('generic')

  // Procesa los campos del formulario con opciones dinámicas (categorías, proveedores, etc.)
  const processedFormFields = useMemo(() => {
    console.log('🔍 Processing form fields. productsData:', productsData);
    
    return config.formFields.map(field => {
      // Opciones para categorías
      if (field.options === 'categories' && categoriesData?.categories) {
        return {
          ...field,
          options: categoriesData.categories.map(cat => ({
            value: cat._id,
            label: `${cat.name}`
          }))
        }
      }
      // Opciones para subcategorías
      if (field.options === 'subcategories' && subcategoriesData?.subcategories) {
        return {
          ...field,
          options: subcategoriesData.subcategories.map(subcat => ({
            value: subcat._id,
            label: `${subcat.name}`
          }))
        }
      }
      // Opciones para colecciones
      if (field.options === 'collections' && collectionsData?.collections) {
        return {
          ...field,
          options: collectionsData.collections.map(col => ({
            value: col._id,
            label: `${col.name}`
          }))
        }
      }
      // Opciones para proveedores
      if (field.options === 'suppliers' && suppliersData?.suppliers) {
        return {
          ...field,
          options: suppliersData.suppliers.map(sup => ({
            value: sup._id,
            label: `${sup.name} (${sup.email})`
          }))
        }
      }
      // Opciones para clientes
      if (field.options === 'customers' && customersData?.customers) {
        return {
          ...field,
          options: customersData.customers.map(customer => ({
            value: customer._id,
            label: `${customer.name} ${customer.lastName} (${customer.email})`
          }))
        }
      }
      // Opciones para empleados
      if (field.options === 'employees' && employeesData?.employees) {
        return {
          ...field,
          options: employeesData.employees.map(emp => ({
            value: emp._id,
            label: `${emp.name} (${emp.email})`
          }))
        }
      }
      // Opciones para materias primas
      if (field.options === 'rawmaterials' && rawMaterialsData?.rawMaterials) {
        return {
            ...field,
            options: rawMaterialsData.rawMaterials.map(material => ({
            value: material._id,
            label: `${material.name} - ${material.description}`
            }))
        }
      }
      // Opciones para productos
      if (field.options === 'products' && productsData?.products) {
        return {
          ...field,
          options: productsData.products.map(product => ({
            value: product._id,
            label: `${product.name} ${product.description}`
          }))
        }
      }
      // ✅ FIX PRINCIPAL: Para campos order-items, pasar la lista completa de productos
      if (field.type === 'order-items') {
        console.log('✅ Processing order-items field. Products available:', productsData?.products?.length);
        return {
          ...field,
          productsData: productsData?.products || []
        }
      }
      
      // Opciones para pedidos
      if (field.options === 'orders' && ordersData?.orders) {
        return {
          ...field,
          options: ordersData.orders.map(order => ({
            value: order._id,
            label: `Pedido #${order._id.slice(-6)} - $${order.total}`
          }))
        }
      }
      // Opciones para reembolsos
      if (field.options === 'refunds' && refundsData?.refunds) {
        return {
          ...field,
          options: refundsData.refunds.map(refund => ({
            value: refund._id,
            label: `${refund.name} ${refund.description}`
          }))
        }
      }
      // Opciones para transacciones
      if (field.options === 'transactions' && transactionsData?.transactions) {
        return {
          ...field,
          options: transactionsData.transactions.map(transaction => ({
            value: transaction._id,
            label: `${transaction.name} ${transaction.description}`
          }))
        }
      }
      // Opciones para elementos de diseño
      if (field.options === 'designelements' && designElementsData?.designElements) {
        return {
          ...field,
          options: designElementsData.designElements.map(designElement => ({
            value: designElement._id,
            label: `${designElement.name} ${designElement.description}`
          }))
        }
      }
      // Si no hay opciones dinámicas, retorna el campo tal cual
      return field
    })
  }, [config.formFields, categoriesData?.categories, subcategoriesData?.subcategories, collectionsData?.collections, suppliersData?.suppliers, customersData?.customers, rawMaterialsData?.rawMaterials, productsData?.products, ordersData?.orders, refundsData?.refunds, transactionsData?.transactions, employeesData?.employees, designElementsData?.designElements])
  
  // Función para obtener el valor buscable de cada columna/item
  const getSearchableValue = (item, column) => {
    const value = item[column.key]
    if (value === null || value === undefined) return ''
    // Maneja objetos anidados (categorías, clientes, proveedores, etc.)
    if (value && typeof value === 'object') {
      if (column.key === 'product') {
        // ✅ BUSCAR POR NOMBRE, DESCRIPCIÓN Y PRECIO
        return `${value.name || ''} ${value.description || ''} ${value.codeProduct || ''} ${value.price || ''}`.toLowerCase()
      }
      if (column.key === 'customer') {
        return `${value.name || ''} ${value.lastName || ''} ${value.email || ''} ${value.username || ''}`.toLowerCase()
      }
      // ✅ ITEMS CON ESTRUCTURA ANIDADA
      if (column.key === 'items' && Array.isArray(value)) {
        return value.map(orderItem => {
          if (typeof orderItem === 'object') {
            // ✅ Manejar tanto estructura populada como simple
            const product = orderItem.itemId || orderItem;
            if (typeof product === 'object') {
              return `${product.name || ''} ${product.description || ''} ${product.codeProduct || ''} ${product.price || ''}`
            }
            return product.toString();
          }
          return orderItem.toString();
        }).join(' ').toLowerCase()
      }
      if (column.key === 'employee') {
        return `${value.name || ''} ${value.lastName || ''} ${value.email || ''}`.toLowerCase()
      }
      if (column.key === 'provider') {
        return `${value.name || ''} ${value.contactPerson || ''} ${value.email || ''}`.toLowerCase()
      }
      if (['category', 'subcategory', 'collection'].includes(column.key)) {
        return `${value.name || ''} ${value.description || ''}`.toLowerCase()
      }
      if (column.key === 'rawMaterialsUsed') {
        return value.map(m => `${m.name || ''} ${m.description || ''} ${m.correlative || ''}`).join(' ').toLowerCase()
      }
      if (column.key === 'customdesigns') {
        return `${value.codeRequest || ''} ${value.piece || ''} ${value.base || ''} ${value.baseLength || ''} ${value.decoration || ''} ${value.clasp || ''} ${value.customerComments || ''}`.toLowerCase()
      }
      if (column.key === 'orders') {
        return `${value.name || ''} ${value.description || ''} ${value.correlative || ''}`.toLowerCase()
      }
      if (column.key === 'refunds') {
        return `${value.name || ''} ${value.description || ''} ${value.correlative || ''}`.toLowerCase()
      }
      if (column.key === 'transactions') {
        return `${value.name || ''} ${value.description || ''} ${value.correlative || ''}`.toLowerCase()
      }
      if (column.key === 'designelements') {
        return `${value.name || ''} ${value.description || ''} ${value.correlative || ''}`.toLowerCase()
      }
      // Valor por defecto para objetos
      return Object.values(value).join(' ').toLowerCase()
    }
    // Maneja arrays
    if (Array.isArray(value)) {
      return value.map(item => {
        if (typeof item === 'object') {
          return `${item.name || ''} ${item.description || ''} ${item.correlative || ''}`
        }
        return item
      }).join(' ').toLowerCase()
    }
    // Maneja fechas
    if (column.key.includes('At') || column.key.includes('Date')) {
      try {
        const dateStr = new Date(value).toLocaleDateString('es-ES')
        return `${value} ${dateStr}`.toLowerCase()
      } catch {
        return value.toString().toLowerCase()
      }
    }
    // Maneja booleanos
    if (typeof value === 'boolean') {
      return value ? 'sí yes true verificado activo disponible' : 'no false sin verificar inactivo indisponible'
    }
    // Valor normal
    return value.toString().toLowerCase()
  }
  // Filtra y ordena los datos según búsqueda y ordenamiento
  const filteredAndSortedData = useMemo(() => {
    let filtered = data
    // Filtrado por búsqueda
    if (searchValue && searchValue.trim()) {
      const searchLower = searchValue.toLowerCase().trim()
      const searchTerms = searchLower.split(' ').filter(term => term.length > 0)
      filtered = data.filter(item => {
        const searchableColumns = config.columns.filter(col => col.searchable !== false)
        const searchableText = searchableColumns.map(col => 
          getSearchableValue(item, col)
        ).join(' ').toLowerCase()
        return searchTerms.every(term => searchableText.includes(term))
      })
    }
    // Ordenamiento
    if (sortBy) {
      filtered = [...filtered].sort((a, b) => {
        let aVal = a[sortBy]
        let bVal = b[sortBy]
        // Maneja objetos anidados
        if (aVal && typeof aVal === 'object') {
          if (aVal.name && aVal.lastName) aVal = `${aVal.name} ${aVal.lastName}`
          else if (aVal.name) aVal = aVal.name
          else if (aVal.contactPerson) aVal = aVal.contactPerson
          else aVal = aVal._id || ''
        }
        if (bVal && typeof bVal === 'object') {
          if (bVal.name && bVal.lastName) bVal = `${bVal.name} ${bVal.lastName}`
          else if (bVal.name) bVal = bVal.name
          else if (bVal.contactPerson) bVal = bVal.contactPerson
          else bVal = bVal._id || ''
        }
        // Maneja arrays por longitud
        if (Array.isArray(aVal)) aVal = aVal.length
        if (Array.isArray(bVal)) bVal = bVal.length
        // Valores nulos
        if (aVal === null || aVal === undefined) aVal = ''
        if (bVal === null || bVal === undefined) bVal = ''
        // Comparación
        aVal = aVal.toString().toLowerCase()
        bVal = bVal.toString().toLowerCase()
        if (aVal === bVal) return 0
        const result = aVal > bVal ? 1 : -1
        return sortOrder === 'asc' ? result : -result
      })
    }
    return filtered
  }, [data, searchValue, sortBy, sortOrder, config.columns])
  // Datos paginados
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredAndSortedData.slice(startIndex, startIndex + pageSize)
  }, [filteredAndSortedData, currentPage, pageSize])
  // Handlers para búsqueda, ordenamiento, paginación y acciones
  const handleSearch = (value) => {
    setSearchValue(value)
    setCurrentPage(1) // Reset a primera página
  }
  const handleSort = (columnKey, direction) => {
    setSortBy(columnKey)
    setSortOrder(direction)
  }
  const handlePageChange = (page) => {
    setCurrentPage(page)
  }
  const handlePageSizeChange = (size) => {
    setPageSize(size)
    setCurrentPage(1)
  }
  const handleAdd = () => {
    setSelectedItem(null)
    setShowAddModal(true)
  }
  const handleEdit = (item) => {
    // Procesa el item para extraer IDs de objetos populados
    const processedItem = { ...item }
    if (item.customer && typeof item.customer === 'object') {
      processedItem.customer = item.customer._id
    }
    if (item.category && typeof item.category === 'object') {
      processedItem.category = item.category._id
    }
    if (item.subcategory && typeof item.subcategory === 'object') {
      processedItem.subcategory = item.subcategory._id
    }
    if (item.collection && typeof item.collection === 'object') {
      processedItem.collection = item.collection._id
    }
    if (item.provider && typeof item.provider === 'object') {
      processedItem.provider = item.provider._id
    }
    if (item.product && typeof item.product === 'object') {
      processedItem.product = item.product._id
    }
    if (item.order && typeof item.order === 'object') {
      processedItem.order = item.order._id
    }
    // Procesa arrays de referencias
    if (item.rawMaterialsUsed && Array.isArray(item.rawMaterialsUsed)) {
      processedItem.rawMaterialsUsed = item.rawMaterialsUsed.map(material => 
        typeof material === 'object' ? material._id : material
      )
    }
    if (item.items && Array.isArray(item.items)) {
    processedItem.items = item.items.map(orderItem => {
      // Si ya tiene la estructura correcta (con itemId, quantity, price)
      if (orderItem.itemId && typeof orderItem.itemId === 'object') {
        return {
          itemId: orderItem.itemId._id,
          quantity: orderItem.quantity || 1,
          price: orderItem.price || 0
        }
      }
      // Si es objeto directo sin estructura
      if (typeof orderItem === 'object') {
        return {
          itemId: orderItem._id,
          quantity: 1,
          price: orderItem.price || 0
        }
      }
      // Si es solo ID string
      return {
        itemId: orderItem,
        quantity: 1,
        price: 0
      }
    })
  }
    // Procesa campos de tipo fecha
    config.formFields.forEach(field => {
      if (field.type === 'date' && processedItem[field.name]) {
        const dateValue = new Date(processedItem[field.name]);
        if (!isNaN(dateValue)) {
          processedItem[field.name] = dateValue.toISOString().split('T')[0]; // Convierte a YYYY-MM-DD
        } else {
          processedItem[field.name] = ''; // Valor vacío si la fecha es inválida
        }
      }
    });
    setSelectedItem(processedItem)
    setShowEditModal(true)
  }
  const handleDelete = (item) => {
    setSelectedItem(item)
    setShowDeleteModal(true)
  }
  const handleView = (item) => {
    setSelectedItem(item)
    // Determina el tipo de modal de detalle según el título
    let modalType = 'generic'
    if (config.title) {
      const normalizedTitle = config.title.toLowerCase().replace(/\s+/g, '').replace('ías', 'ies')
      const typeMapping = {
        'productos': 'products',
        'categorías': 'categories', // Sin tilde
        'subcategorías': 'subcategories', // Sin tilde  
        'colecciones': 'collections',
        'proveedores': 'suppliers',
        'materiasprimas': 'rawmaterials',
        'reseñas': 'reviews', // Sin tilde
        'diseñosúnicos': 'customdesigns', // Sin tilde - CORREGIDO
        'clientes': 'customers',
        'empleados': 'employees',
        'pedidos': 'orders',
        'reembolsos': 'refunds',
        'transacciones': 'transactions',
        'elementosdediseño': 'designelements' // Sin tilde - CORREGIDO
      }
      modalType = typeMapping[normalizedTitle] || normalizedTitle
      // DEBUG: Para verificar el mapeo
      console.log('Original title:', config.title)
      console.log('Normalized title:', normalizedTitle)
      console.log('Mapped modal type:', modalType)
    }
    setDetailModalType(modalType)
    setShowDetailModal(true)
  }
  // Handler para agregar
  const handleAddSubmit = async (formData) => {
    setIsSubmitting(true)
    try {
      if (onAdd) {
        await onAdd(formData)
      }
      setShowAddModal(false)
    } catch (error) {
      console.error('❌ Error en handleAddSubmit:', error)
    } finally {
      setIsSubmitting(false)
    }
  }
  // Handler para editar
  const handleEditSubmit = async (formData) => {
    setIsSubmitting(true)
    try {
      if (onEdit && selectedItem) {
        await onEdit(selectedItem._id, formData)
      }
      setShowEditModal(false)
    } catch (error) {
      console.error('❌ Error en handleEditSubmit:', error)
    } finally {
      setIsSubmitting(false)
    }
  }
  // Handler para confirmar eliminación
  const handleDeleteConfirm = async () => {
    setIsSubmitting(true)
    try {
      if (onDelete && selectedItem) {
        await onDelete(selectedItem._id)
      }
      setShowDeleteModal(false)
    } catch (error) {
      console.error('Error al eliminar:', error)
    } finally {
      setIsSubmitting(false)
    }
  }
  // Handler para exportar
  const handleExport = (format) => {
    if (onExport) {
      onExport(format, filteredAndSortedData, config.title)
    } else {
      console.log(`Exportando ${filteredAndSortedData.length} elementos en formato ${format}`)
    }
  }
  // Handler para refrescar la tabla
  const handleRefresh = () => {
    setSearchValue('')
    setSortBy(null)
    setSortOrder('asc')
    setCurrentPage(1)
    window.location.reload()
  }
  return (
    <div className={`font-[Quicksand] ${className}`}>
      {/* Header con título y acciones */}
      <TableHeader 
        title={config.title} 
        subtitle={`${filteredAndSortedData.length} ${filteredAndSortedData.length === 1 ? 'elemento' : 'elementos'}`} 
        searchValue={searchValue} 
        onSearch={handleSearch} 
        actions={config.actions} 
        onAdd={config.actions?.canAdd ? handleAdd : undefined} 
        onExport={config.actions?.canExport ? handleExport : undefined} 
        onRefresh={handleRefresh} 
        addButtonText={`Añadir ${config.title?.slice(0) || 'Elemento'}`} 
        addButtonIcon="add" 
        isLoading={isLoading}
      />
      {/* Tabla principal */}
      <DataTable 
        data={paginatedData} 
        columns={config.columns} 
        isLoading={isLoading} 
        pagination={{ page: currentPage, pageSize: pageSize, total: filteredAndSortedData.length }} 
        onPageChange={handlePageChange} 
        onPageSizeChange={handlePageSizeChange} 
        onSort={handleSort} 
        onEdit={config.actions?.canEdit ? handleEdit : undefined} 
        onDelete={config.actions?.canDelete ? handleDelete : undefined} 
        onView={handleView} 
        sortBy={sortBy} 
        sortOrder={sortOrder}
      />
      {/* Modal de Agregar */}
      {showAddModal && (
        <FormModal 
          isOpen={showAddModal} 
          onClose={() => setShowAddModal(false)} 
          onSubmit={handleAddSubmit} 
          title={`Agregar ${config.title?.slice(0) || 'Elemento'}`} 
          fields={processedFormFields} 
          isLoading={isSubmitting}
        />
      )}
      {/* Modal de Editar */}
      {showEditModal && selectedItem && (
        <FormModal 
          isOpen={showEditModal} 
          onClose={() => setShowEditModal(false)} 
          onSubmit={handleEditSubmit} 
          title={`Editar ${config.title?.slice(0) || 'Elemento'}`} 
          fields={processedFormFields} 
          initialData={selectedItem} 
          isLoading={isSubmitting}
        />
      )}
      {/* Modal de Confirmar Eliminación */}
      {showDeleteModal && selectedItem && (
        <ConfirmModal 
          isOpen={showDeleteModal} 
          onClose={() => setShowDeleteModal(false)} 
          onConfirm={handleDeleteConfirm} 
          title="Confirmar eliminación" 
          message={`¿Estás seguro de que quieres eliminar este elemento? Esta acción no se puede deshacer.`} 
          confirmText="Eliminar" 
          cancelText="Cancelar" 
          type="danger" 
          isLoading={isSubmitting}
        />
      )}
      {/* Modal de Detalles */}
      {showDetailModal && selectedItem && (
        <DetailModal 
          isOpen={showDetailModal} 
          onClose={() => setShowDetailModal(false)} 
          data={selectedItem} 
          title={`Detalles de ${config.title?.slice(0) || 'Elemento'}`} 
          type={detailModalType}
        />
      )}
    </div>
  )
}
// Exporta el componente para su uso en otras partes
export default TableContainer