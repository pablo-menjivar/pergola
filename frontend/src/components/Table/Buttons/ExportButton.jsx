import { useState, useRef, useEffect } from 'react'
import { Download, ChevronDown, FileText, Table, FileSpreadsheet } from 'lucide-react'
import ActionButton from './ActionButton'

const ExportButton = ({ 
  onExport,                // Función a ejecutar al exportar
  disabled = false,        // Estado deshabilitado
  isLoading = false,       // Estado de carga
  exportOptions = [        // Opciones de exportación disponibles
    { key: 'excel', label: 'Excel (.xlsx)', icon: FileSpreadsheet },
    { key: 'csv', label: 'CSV (.csv)', icon: Table },
    { key: 'pdf', label: 'PDF (.pdf)', icon: FileText }
  ], 
  className = ""           // Clases adicionales
}) => {
  // Estado para mostrar/ocultar el menú
  const [isOpen, setIsOpen] = useState(false)
  // Referencias para el botón y el menú
  const dropdownRef = useRef(null)
  const buttonRef = useRef(null)

  // Cierra el menú si se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Maneja la exportación según el formato seleccionado
  const handleExport = (format) => {
    if (onExport) {
      onExport(format)
    }
    setIsOpen(false)
  }

  // Alterna la visibilidad del menú
  const toggleDropdown = () => {
    if (!disabled && !isLoading) {
      setIsOpen(!isOpen)
    }
  }

  return (
    // Contenedor principal
    <div className="relative inline-block">
      {/* Botón de exportar */}
      <div ref={buttonRef}>
        <ActionButton 
          variant="outline" 
          icon={Download} 
          onClick={toggleDropdown} 
          disabled={disabled} 
          isLoading={isLoading} 
          className={`${className} ${isOpen ? 'ring-2 ring-[#A73249] ring-offset-2' : ''}`}
        >
          {/* Contenedor flex para alinear texto e icono */}
          <div className="flex items-center gap-1">
            <span>Exportar</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </ActionButton>
      </div>
      {/* Menú desplegable de opciones de exportación */}
      {isOpen && (
        <div ref={dropdownRef} className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-50 overflow-hidden font-[Quicksand]">
          <div className="py-1">
            {/* Opciones de exportación */}
            {exportOptions.map((option) => {
              const IconComponent = option.icon
              return (
                <button key={option.key} onClick={() => handleExport(option.key)} className="flex items-center w-full px-4 py-3 text-left text-[#3D1609] hover:bg-[#E8E1D8] hover:text-[#A73249] transition-colors duration-200 group">
                  <IconComponent className="w-4 h-4 mr-3 text-[#3D1609] group-hover:text-[#A73249] transition-colors" />
                  <span className="text-sm font-medium">{option.label}</span>
                </button>
              )
            })}
          </div>
          {/* Separador y nota informativa */}
          <div className="border-t border-gray-100">
            <div className="px-4 py-2">
              <p className="text-xs text-[#3D1609]">Se exportarán los datos filtrados</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
// Exporta el componente para su uso en otras partes
export default ExportButton