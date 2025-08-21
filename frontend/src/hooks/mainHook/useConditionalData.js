import { useAuth } from '../useAuth.js'
import useDataCategories from '../CategoriesHooks/useDataCategories'
import useDataSubcategories from '../subcategoriesHooks/useDataSubcategories'
import useDataCollections from '../collectionsHooks/useDataCollections'
import useDataSuppliers from '../SuppliersHooks/useDataSuppliers'
import useDataProducts from '../productsHooks/useDataProducts'
import useDataRawMaterials from '../rawMaterialsHooks/useDataRawMaterials'
import useDataReviews from '../ReviewsHooks/useDataReviews'
import useDataCustomDesigns from '../customDesignsHooks/useDataCustomDesigns'
import useDataCustomers from '../customersHooks/useDataCustomers'
import useDataEmployees from '../employeesHooks/useDataEmployees'
import useDataOrders from '../ordersHooks/useDataOrders'
import useDataRefunds from '../refundsHooks/useDataRefunds'
import useDataTransactions from '../transactionsHooks/useDataTransactions'
import useDataDesignElements from '../designElementsHooks/useDataDesignElements'

// Hook principal para obtener datos condicionales según permisos del usuario
export const useConditionalData = () => {
  const { user } = useAuth()
  // TODOS los hooks se ejecutan SIEMPRE (cumple reglas de React)
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
  const allTransactionsData = useDataTransactions()
  const allDesignElementsData = useDataDesignElements()
  // Función para verificar si el usuario tiene acceso a una sección
  const canAccess = (section) => {
    if (!user?.userType) return false
    
    // Permisos por tipo de usuario
    const permissions = {
      'admin': [ 'dashboard', 'search', 'products', 'customdesigns', 'designelements', 'rawmaterials', 'employees', 'categories','subcategories', 'collections', 'customers', 'orders', 'reviews', 'refunds', 'transactions', 'suppliers', 'settings' ],
      'colaborador': [ 'dashboard', 'search', 'products', 'customdesigns', 'designelements', 'rawmaterials', 'categories','subcategories', 'collections', 'reviews', 'suppliers', 'settings' ],
    }
    return permissions[user.userType]?.includes(section) || false
  }
  // Objeto vacío para cuando no hay acceso
  const emptyData = { 
    data: [], 
    loading: false, 
    fetch: () => {},
    // Propiedades específicas según el tipo de data
    suppliers: [],
    categories: [],
    subcategories: [],
    collections: [],
    products: [],
    rawmaterials: [],
    reviews: [],
    customdesigns: [],
    designelements: [],
    customers: [],
    employees: [],
    orders: [],
    refunds: [],
    transactions: []
  }
  // Retorna los datos según permisos
  return {
    suppliersData: canAccess('suppliers') ? allSuppliersData : emptyData,
    categoriesData: canAccess('categories') ? allCategoriesData : emptyData,
    subcategoriesData: canAccess('subcategories') ? allSubcategoriesData : emptyData,
    collectionsData: canAccess('collections') ? allCollectionsData : emptyData,
    productsData: canAccess('products') ? allProductsData : emptyData,
    rawMaterialsData: canAccess('rawmaterials') ? allRawMaterialsData : emptyData,
    reviewsData: canAccess('reviews') ? allReviewsData : emptyData,
    customDesignsData: canAccess('customdesigns') ? allCustomDesignsData : emptyData,
    customersData: canAccess('customers') ? allCustomersData: emptyData,
    employeesData: canAccess('employees') ? allEmployeesData: emptyData,
    ordersData: canAccess('orders') ? allOrdersData: emptyData,
    refundsData: canAccess('refunds') ? allRefundsData: emptyData,
    transactionsData: canAccess('transactions') ? allTransactionsData: emptyData,
    designElementsData: canAccess('designelements') ? allDesignElementsData: emptyData,
    canAccess // expone la función para uso
  }
}