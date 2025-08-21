import { useState, useEffect, useMemo } from 'react'
import { Search, Filter, X, Package,Users, ShoppingCart, Star, Grid3X3, Grid2X2, Shapes, Truck, Vault, WandSparkles, Link, BanknoteArrowDown, ArrowLeftRight } from 'lucide-react'
import { useConditionalData } from '../../hooks/mainHook/useConditionalData'
import { useAuth } from '../../hooks/useAuth.js'

const GlobalSearch = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [results, setResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  // Obtener datos del usuario para permisos
  const { user } = useAuth()
  // Obtener todos los datos
  const {
    productsData,
    customersData,
    employeesData,
    ordersData,
    reviewsData,
    suppliersData,
    categoriesData,
    subcategoriesData,
    collectionsData,
    rawMaterialsData,
    customDesignsData,
    designElementsData,
    refundsData,
    transactionsData,
  } = useConditionalData()
  // Funcion de permisos estatica
  const hasPermission = useMemo(() => {
    if (!user?.userType) return () => false
    
    const permissions = {
      'admin': [ 'dashboard', 'search', 'products', 'customdesigns', 'designelements', 'rawmaterials', 'employees', 'categories','subcategories', 'collections', 'customers', 'orders', 'reviews', 'refunds', 'transactions', 'suppliers', 'settings' ],
      'colaborador': [ 'dashboard', 'search', 'products', 'customdesigns', 'designelements', 'rawmaterials', 'categories','subcategories', 'collections', 'reviews', 'suppliers', 'settings' ],
    }
    const userPermissions = permissions[user.userType] || []
    
    return (section) => userPermissions.includes(section)
  }, [user?.userType])
  // Categorias de búsqueda disponibles según permisos
  const searchCategories = useMemo(() => {
    const categories = [
      { id: 'all', label: 'Todo', icon: Search, count: 0 }
    ]
    if (hasPermission('products')) {
      categories.push({
        id: 'products',
        label: 'Productos',
        icon: Package,
        count: productsData.products?.length || 0
      })
    }
    if (hasPermission('customers')) {
      categories.push({
        id: 'customers',
        label: 'Clientes',
        icon: Users,
        count: customersData.customers?.length || 0
      })
    }
    if (hasPermission('employees')) {
      categories.push({
        id: 'employees',
        label: 'Empleados',
        icon: Users,
        count: employeesData.employees?.length || 0
      })
    }
    if (hasPermission('orders')) {
      categories.push({
        id: 'orders',
        label: 'Pedidos',
        icon: ShoppingCart,
        count: ordersData.orders?.length || 0
      })
    }
    if (hasPermission('reviews')) {
      categories.push({
        id: 'reviews',
        label: 'Reseñas',
        icon: Star,
        count: reviewsData.reviews?.length || 0
      })
    }
    if (hasPermission('suppliers')) {
      categories.push({
        id: 'suppliers',
        label: 'Proveedores',
        icon: Truck,
        count: suppliersData.suppliers?.length || 0
      })
    }
    if (hasPermission('categories')) {
      categories.push({
        id: 'categories',
        label: 'Categorías',
        icon: Grid2X2,
        count: categoriesData.categories?.length || 0
      })
    }
    if (hasPermission('subcategories')) {
      categories.push({ 
        id: 'subcategories',
        label: 'Subcategorías',
        icon: Grid3X3,
        count: subcategoriesData.subcategories?.length || 0
      })
    }
    if (hasPermission('collections')) {
      categories.push({ 
        id: 'collections',
        label: 'Colecciones',
        icon: Shapes,
        count: collectionsData.collections?.length || 0
      })
    }
    if (hasPermission('rawmaterials')) {
      categories.push({ 
        id: 'rawmaterials',
        label: 'Materias Primas',
        icon: Vault,
        count: rawMaterialsData.rawmaterials?.length || 0
      })
    }
    if (hasPermission('customdesigns')) {
      categories.push({ 
        id: 'customdesigns',
        label: 'Diseños Únicos',
        icon: WandSparkles,
        count: customDesignsData.customdesigns?.length || 0
      })
    }
    if (hasPermission('designelements')) {
      categories.push({ 
        id: 'designelements',
        label: 'Elementos de diseño',
        icon: Link,
        count: designElementsData.designelements?.length || 0
      })
    }
    if (hasPermission('refunds')) {
      categories.push({ 
        id: 'refunds',
        label: 'Devoluciones',
        icon: BanknoteArrowDown,
        count: refundsData.refunds?.length || 0
      })
    }
    if (hasPermission('transactions')) {
      categories.push({ 
        id: 'transactions',
        label: 'Transacciones',
        icon: ArrowLeftRight,
        count: transactionsData.transactions?.length || 0
      })
    }
    // Calcular total para "Todo"
    const totalCount = categories.slice(1).reduce((sum, cat) => sum + cat.count, 0)
    categories[0].count = totalCount

    return categories
  }, [
    hasPermission,
    productsData.products?.length,
    customersData.customers?.length,
    employeesData.employees?.length,
    ordersData.orders?.length,
    reviewsData.reviews?.length,
    suppliersData.suppliers?.length,
    categoriesData.categories?.length,
    subcategoriesData.subcategories?.length,
    collectionsData.collections?.length,
    rawMaterialsData.rawmaterials?.length,
    customDesignsData.customdesigns?.length,
    designElementsData.designelements?.length,
    refundsData.refunds?.length,
    transactionsData.transactions?.length,
  ])
  // useEffect sin dependencias problematicas
  useEffect(() => {
    // Si no hay término de busqueda, limpiar resultados
    if (!searchTerm.trim()) {
      setResults([])
      setIsSearching(false)
      return
    }
    setIsSearching(true)
    const debounceTimer = setTimeout(() => {
      console.log('🔍 Ejecutando búsqueda para:', searchTerm, 'en categoría:', selectedCategory)
      const searchLower = searchTerm.toLowerCase()
      const foundResults = []
      // Funcion helper para agregar resultado
      const addResult = (item, type, typeName, primaryField, secondaryField = null) => {
        const primary = item[primaryField]?.toString().toLowerCase() || ''
        const secondary = secondaryField ? item[secondaryField]?.toString().toLowerCase() || '' : ''
        
        if (primary.includes(searchLower) || secondary.includes(searchLower)) {
          foundResults.push({
            id: item._id,
            type,
            typeName,
            title: item[primaryField] || 'Sin título',
            subtitle: secondaryField ? item[secondaryField] : null,
            description: item.description || item.comment || null,
            data: item
          })
        }
      }
      // Buscar en productos
      if ((selectedCategory === 'all' || selectedCategory === 'products') && hasPermission('products')) {
        productsData.products?.forEach(product => {
          addResult(product, 'products', 'Producto', 'name', 'description')
        })
      }
      // Buscar en clientes
      if ((selectedCategory === 'all' || selectedCategory === 'customers') && hasPermission('customers')) {
        customersData.customers?.forEach(customer => {
          const fullName = `${customer.name} ${customer.lastName}`.toLowerCase()
          const email = customer.email?.toLowerCase() || ''
          
          if (fullName.includes(searchLower) || email.includes(searchLower)) {
            foundResults.push({
              id: customer._id,
              type: 'customers',
              typeName: 'Cliente',
              title: `${customer.name} ${customer.lastName}`,
              subtitle: customer.email,
              description: customer.username,
              data: customer
            })
          }
        })
      }
      // Buscar en empleados
      if ((selectedCategory === 'all' || selectedCategory === 'employees') && hasPermission('employees')) {
        employeesData.employees?.forEach(employee => {
          const fullName = `${employee.name} ${employee.lastName}`.toLowerCase()
          const email = employee.email?.toLowerCase() || ''
          
          if (fullName.includes(searchLower) || email.includes(searchLower)) {
            foundResults.push({
              id: employee._id,
              type: 'employees',
              typeName: 'Empleado',
              title: `${employee.name} ${employee.lastName}`,
              subtitle: employee.email,
              description: employee.userType,
              data: employee
            })
          }
        })
      }
      // Buscar en pedidos
      if ((selectedCategory === 'all' || selectedCategory === 'orders') && hasPermission('orders')) {
        ordersData.orders?.forEach(order => {
          const customerName = order.customer?.name ? 
            `${order.customer.name} ${order.customer.lastName}`.toLowerCase() : ''
          const orderId = order._id?.toLowerCase() || ''
          
          if (customerName.includes(searchLower) || orderId.includes(searchLower) || order.status?.toLowerCase().includes(searchLower)) {
            foundResults.push({
              id: order._id,
              type: 'orders',
              typeName: 'Pedido',
              title: `Pedido #${order._id.slice(-6)}`,
              subtitle: customerName ? `Cliente: ${order.customer.name} ${order.customer.lastName}` : 'Cliente no especificado',
              description: `Total: $${order.total} - Estado: ${order.status}`,
              data: order
            })
          }
        })
      }
      // Buscar en reseñas
      if ((selectedCategory === 'all' || selectedCategory === 'reviews') && hasPermission('reviews')) {
        reviewsData.reviews?.forEach(review => {
          const comment = review.comment?.toLowerCase() || ''
          const customerName = review.customer?.name ? 
            `${review.customer.name} ${review.customer.lastName}`.toLowerCase() : ''
          
          if (comment.includes(searchLower) || customerName.includes(searchLower)) {
            foundResults.push({
              id: review._id,
              type: 'reviews',
              typeName: 'Reseña',
              title: `Reseña ${review.rating}/5 estrellas`,
              subtitle: review ? `Por: ${review.customer.name} ${review.customer.lastName}` : 'Usuario anónimo',
              description: review.comment,
              data: review
            })
          }
        })
      }
      // Buscar en proveedores
      if ((selectedCategory === 'all' || selectedCategory === 'suppliers') && hasPermission('suppliers')) {
        suppliersData.suppliers?.forEach(supplier => {
          addResult(supplier, 'suppliers', 'Proveedor', 'name', 'email')
        })
      }
      // Buscar en categorias
      if ((selectedCategory === 'all' || selectedCategory === 'categories') && hasPermission('categories')) {
        categoriesData.categories?.forEach(category => {
          addResult(category, 'categories', 'Categoría', 'name', 'description')
        })
      }
      // Buscar en subcategorias
      if ((selectedCategory === 'all' || selectedCategory === 'subcategories') && hasPermission('subcategories')) {
        subcategoriesData.subcategories?.forEach(subcategory => {
          addResult(subcategory, 'subcategories', 'Subcategoría', 'name', 'description')
        })
      }
      // Buscar en colecciones
      if ((selectedCategory === 'all' || selectedCategory === 'collections') && hasPermission('collections')) {
        collectionsData.collections?.forEach(collection => {
          addResult(collection, 'collections', 'Colección', 'name', 'description')
        })
      }
      // Buscar en materias primas
      if ((selectedCategory === 'all' || selectedCategory === 'rawmaterials') && hasPermission('rawmaterials')) {
        rawMaterialsData.rawmaterials?.forEach(subcategory => {
          addResult(subcategory, 'rawmaterials', 'Materia prima', 'name', 'description')
        })
      }
      // Buscar en diseños únicos
      if ((selectedCategory === 'all' || selectedCategory === 'customdesigns') && hasPermission('customdesigns')) {
        customDesignsData.customdesigns?.forEach(collection => {
          addResult(collection, 'customdesigns', 'Diseños Únicos', 'codeRequest')
        })
      }
      // Buscar en elementos de diseño
      if ((selectedCategory === 'all' || selectedCategory === 'designelements') && hasPermission('designelements')) {
        designElementsData.designelements?.forEach(collection => {
          addResult(collection, 'designelements', 'Elementos de diseño', 'name', 'type')
        })
      }
      // Buscar en devoluciones
      if ((selectedCategory === 'all' || selectedCategory === 'refunds') && hasPermission('refunds')) {
        refundsData.refunds?.forEach(refund => {
          const refundCode = refund.refundCode?.toLowerCase() || ''
          const reason = refund.reason?.toLowerCase() || ''
          const status = refund.status?.toLowerCase() || ''
          const refundId = refund._id?.toLowerCase() || ''
          
          if (refundCode.includes(searchLower) || reason.includes(searchLower) || status.includes(searchLower) || refundId.includes(searchLower)) {
            foundResults.push({
              id: refund._id,
              type: 'refunds',
              typeName: 'Reembolso',
              title: `Reembolso #${refund.refundCode}`,
              subtitle: `Estado: ${refund.status}`,
              description: `Motivo: ${refund.reason} - Pedido: ${refund.order}`,
              data: refund
            })
          }
        })
      }
      // Buscar en transacciones
      if ((selectedCategory === 'all' || selectedCategory === 'transactions') && hasPermission('transactions')) {
        transactionsData.transactions?.forEach(transaction => {
          const transactionCode = transaction.transactionCode?.toLowerCase() || ''
          const amount = transaction.amount?.toLowerCase() || ''
          const type = transaction.type?.toLowerCase() || ''
          const transactionId = transaction._id?.toLowerCase() || ''
          
          if (transactionCode.includes(searchLower) || amount.includes(searchLower) || type.includes(searchLower) || transactionId.includes(searchLower)) {
            foundResults.push({
              id: transaction._id,
              type: 'transactions',
              typeName: 'Transacción',
              title: `Transacción #${transaction.transactionCode}`,
              subtitle: `Monto: ${transaction.amount}`,
              description: `Tipo: ${transaction.type}`,
              data: transaction
            })
          }
        })
      }
      console.log('🎯 Resultados encontrados:', foundResults.length)
      setResults(foundResults)
      setIsSearching(false)
    }, 300)
    return () => clearTimeout(debounceTimer)
  }, [
    searchTerm, 
    selectedCategory, 
    // CORREGIDO: Solo las dependencias de datos estables, NO funciones que cambien
    JSON.stringify(productsData.products), 
    JSON.stringify(customersData.customers), 
    JSON.stringify(employeesData.employees), 
    JSON.stringify(ordersData.orders), 
    JSON.stringify(reviewsData.reviews), 
    JSON.stringify(suppliersData.suppliers),
    JSON.stringify(categoriesData.categories),
    JSON.stringify(subcategoriesData.subcategories),
    JSON.stringify(collectionsData.collections),
    JSON.stringify(rawMaterialsData.rawmaterials),
    JSON.stringify(customDesignsData.customdesigns),
    JSON.stringify(designElementsData.designelements),
    JSON.stringify(refundsData.refunds),
    JSON.stringify(transactionsData.transactions),
    hasPermission // Esta funcion ahora es estable
  ])
  const clearSearch = () => {
    setSearchTerm('')
    setResults([])
    setSelectedCategory('all')
  }
  const ResultItem = ({ result, onSelect }) => {
    const IconComponent = searchCategories.find(cat => cat.id === result.type)?.icon || Search
    return (
      <div onClick={() => onSelect?.(result)} className="p-4 border border-gray-200 rounded-lg hover:border-[#A73249] hover:shadow-md transition-all cursor-pointer bg-white">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-[#A73249]/10 rounded-lg">
            <IconComponent className="w-5 h-5 text-[#A73249]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-medium text-[#3D1609] truncate">{result.title}</h3>
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                {result.typeName}
              </span>
            </div>
            {result.subtitle && (
              <p className="text-sm text-gray-600 truncate">{result.subtitle}</p>
            )}
            {result.description && (
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {result.description.length > 100 
                  ? `${result.description.substring(0, 100)}...` 
                  : result.description
                }
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="p-6 bg-white min-h-screen font-[Quicksand]">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#3D1609] mb-2">🔍 Búsqueda Global</h1>
          <p className="text-gray-600">Busca en todos los datos del sistema de forma rápida y eficiente</p>
        </div>
        {/* Barra de busqueda */}
        <div className="relative mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar productos, clientes, pedidos, proveedores, categorías..." className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A73249] focus:border-transparent text-lg"/>
              {searchTerm && (
                <button onClick={clearSearch} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className={`px-4 py-3 border rounded-lg flex items-center space-x-2 transition-colors ${ showFilters  ? 'border-[#3D1609] bg-[#A73249]/10 text-[#A73249]' : 'border-gray-300 hover:border-gray-400' }`}>
              <Filter className="w-5 h-5"/>
              <span>Filtros</span>
            </button>
          </div>
        </div>
        {/* Filtros por categoria */}
        {showFilters && (
          <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="font-medium text-[#3D1609] mb-3">Filtrar por categoría:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {searchCategories.map(category => {
                const IconComponent = category.icon
                return (
                  <button key={category.id} onClick={() => setSelectedCategory(category.id)} className={`p-3 rounded-lg border text-center transition-all ${ selectedCategory === category.id ? 'border-[#3D1609] bg-[#3D1609]/10 text-[#3D1609]' : 'border-gray-300 hover:border-gray-400 text-gray-600' }`}>
                    <IconComponent className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-sm font-medium">{category.label}</div>
                    <div className="text-xs text-gray-500">({category.count})</div>
                  </button>
                )
              })}
            </div>
          </div>
        )}
        {/* Estadisticas de búsqueda */}
        {searchTerm && (
          <div className="mb-6 flex items-center justify-between text-sm text-gray-600">
            <span>
              {isSearching 
                ? 'Buscando...' 
                : `${results.length} resultado${results.length !== 1 ? 's' : ''} encontrado${results.length !== 1 ? 's' : ''}`
              }
              {searchTerm && ` para "${searchTerm}"`}
            </span>
            {selectedCategory !== 'all' && (
              <span className="text-[#3D1609]">
                En: {searchCategories.find(cat => cat.id === selectedCategory)?.label}
              </span>
            )}
          </div>
        )}
        {/* Resultados */}
        {isSearching ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3D1609] mx-auto mb-4"></div>
            <p className="text-gray-600">Buscando...</p>
          </div>
        ) : searchTerm && results.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No se encontraron resultados</h3>
            <p className="text-gray-500">
              Intenta con otros términos de búsqueda o cambia los filtros
            </p>
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-4">
            {results.map((result, index) => (
              <ResultItem
                key={`${result.type}-${result.id}-${index}`}
                result={result}
                onSelect={(result) => {
                  console.log('Seleccionado:', result)
                  // Aquí puedes implementar navegación o mostrar detalles
                  
                }}
              />
            ))}
          </div>
        ) : !searchTerm ? (
          <div className="text-center py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {searchCategories.slice(1).map(category => {
                const IconComponent = category.icon
                return (
                  <div key={category.id} className="p-6 border border-gray-200 rounded-lg text-center hover:border-[#A73249] transition-colors">
                    <IconComponent className="w-8 h-8 text-[#A73249] mx-auto mb-3" />
                    <h3 className="font-medium text-[#7A6E6E] mb-1">{category.label}</h3>
                    <p className="text-sm text-gray-500">{category.count} registros</p>
                  </div>
                )
              })}
            </div>
            <div className="text-gray-500">
              <h3 className="text-lg font-medium mb-2">¿Qué estás buscando?</h3>
              <p>Usa la barra de búsqueda para encontrar productos, clientes, pedidos y más...</p>
            </div>
          </div>
        ) : null}
        {/* Tips de busqueda */}
        {!searchTerm && (
          <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-medium text-blue-800 mb-3">💡 Tips de búsqueda:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Busca por nombre de producto, cliente o empleado</li>
              <li>• Usa palabras clave como "pendiente", "completado" para estados</li>
              <li>• Filtra por categoría para resultados más específicos</li>
              <li>• También puedes buscar proveedores y categorías de productos</li>
              <li>• Los resultados aparecen mientras escribes</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
export default GlobalSearch