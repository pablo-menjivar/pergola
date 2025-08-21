import { Search, Filter, RefreshCw, Plus } from 'lucide-react' // Importa Plus aquí
import ActionButton from './Buttons/ActionButton'
import ExportButton from './Buttons/ExportButton'

// Componente para mostrar las acciones de la tabla (buscar, filtrar, añadir, exportar, refrescar)
const TableActions = ({
  // Configuración de acciones disponibles
  actions = { canAdd: true, canExport: true, canFilter: true, canRefresh: true },
  // Callbacks para cada acción
  onAdd, onExport, onFilter, onRefresh, onSearch,
  // Estados de carga y búsqueda
  isLoading = false, searchValue = "",
  // Personalización de textos y título
  addButtonText = "Añadir", title = "",
  // Acciones personalizadas y clases adicionales
  customActions = [], className = ""
}) => {
  // Maneja el cambio en el campo de búsqueda
  const handleSearchChange = (e) => {
    if (onSearch) {
      onSearch(e.target.value)
    }
  }
  return (
    // Contenedor principal de acciones
    <div className={`bg-white rounded-lg border border-gray-200 p-4 mb-6 font-[Quicksand] ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Lado izquierdo - Titulo y búsqueda */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
          {/* Muestra el título si existe */}
          {title && (
            <h2 className="text-xl font-bold text-[#3D1609]">
              {title}
            </h2>
          )}
          {/* Campo de búsqueda si hay callback */}
          {onSearch && (
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#3D1609] w-4 h-4" />
              <input type="text" placeholder="Buscar..." value={searchValue} onChange={handleSearchChange} className="w-full pl-10 pr-4 py-2 border border-[#A73249] rounded-lg bg-[#E8E1D8] text-[#3D1609] placeholder-[#39312F] focus:outline-none focus:ring-2 focus:ring-[#A73249] focus:border-transparent transition-colors"/>
            </div>
          )}
        </div>
        {/* Lado derecho - Botones de acción */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Acciones personalizadas */}
          {customActions.map((action, index) => (
            <ActionButton key={index} variant={action.variant || "ghost"} icon={action.icon} onClick={action.onClick} disabled={action.disabled || isLoading} className={action.className}>
              {action.label}
            </ActionButton>
          ))}
          {/* Botón de filtro */}
          {actions.canFilter && onFilter && (
            <ActionButton variant="ghost" icon={Filter} onClick={onFilter} disabled={isLoading}>
              Filtrar
            </ActionButton>
          )}
          {/* Botón de refrescar */}
          {actions.canRefresh && onRefresh && (
            <ActionButton variant="ghost" icon={RefreshCw} onClick={onRefresh} disabled={isLoading} size="icon"/>
          )}
          {/* Botón de exportar */}
          {actions.canExport && onExport && (
            <ExportButton onExport={onExport} disabled={isLoading}/>
          )}
          {/* Botón de añadir */}
          {actions.canAdd && onAdd && (
            <ActionButton variant="primary" icon={Plus} onClick={onAdd} disabled={isLoading}>
              {addButtonText}
            </ActionButton>
          )}
        </div>
      </div>
      {/* Línea separadora sutil */}
      <div className="mt-4 h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent"></div>
    </div>
  )
}
// Exporta el componente para su uso en otras partes
export default TableActions