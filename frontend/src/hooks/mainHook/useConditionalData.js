import { useAuth } from '../useAuth.js'

// VERSIÓN DE EMERGENCIA - MÍNIMA Y SEGURA
export const useConditionalData = () => {
  const { user } = useAuth()
  
  // Función simple de permisos
  const canAccess = (section) => {
    if (!user?.userType) return false
    
    const permissions = {
      'admin': [ 'dashboard', 'search', 'products', 'customdesigns', 'designelements', 'rawmaterials', 'employees', 'categories','subcategories', 'collections', 'customers', 'orders', 'reviews', 'refunds', 'suppliers', 'settings' ],
      'employee': [ 'dashboard', 'search', 'products', 'customdesigns', 'designelements', 'rawmaterials', 'categories','subcategories', 'collections', 'reviews', 'suppliers', 'settings' ],
    }
    return permissions[user.userType]?.includes(section) || false
  }
  
  // Datos vacíos seguros
  const emptyData = {
    data: [],
    loading: false,
    fetch: () => Promise.resolve(),
    createHandlers: () => ({
      data: [],
      loading: false,
      onAdd: () => Promise.resolve(),
      onEdit: () => Promise.resolve(),
      onDelete: () => Promise.resolve()
    })
  }
  
  // TEMPORALMENTE - RETORNAR SOLO DATOS VACÍOS
  return {
    suppliersData: emptyData,
    categoriesData: emptyData,
    subcategoriesData: emptyData,
    collectionsData: emptyData,
    productsData: emptyData,
    rawMaterialsData: emptyData,
    reviewsData: emptyData,
    customDesignsData: emptyData,
    customersData: emptyData,
    employeesData: emptyData,
    ordersData: emptyData,
    refundsData: emptyData,
    designElementsData: emptyData,
    canAccess
  }
}