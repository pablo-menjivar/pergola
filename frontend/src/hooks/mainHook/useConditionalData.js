import { useAuth } from '../useAuth.js'
import useDataCategories from '../categoriesHooks/useDataCategories'
import useDataSubcategories from '../subcategoriesHooks/useDataSubcategories'
import useDataCollections from '../collectionsHooks/useDataCollections'
import useDataSuppliers from '../suppliersHooks/useDataSuppliers'
import useDataProducts from '../productsHooks/useDataProducts'
import useDataRawMaterials from '../rawMaterialsHooks/useDataRawMaterials'
import useDataReviews from '../reviewsHooks/useDataReviews'
import useDataCustomDesigns from '../customDesignsHooks/useDataCustomDesigns'
import useDataCustomers from '../customersHooks/useDataCustomers'
import useDataEmployees from '../employeesHooks/useDataEmployees'
import useDataOrders from '../ordersHooks/useDataOrders'
import useDataRefunds from '../refundsHooks/useDataRefunds'
import useDataDesignElements from '../designElementsHooks/useDataDesignElements'

// Hook principal para obtener datos condicionales según permisos del usuario
export const useConditionalData = () => {
  const { user } = useAuth()
  
  // ✅ TODOS los hooks se ejecutan SIEMPRE (cumple reglas de React)
  // No ejecutamos ningún hook condicionalmente
  const allSuppliersData = useDataSuppliers()
  const allCategoriesData = useDataCategories()
  const allSubcategoriesData = useDataSubcategories()
  const allCollectionsData = useDataCollections()
  const allProductsData = useDataProducts()
  const allRawMaterialsData = useDataRawMaterials()
  const allReviewsData = useDataReviews()
  const allCustomDesignsData = useDataCustomDesigns()
  const allCustomersData = useDataCustomers()
  const allEmployeesData = useDataEmployees()
  const allOrdersData = useDataOrders()
  const allRefundsData = useDataRefunds()
  const allDesignElementsData = useDataDesignElements()
  
  // Función para verificar si el usuario tiene acceso a una sección
  const canAccess = (section) => {
    if (!user?.userType) return false
    
    // Permisos por tipo de usuario
    const permissions = {
      'admin': [ 
        'dashboard', 'search', 'products', 'customdesigns', 'designelements', 
        'rawmaterials', 'employees', 'categories','subcategories', 'collections', 
        'customers', 'orders', 'reviews', 'refunds', 'suppliers', 'settings' 
      ],
      'employee': [ 
        'dashboard', 'search', 'products', 'customdesigns', 'designelements', 
        'rawmaterials', 'categories','subcategories', 'collections', 'reviews', 
        'suppliers', 'settings' 
      ],
    }
    return permissions[user.userType]?.includes(section) || false
  }
  
  // ✅ Objeto seguro para cuando no hay acceso - SIN FUNCIONES REACTIVAS
  const createEmptyData = () => ({
    data: [], 
    loading: false, 
    fetch: async () => {
      console.log('Sin permisos para esta sección')
      return Promise.resolve()
    },
    createHandlers: () => ({
      data: [],
      loading: false,
      onAdd: async () => Promise.resolve(),
      onEdit: async () => Promise.resolve(),
      onDelete: async () => Promise.resolve()
    }),
    // Propiedades específicas según el tipo de data
    suppliers: [],
    categories: [],
    subcategories: [],
    collections: [],
    products: [],
    rawMaterials: [],
    reviews: [],
    customDesigns: [],
    designElements: [],
    customers: [],
    employees: [],
    orders: [],
    refunds: []
  })
  
  // ✅ Wrapper seguro para evitar problemas con hooks
  const safeWrapData = (hasAccess, data) => {
    if (!hasAccess) {
      return createEmptyData()
    }
    
    // Asegurar que data siempre tenga las propiedades esperadas
    return {
      ...data,
      fetch: data.fetch || (async () => {
        console.warn('Función fetch no disponible para este hook')
        return Promise.resolve()
      }),
      createHandlers: data.createHandlers || (() => ({
        data: data.data || [],
        loading: data.loading || false,
        onAdd: async () => Promise.resolve(),
        onEdit: async () => Promise.resolve(),
        onDelete: async () => Promise.resolve()
      }))
    }
  }
  
  // ✅ Retorna los datos según permisos - SIN CONDICIONALES EN HOOKS
  return {
    suppliersData: safeWrapData(canAccess('suppliers'), allSuppliersData),
    categoriesData: safeWrapData(canAccess('categories'), allCategoriesData),
    subcategoriesData: safeWrapData(canAccess('subcategories'), allSubcategoriesData),
    collectionsData: safeWrapData(canAccess('collections'), allCollectionsData),
    productsData: safeWrapData(canAccess('products'), allProductsData),
    rawMaterialsData: safeWrapData(canAccess('rawmaterials'), allRawMaterialsData),
    reviewsData: safeWrapData(canAccess('reviews'), allReviewsData),
    customDesignsData: safeWrapData(canAccess('customdesigns'), allCustomDesignsData),
    customersData: safeWrapData(canAccess('customers'), allCustomersData),
    employeesData: safeWrapData(canAccess('employees'), allEmployeesData),
    ordersData: safeWrapData(canAccess('orders'), allOrdersData),
    refundsData: safeWrapData(canAccess('refunds'), allRefundsData),
    designElementsData: safeWrapData(canAccess('designelements'), allDesignElementsData),
    canAccess // expone la función para uso externo
  }
}