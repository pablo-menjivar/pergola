import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { toast } from 'react-hot-toast'
import Sidebar from '../components/Dashboard/Sidebar'
import Header from '../components/Dashboard/Header'
import Dashboard from '../components/Dashboard/Dashboard'
import TableContainer from '../components/Table/TableContainer'
import SettingsPage from '../components/Settings/SettingsPage'
import { handleExport } from '../utils/exportUtils.js'
import GlobalSearch from '../components/Search/GlobalSearch'
import { useConditionalData } from '../hooks/mainHook/useConditionalData.js'
// Importar configuraciones de tablas
import { suppliersConfig, categoriesConfig, subcategoriesConfig, collectionsConfig, productsConfig, rawMaterialsConfig, reviewsConfig, customDesignsConfig, ordersConfig, refundsConfig, designElementsConfig, employeesConfig, customersConfig} from '../data/TableConfigs.js'

const MainPage = () => {
  console.log("🔍 MainPage iniciando...")
  const { user, logout, API } = useAuth()
  console.log("🔍 Auth cargado:", user?.userType)
  const [currentView, setCurrentView] = useState('dashboard')
  // Estados para controlar las actualizaciones por sección
  const [updatingStates, setUpdatingStates] = useState({
    suppliers: false,
    categories: false,
    subcategories: false,
    collections: false,
    products: false,
    rawmaterials: false,
    reviews: false,
    customdesigns: false,
    designelements: false,
    customers: false,
    employees: false,
    orders: false,
    refunds: false
  })
  // Usar el hook condicional - TODOS los hooks se ejecutan siempre
  const {
    suppliersData,
    categoriesData,
    subcategoriesData,
    employeesData,
    customersData,
    collectionsData,
    productsData,
    rawMaterialsData,
    reviewsData,
    customDesignsData,
    ordersData,
    refundsData,
    designElementsData
  } = useConditionalData()
  
  const handleLogout = async () => {
    await logout()
  }
  // Función para manejar actualizaciones por sección
  const handleSectionUpdate = async (sectionName, dataHook) => {
    const sectionKey = sectionName.toLowerCase()
    
    setUpdatingStates(prev => ({
      ...prev,
      [sectionKey]: true
    }))

    try {
      // Llamar a la función de fetch del hook correspondiente
      if (dataHook && typeof dataHook.fetch === 'function') {
        await dataHook.fetch()
        toast.success(`${sectionName} actualizado correctamente`)
      } else {
        console.warn(`No se encontró función fetch para ${sectionName}`)
        toast.error(`Error al actualizar ${sectionName}`)
      }
    } catch (error) {
      console.error(`Error actualizando ${sectionName}:`, error)
      toast.error(`Error al actualizar ${sectionName}`)
    } finally {
      setUpdatingStates(prev => ({
        ...prev,
        [sectionKey]: false
      }))
    }
  }
  // Funciones específicas de actualización para cada sección
  const updateHandlers = {
    suppliers: () => handleSectionUpdate('Proveedores', suppliersData),
    categories: () => handleSectionUpdate('Categorías', categoriesData),
    subcategories: () => handleSectionUpdate('Subcategorías', subcategoriesData),
    collections: () => handleSectionUpdate('Colecciones', collectionsData),
    products: () => handleSectionUpdate('Productos', productsData),
    rawmaterials: () => handleSectionUpdate('Materias Primas', rawMaterialsData),
    reviews: () => handleSectionUpdate('Reseñas', reviewsData),
    customdesigns: () => handleSectionUpdate('Diseños Únicos', customDesignsData),
    designelements: () => handleSectionUpdate('Elementos de Diseño', designElementsData),
    customers: () => handleSectionUpdate('Clientes', customersData),
    employees: () => handleSectionUpdate('Empleados', employeesData),
    orders: () => handleSectionUpdate('Pedidos', ordersData),
    refunds: () => handleSectionUpdate('Reembolsos', refundsData)
  }
  // Funcion handleExport
  const handleDataExport = (format, data, sectionName) => {
    console.log(`Exportando ${data?.length || 0} elementos de ${sectionName} en formato ${format}`)
    
    if (!data || data.length === 0) {
      toast.error('No hay datos para exportar')
      return
    }
    try {
      const filename = `${sectionName.toLowerCase().replace(/\s+/g, '_')}`
      const title = `Reporte de ${sectionName} - Pérgola`
      
      handleExport(format, data, filename, title)
      toast.success(`Exportación de ${sectionName} iniciada en formato ${format.toUpperCase()}`)
    } catch (error) {
      console.error('Error al exportar:', error)
      toast.error('Error al exportar los datos')
    }
  }
  // Agregar funcion para verificar permisos
  const hasPermission = (view) => {
    if (!user?.userType) return false
    // Verificar si el usuario tiene permiso para la vista actual
    const permissions = {
      'admin': [ 'dashboard', 'search', 'products', 'customdesigns', 'designelements', 'rawmaterials', 'employees', 'categories','subcategories', 'collections', 'customers', 'orders', 'reviews', 'refunds', 'suppliers', 'settings' ],
      'employee': [ 'dashboard', 'search', 'products', 'customdesigns', 'designelements', 'rawmaterials', 'categories','subcategories', 'collections', 'reviews', 'suppliers', 'settings' ],
    }
    const userPermissions = permissions[user.userType] || []
    return userPermissions.includes(view) 
  }
  console.log("🐛 DEBUG MainPage - User:", user);
  console.log("🐛 DEBUG MainPage - Current view:", currentView);
  console.log("🐛 DEBUG MainPage - Has permission:", hasPermission(currentView));
  const renderContent = () => {
    // Verificar permisos antes de renderizar
    if (!hasPermission(currentView)) {
      console.log("❌ No permission for view:", currentView, "User type:", user?.userType);
      return (
        <div className="p-6 bg-white min-h-screen font-[Quicksand] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-extrabold text-red-600 mb-4">Acceso Denegado</h1>
            <p className="text-black">No tienes permisos para acceder a esta sección.</p>
            <p className="text-sm text-black mt-2">Tu rol: {user?.userType}</p>
            <p className="text-sm text-black">Sección: {currentView}</p>
          </div>
        </div>
      );
    }
    switch (currentView) {
      case 'dashboard':
        return <Dashboard/>
      case 'search':
        return <GlobalSearch/>
      case 'employees':
        return (
          <div className="p-6 bg-white min-h-screen">
            <div className="max-w-7xl mx-auto">
              <TableContainer config={employeesConfig} {...employeesData.createHandlers(API)} onExport={handleDataExport} onUpdate={updateHandlers.employees} isUpdating={updatingStates.employees}/>
            </div>
          </div>
        )
      case 'customers':
        return (
          <div className="p-6 bg-white min-h-screen">
            <div className="max-w-7xl mx-auto">
              <TableContainer config={customersConfig} {...customersData.createHandlers(API)} onExport={handleDataExport} onUpdate={updateHandlers.customers} isUpdating={updatingStates.customers}/>
            </div>
          </div>
        )
      case 'products':
        return (
          <div className="p-6 bg-white min-h-screen">
            <div className="max-w-7xl mx-auto">
              <TableContainer config={productsConfig} {...productsData.createHandlers(API)} onExport={handleDataExport} categoriesData={categoriesData} subcategoriesData={subcategoriesData} collectionsData={collectionsData} rawMaterialsData={rawMaterialsData} onUpdate={updateHandlers.products} isUpdating={updatingStates.products}/>
            </div>
          </div>
        )
      case 'rawmaterials':
        return (
          <div className="p-6 bg-white min-h-screen">
            <div className="max-w-7xl mx-auto">
              <TableContainer config={rawMaterialsConfig} {...rawMaterialsData.createHandlers(API)} onExport={handleDataExport} suppliersData={suppliersData} onUpdate={updateHandlers.rawmaterials} isUpdating={updatingStates.rawmaterials}/>
            </div>
          </div>
        )
      case 'collections':
        return (
          <div className="p-6 bg-white min-h-screen">
            <div className="max-w-7xl mx-auto">
              <TableContainer config={collectionsConfig} {...collectionsData.createHandlers(API)} onExport={handleDataExport} onUpdate={updateHandlers.collections} isUpdating={updatingStates.collections}/>
            </div>
          </div>
        )
      case 'categories':
        return (
          <div className="p-6 bg-white min-h-screen">
            <div className="max-w-7xl mx-auto">
              <TableContainer config={categoriesConfig} {...categoriesData.createHandlers(API)} onExport={handleDataExport} onUpdate={updateHandlers.categories} isUpdating={updatingStates.categories}/>
            </div>
          </div>
        )
      case 'subcategories':
        return (
          <div className="p-6 bg-white min-h-screen">
            <div className="max-w-7xl mx-auto">
              <TableContainer config={subcategoriesConfig} {...subcategoriesData.createHandlers(API)} onExport={handleDataExport} onUpdate={updateHandlers.subcategories} isUpdating={updatingStates.subcategories}/>
            </div>
          </div>
        )
      case 'orders':
        return (
          <div className="p-6 bg-white min-h-screen">
            <div className="max-w-7xl mx-auto">
              <TableContainer config={ordersConfig} {...ordersData.createHandlers(API)} onExport={handleDataExport} customersData={{customers: ordersData.customers || []}} productsData={{products: ordersData.products || []}} onUpdate={updateHandlers.orders} isUpdating={updatingStates.orders}/>
            </div>
          </div>
        )
      case 'customdesigns':
        return (
          <div className="p-6 bg-white min-h-screen">
            <div className="max-w-7xl mx-auto">
              <TableContainer config={customDesignsConfig} {...customDesignsData.createHandlers(API)} designElementsData={designElementsData} onExport={handleDataExport} onUpdate={updateHandlers.customdesigns} isUpdating={updatingStates.customdesigns}/>
            </div>
          </div>
        )
      case 'designelements':
        return (
          <div className="p-6 bg-white min-h-screen">
            <div className="max-w-7xl mx-auto">
              <TableContainer config={designElementsConfig} {...designElementsData.createHandlers(API)} onExport={handleDataExport} onUpdate={updateHandlers.designelements} isUpdating={updatingStates.designelements}/>
            </div>
          </div>
        )
      case 'reviews':
        return (
          <div className="p-6 bg-white min-h-screen">
            <div className="max-w-7xl mx-auto">
              <TableContainer config={reviewsConfig} {...reviewsData.createHandlers(API)} onExport={handleDataExport} customersData={{customers: reviewsData.customers || []}} productsData={{products: reviewsData.products || []}} onUpdate={updateHandlers.reviews} isUpdating={updatingStates.reviews}/>
            </div>
          </div>
        )
      case 'suppliers':
        return (
          <div className="p-6 bg-white min-h-screen">
            <div className="max-w-7xl mx-auto">
              <TableContainer config={suppliersConfig} {...suppliersData.createHandlers(API)} onExport={handleDataExport} onUpdate={updateHandlers.suppliers} isUpdating={updatingStates.suppliers}/>
            </div>
          </div>
        )
      case 'refunds':
        return (
          <div className="p-6 bg-white min-h-screen">
            <div className="max-w-7xl mx-auto">
              <TableContainer config={refundsConfig} {...refundsData.createHandlers(API)} onExport={handleDataExport} ordersData={{orders: refundsData.orders || []}} productsData={{products: refundsData.products || []}} customersData={{customers: refundsData.customers || []}} onUpdate={updateHandlers.refunds} isUpdating={updatingStates.refunds}/>
            </div>
          </div>
        )
      case 'settings':
        return <SettingsPage/>
      default: 
        return <Dashboard/>
    }
  }
  return (
    <div className="flex h-screen bg-white font-[Quicksand] overflow-hidden">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} onLogout={handleLogout}/>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onLogout={handleLogout}/>
        <div className="flex-1 overflow-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}
export default MainPage