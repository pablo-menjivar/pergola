import { useState, useMemo, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'  
import { useAuth } from '../../hooks/useAuth.js'
import menuItems from '../../data/MenuData.js'
import BlackLogo from '../../assets/logoforsidebar.png' 
import Monogram from '../../assets/logoforsidebar2.png'

// Constantes de configuración para colores del tema
const COLORS = {
  primary: '#3D1609',
  background: '#E3C6B8',
  header: '#E8E1D8',
}

// Constantes para tamaños del sidebar
const SIZES = {
  expanded: 'w-80',
  collapsed: 'w-20',
  iconCollapsed: 24,
  iconExpanded: 20,
}

// Componente para manejar logos con fallback automático
const Logo = ({ src, alt, className, fallback }) => {
  const [error, setError] = useState(false)
  
  // Si hubo error al cargar, mostrar fallback
  if (error) return fallback
  
  return (
    <img 
      src={src} 
      alt={alt} 
      className={className}
      onError={() => setError(true)}
    />
  )
}

// Componente reutilizable para cada item del menú
const MenuItem = ({ item, isActive, isCollapsed, onClick, onHover }) => {
  const IconComponent = item.icon
  
  return (
    <div 
      role="button"
      tabIndex={0}
      onClick={() => onClick(item.id)}
      // Soporte de navegación por teclado
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick(item.id)
        }
      }}
      // Mostrar tooltip solo cuando está colapsado
      onMouseEnter={() => isCollapsed && onHover?.(item.label)}
      onMouseLeave={() => isCollapsed && onHover?.(null)}
      aria-current={isActive ? 'page' : undefined}
      className={`
        w-full cursor-pointer transition-all duration-200 group relative
        ${isCollapsed ? 'px-4 py-4' : 'px-6 py-4'}
        ${isActive ? 'bg-[#E3C6B8]' : 'hover:bg-[#E3C6B8]/50'}
      `}
    >
      {/* Indicador visual de item activo (barra lateral izquierda) */}
      <div className={`
        absolute left-0 top-0 w-1 h-full bg-[#3D1609] 
        transition-opacity duration-200
        ${isActive ? 'opacity-100' : 'opacity-0'}
      `} />
      
      <div className="flex items-center">
        {/* Icono del item */}
        <div className={`
          transition-colors duration-200 
          ${isActive ? 'text-[#3D1609]' : 'text-[#3D1609]/80 group-hover:text-[#3D1609]'}
        `}>
          <IconComponent 
            size={isCollapsed ? SIZES.iconCollapsed : SIZES.iconExpanded} 
            className="flex-shrink-0"
            aria-hidden="true"
          />
        </div>
        
        {/* Label del item (solo visible cuando no está colapsado) */}
        {!isCollapsed && (
          <span className={`
            ml-4 text-[15px] transition-all duration-200 font-[Quicksand]
            ${isActive ? 'text-[#3D1609] font-bold' : 'text-[#3D1609]/90 font-medium group-hover:text-[#3D1609]'}
          `}>
            {item.label}
          </span>
        )}
      </div>
      
      {/* Línea divisoria sutil entre items (no se muestra en item activo) */}
      {!isActive && (
        <div className="absolute bottom-0 left-6 right-6 h-px bg-[#3D1609]/10" />
      )}
    </div>
  )
}

// Componente principal del Sidebar
const Sidebar = ({ currentView, setCurrentView, onLogout }) => {
  // Estado para controlar si el sidebar está colapsado
  const [isCollapsed, setIsCollapsed] = useState(false)
  // Estado para manejar el tooltip en modo colapsado
  const [hoveredItem, setHoveredItem] = useState(null)
  const navigate = useNavigate()
  const { user } = useAuth()

  // Recuperar estado guardado del sidebar al montar el componente
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed')
    if (savedState !== null) {
      setIsCollapsed(JSON.parse(savedState))
    }
  }, [])

  // Persistir estado del sidebar cuando cambie
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed))
  }, [isCollapsed])

  // Memoizar items filtrados según permisos del usuario
  const filteredMenuItems = useMemo(() => {
    if (!user?.userType) return []
    
    // Definir permisos por tipo de usuario
    const permissions = {
      'admin': ['dashboard', 'search', 'products', 'customdesigns', 'designelements', 'rawmaterials', 'employees', 'categories', 'subcategories', 'collections', 'customers', 'orders', 'reviews', 'refunds', 'suppliers', 'settings'],
      'employee': ['dashboard', 'search', 'products', 'customdesigns', 'designelements', 'rawmaterials', 'categories', 'subcategories', 'collections', 'reviews', 'suppliers', 'settings'],
    }
    
    const allowedViews = permissions[user.userType] || []
    return menuItems.filter(item => allowedViews.includes(item.id))
  }, [user?.userType])

  // Separar items en categorías para mejor organización del render
  const { mainItems, settingsItem, powerItem } = useMemo(() => ({
    mainItems: filteredMenuItems.filter(item => item.id !== 'settings' && item.id !== 'power'),
    settingsItem: filteredMenuItems.find(item => item.id === 'settings'),
    powerItem: menuItems.find(item => item.id === 'power')
  }), [filteredMenuItems])

  // Alternar estado colapsado/expandido del sidebar
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  // Manejar clicks en items del menú
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

  return (
    <div 
      role="navigation"
      aria-label="Menú principal"
      className={`
        bg-[${COLORS.background}] h-screen transition-all duration-300 ease-in-out 
        ${isCollapsed ? SIZES.collapsed : SIZES.expanded} 
        flex flex-col relative
      `}
    >
      {/* Estilos globales para scrollbar personalizada muy delgada */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(61, 22, 9, 0.15);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(61, 22, 9, 0.25);
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(61, 22, 9, 0.15) transparent;
        }
      `}</style>

      {/* Header del sidebar con logo - Layout reorganizado */}
      <div className={`bg-[${COLORS.header}] h-24 flex items-center justify-between px-4 relative shrink-0`}>
        {/* Logo centrado con espacio reservado para el botón */}
        <div className="flex-1 flex items-center justify-center">
          <div className="transition-all duration-300 ease-in-out">
            {!isCollapsed ? (
              // Logo completo cuando está expandido
              <Logo 
                src={BlackLogo}
                alt="Pérgola Logo"
                className="h-14 w-auto object-contain max-w-[200px]"
                fallback={
                  <div className="flex items-center justify-center">
                    <div className="w-14 h-14 bg-black rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">P</span>
                    </div>
                  </div>
                }
              />
            ) : (
              // Monograma cuando está colapsado
              <Logo 
                src={Monogram}
                alt="Pérgola Monogram"
                className="w-10 h-10 object-contain"
                fallback={
                  <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">P</span>
                  </div>
                }
              />
            )}
          </div>
        </div>
        
        {/* Botón para colapsar/expandir - Posición fija a la derecha */}
        <button 
          onClick={toggleSidebar}
          aria-label={isCollapsed ? "Expandir menú" : "Contraer menú"}
          aria-expanded={!isCollapsed}
          className="flex-shrink-0 text-[#3D1609] hover:text-[#271610] transition-colors duration-200 p-2 rounded-md hover:bg-[#3D1609]/5"
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      {/* Tooltip flotante para items cuando el sidebar está colapsado */}
      {isCollapsed && hoveredItem && (
        <div 
          className="fixed left-20 bg-[#3D1609] text-white px-3 py-2 rounded-md text-sm shadow-lg z-50 whitespace-nowrap pointer-events-none"
          style={{ top: 'var(--mouse-y, 50%)' }}
        >
          {hoveredItem}
        </div>
      )}

      {/* Sección principal de items del menú - Scrollbar delgada personalizada */}
      <div className="flex-1 py-6 overflow-y-auto custom-scrollbar">
        {mainItems.map((item) => (
          <MenuItem
            key={item.id}
            item={item}
            isActive={currentView === item.id}
            isCollapsed={isCollapsed}
            onClick={handleMenuClick}
            onHover={setHoveredItem}
          />
        ))}
      </div>

      {/* Línea divisoria antes de la sección de configuración */}
      <div className="mx-6 h-px bg-[#3D1609]/20 shrink-0" />

      {/* Sección de configuración */}
      {settingsItem && (
        <div className="py-2 shrink-0">
          <MenuItem
            item={settingsItem}
            isActive={currentView === settingsItem.id}
            isCollapsed={isCollapsed}
            onClick={handleMenuClick}
            onHover={setHoveredItem}
          />
        </div>
      )}

      {/* Sección de cerrar sesión */}
      {powerItem && (
        <div className="pb-4 shrink-0">
          <div
            role="button"
            tabIndex={0}
            onClick={handleLogout}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleLogout()
              }
            }}
            onMouseEnter={() => isCollapsed && setHoveredItem(powerItem.label)}
            onMouseLeave={() => isCollapsed && setHoveredItem(null)}
            className={`
              w-full cursor-pointer transition-all duration-200 group
              ${isCollapsed ? 'px-4 py-4' : 'px-6 py-4'}
              hover:bg-[#E3C6B8]/50
            `}
          >
            <div className="flex items-center">
              {/* Icono de cerrar sesión */}
              <div className="text-[#3D1609]/80 group-hover:text-[#3D1609] transition-colors duration-200">
                <powerItem.icon 
                  size={isCollapsed ? SIZES.iconCollapsed : SIZES.iconExpanded} 
                  className="flex-shrink-0"
                  aria-hidden="true"
                />
              </div>
              
              {/* Label de cerrar sesión */}
              {!isCollapsed && (
                <span className="ml-4 text-[#3D1609]/90 text-[15px] font-[Quicksand] font-medium group-hover:text-[#3D1609] transition-colors duration-200">
                  {powerItem.label}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Sidebar