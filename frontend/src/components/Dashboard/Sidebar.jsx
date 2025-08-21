import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'  
import { useAuth } from '../../hooks/useAuth.js'
import menuItems from '../../data/MenuData.js'
import BlackLogo from '../../assets/logoforsidebar.png' 
import Monogram from '../../assets/logoforsidebar2.png'

// Componente Sidebar para navegación lateral
const Sidebar = ({ currentView, setCurrentView, onLogout }) => {
  // Estado para colapsar/expandir el sidebar
  const [isCollapsed, setIsCollapsed] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth() 

  // Filtra los items del menú según el rol del usuario
  const getFilteredMenuItems = () => {
    if (!user?.userType) return [];
    // Permisos por tipo de usuario
    const permissions = {
      'admin': [ 'dashboard', 'search', 'products', 'customdesigns', 'designelements', 'rawmaterials', 'employees', 'categories','subcategories', 'collections', 'customers', 'orders', 'reviews', 'refunds', 'transactions', 'suppliers', 'settings' ],
      'colaborador': [ 'dashboard', 'search', 'products', 'customdesigns', 'designelements', 'rawmaterials', 'categories','subcategories', 'collections', 'reviews', 'suppliers', 'settings' ],
    }
    const allowedViews = permissions[user.userType] || []
    return menuItems.filter(item => allowedViews.includes(item.id))
  }

  // Alterna el estado colapsado del sidebar
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  // Maneja el click en los items del menú
  const handleMenuClick = (itemId) => {
    if (itemId === 'power') {
      handleLogout()
    } else {
      setCurrentView(itemId)
    }
  }

  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      await onLogout()
      navigate('/login')
    } catch (error) {
      console.error('Error durante logout:', error)
      navigate('/login')
    }
  }

  // Render del sidebar
  return (
    <div className={`bg-[#E3C6B8] h-screen transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-80'} flex flex-col relative`}>
      
      {/* Header con logo - Estilo minimalista */}
      <div className="bg-[#E8E1D8] h-24 flex items-center justify-center px-6 relative">
        {!isCollapsed ? (
          <div className="flex items-center justify-center w-full">
            {/* Logo principal */}
            <img src={BlackLogo} alt="Pérgola Logo" className="h-16 w-auto object-contain" onError={(e) => {e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'flex'
              }}
            />
            {/* Logo alternativo si falla la imagen */}
            <div className="flex items-center justify-center" style={{display: 'none'}}>
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
            </div>
          </div>
        ) : (
          // Monograma para sidebar colapsado
          <img src={Monogram} alt="Pérgola Monogram" className="w-12 h-12 object-contain" onError={(e) => { 
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'}}/>
        )}
        {/* Botón para colapsar/expandir */}
        <button onClick={toggleSidebar} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#3D1609] hover:text-[#271610] transition-colors duration-200 p-1">
          {isCollapsed ? <Menu size={18} /> : <X size={18} />}
        </button>
      </div>
      {/* Menu Items */}
      <div className="flex-1 py-6 overflow-y-auto">
        {getFilteredMenuItems().filter(item => item.id !== 'settings' && item.id !== 'power').map((item) => { 
          const IconComponent = item.icon;
          const isActive = currentView === item.id;       
          
          return (
            <div key={item.id} onClick={() => handleMenuClick(item.id)} className={`w-full cursor-pointer transition-all duration-200 group relative ${isCollapsed ? 'px-4 py-4' : 'px-6 py-4'} ${isActive ? 'bg-[#E3C6B8]' : 'hover:bg-[#E3C6B8]/50'}`}>
              <div className="flex items-center">
                {/* Icono del menú */}
                <div className={`transition-colors duration-200 ${isActive ? 'text-[#3D1609]' : 'text-[#3D1609]/80'}`}>
                  <IconComponent size={isCollapsed ? 24 : 20} className="flex-shrink-0"/>
                </div>
                {/* Etiqueta del menú */}
                {!isCollapsed && (
                  <span className={`ml-4 text-[15px] transition-all duration-200 font-[Quicksand] ${isActive ? 'text-[#3D1609] font-bold' : 'text-[#3D1609]/90 font-medium'}`}>
                    {item.label}
                  </span>
                )}
              </div>
              {/* Línea divisoria sutil */}
              {!isActive && (
                <div className="absolute bottom-0 left-6 right-6 h-px bg-[#3D1609]/10"></div>
              )}
            </div>
          )
        })}
      </div>
      {/* Línea divisoria antes del footer */}
      <div className="mx-6 h-px bg-[#3D1609]/20"></div>
      {/* Footer Section - Configuración */}
      <div className="py-2">
        {menuItems.filter(item => item.id === 'settings').map((item) => {
          const IconComponent = item.icon;
          const isActive = currentView === item.id;
          return (
            <div key={item.id} className={`w-full cursor-pointer transition-all duration-200 group ${isCollapsed ? 'px-4 py-4' : 'px-6 py-4'} ${isActive ? 'bg-[#E3C6B8]' : 'hover:bg-[#E3C6B8]/50'}`} onClick={() => handleMenuClick(item.id)}>
              <div className="flex items-center">
                {/* Icono de configuración */}
                <div className={`transition-colors duration-200 ${isActive ? 'text-[#3D1609]' : 'text-[#3D1609]/80'}`}>
                  <IconComponent size={isCollapsed ? 24 : 20} className="flex-shrink-0" />
                </div>
                {/* Etiqueta de configuración */}
                {!isCollapsed && (
                  <span className={`ml-4 text-[15px] transition-all duration-200 font-[Quicksand] ${isActive ? 'text-[#3D1609] font-bold' : 'text-[#3D1609]/90 font-medium'}`}>
                    {item.label}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {/* Footer Section - Cerrar sesión */}
      <div className="pb-4">
        {menuItems.filter(item => item.id === 'power').map((item) => {
          const IconComponent = item.icon;
          return (
            <div key={item.id} onClick={handleLogout} className={`w-full cursor-pointer transition-all duration-200 group ${isCollapsed ? 'px-4 py-4' : 'px-6 py-4'} hover:bg-[#E3C6B8]/50`} >
              <div className="flex items-center">
                {/* Icono de cerrar sesión */}
                <div className="text-[#3D1609]/80 group-hover:text-[#3D1609] transition-colors duration-200">
                  <IconComponent size={isCollapsed ? 24 : 20} className="flex-shrink-0"/>
                </div>
                {/* Etiqueta de cerrar sesión */}
                {!isCollapsed && (
                  <span className="ml-4 text-[#3D1609]/90 text-[15px] font-[Quicksand] font-medium group-hover:text-[#3D1609] transition-colors duration-200">
                    {item.label}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  )
}
export default Sidebar