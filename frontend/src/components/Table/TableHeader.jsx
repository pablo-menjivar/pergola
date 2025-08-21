import TableActions from './TableActions.jsx'
// Componente para mostrar el encabezado de la tabla con título, subtítulo y barra de acciones
const TableHeader = ({ 
  title,                // Título principal
  subtitle,             // Subtítulo (ej: cantidad de elementos)
  searchValue,          // Valor actual del campo de búsqueda
  onSearch,             // Callback para búsqueda
  actions = {},         // Configuración de acciones disponibles
  onAdd, onExport, onFilter, onRefresh, // Callbacks para cada acción
  addButtonText,        // Texto personalizado para el botón de añadir
  addButtonIcon,        // Icono personalizado para el botón de añadir
  customActions = [],   // Acciones personalizadas
  isLoading = false,    // Estado de carga
  className = ""        // Clases adicionales
}) => {
  return (
    <div className={`mb-6 ${className}`}>
      {/* Titulo y subtitulo */}
      {(title || subtitle) && (
        <div className="mb-4">
          {/* Muestra el título si existe */}
          {title && (
            <h1 className="text-2xl font-bold text-[#3D1609] font-[Quicksand]">
              {title}
            </h1>
          )}
          {/* Muestra el subtítulo si existe */}
          {subtitle && (
            <p className="text-[#3D1609]/70 font-[Quicksand] mt-1">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {/* Barra de acciones de la tabla */}
      <TableActions 
        actions={actions} 
        onAdd={onAdd} 
        onExport={onExport} 
        onFilter={onFilter} 
        onRefresh={onRefresh} 
        onSearch={onSearch} 
        searchValue={searchValue} 
        isLoading={isLoading} 
        addButtonText={addButtonText} 
        addButtonIcon={addButtonIcon} 
        customActions={customActions}
      />
    </div>
  )
}
// Exporta el componente para su uso en otras partes
export default TableHeader