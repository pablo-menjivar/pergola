// Importa los iconos que se pueden usar en el botón
import { Plus, Edit, Trash2, Eye, Mail, Download, Filter } from 'lucide-react'

// Componente de botón de acción reutilizable
const ActionButton = ({
  variant = "primary", // Variante de estilo
  size = "md",        // Tamaño del botón
  icon,               // Icono personalizado
  children,           // Texto o contenido del botón
  onClick,            // Función al hacer clic
  disabled = false,   // Estado deshabilitado
  loading = false,    // Estado de carga
  className = "",     // Clases adicionales
  ...props            // Otros props
}) => {
  // Configuración de iconos por defecto según la variante
  const getDefaultIcon = () => {
    switch (variant) {
      case 'add': return Plus
      case 'edit': return Edit
      case 'delete': return Trash2
      case 'view': return Eye
      case 'email': return Mail
      case 'export': return Download
      case 'filter': return Filter
      default: return null
    }
  }
  // Configuración de estilos según la variante
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
      case 'add':
        return 'bg-[#A73249] border-[#A73249] text-white hover:bg-transparent hover:text-[#A73249] focus:ring-[#A73249]/60'
      case 'secondary':
        return 'bg-[#E8E1D8] border-[#E8E1D8] text-white hover:bg-transparent hover:text-[#E8E1D8] focus:ring-[#E8E1D8]/20'
      case 'edit':
        return 'bg-blue-600 border-blue-600 text-white hover:bg-transparent hover:text-blue-600 focus:ring-blue-500/20'
      case 'delete':
        return 'bg-red-600 border-red-600 text-white hover:bg-transparent hover:text-red-600 focus:ring-red-500/20'
      case 'view':
        return 'bg-gray-600 border-gray-600 text-white hover:bg-transparent hover:text-gray-600 focus:ring-gray-500/20'
      case 'outline':
        return 'bg-transparent border-[#3D1609] text-[#3D1609] hover:bg-[#3D1609] hover:text-white focus:ring-[#3D1609]/20'
      case 'ghost':
        return 'bg-transparent border-transparent text-[#3D1609] hover:bg-[#3D1609]/10 hover:border-[#3D1609<]/20 focus:ring-[#3D1609]/20'
      default:
        return 'bg-[#A73249] border-[#A73249] text-white hover:bg-transparent hover:text-[#A73249] focus:ring-[#A73249]/20'
    }
  }
  // Configuración de tamaños
  const getSizeStyles = () => {
    switch (size) {
      case 'xs':
        return 'px-2 py-1 text-xs'
      case 'sm':
        return 'px-3 py-1.5 text-sm'
      case 'md':
        return 'px-4 py-2 text-sm'
      case 'lg':
        return 'px-6 py-3 text-base'
      case 'xl':
        return 'px-8 py-4 text-lg'
      default:
        return 'px-4 py-2 text-sm'
    }
  }
  // Determina el icono a mostrar
  const IconComponent = icon || getDefaultIcon()
  // Obtiene los estilos según la variante y tamaño
  const variantStyles = getVariantStyles()
  const sizeStyles = getSizeStyles()

  return (
    // Botón principal con estilos y funcionalidad
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={` inline-flex items-center justify-center gap-2 font-[Quicksand] font-semibold border-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 shadow-sm hover:shadow-md ${variantStyles} ${sizeStyles} ${className}`}
      {...props}
    >
      {/* Muestra spinner si está cargando */}
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          <span>Cargando...</span>
        </>
      ) : (
        <>
          {/* Muestra el icono si existe */}
          {IconComponent && <IconComponent className="w-4 h-4 flex-shrink-0" />}
          {/* Muestra el texto o contenido */}
          {children && <span>{children}</span>}
        </>
      )}
    </button>
  )
}
// Exporta el componente para su uso en otras partes
export default ActionButton