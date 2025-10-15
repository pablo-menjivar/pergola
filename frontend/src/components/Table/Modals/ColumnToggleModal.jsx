import { useState, useEffect } from 'react'
import { Eye, EyeOff, Columns, Save, X, RotateCcw } from 'lucide-react'
import BaseModal from './BaseModal'

const ColumnToggleModal = ({ isOpen, onClose, columns, visibleColumns, onSave }) => {
  const [tempVisibleColumns, setTempVisibleColumns] = useState(visibleColumns)

  // Sincronizar estado temporal cuando cambian las props
  useEffect(() => {
    setTempVisibleColumns(visibleColumns)
  }, [visibleColumns])

  // Alternar visibilidad de una columna
  const toggleColumn = (columnKey) => {
    setTempVisibleColumns(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey]
    }))
  }

  // Mostrar todas las columnas
  const showAll = () => {
    const allVisible = {}
    columns.forEach(col => {
      allVisible[col.key] = true
    })
    setTempVisibleColumns(allVisible)
  }

  // Ocultar todas las columnas (excepto las de prioridad 1)
  const showOnlyEssential = () => {
    const essentialOnly = {}
    columns.forEach(col => {
      essentialOnly[col.key] = col.priority === 1
    })
    setTempVisibleColumns(essentialOnly)
  }

  // Resetear a configuración por defecto
  const resetToDefault = () => {
    const defaultVisible = {}
    columns.forEach(col => {
      defaultVisible[col.key] = !col.hidden
    })
    setTempVisibleColumns(defaultVisible)
  }

  // Guardar cambios
  const handleSave = () => {
    onSave(tempVisibleColumns)
  }

  // Obtener estadísticas
  const visibleCount = Object.values(tempVisibleColumns).filter(Boolean).length
  const totalCount = columns.length

  // Categorizar columnas por prioridad
  const essentialColumns = columns.filter(col => col.priority === 1)
  const importantColumns = columns.filter(col => col.priority === 2)
  const optionalColumns = columns.filter(col => col.priority === 3 || !col.priority)

  // Renderizar grupo de columnas
  const renderColumnGroup = (groupColumns, title, description) => {
    if (groupColumns.length === 0) return null

    return (
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-[#3D1609] mb-2 font-[Quicksand]">
          {title}
        </h4>
        <p className="text-xs text-gray-600 mb-3 font-[Quicksand]">
          {description}
        </p>
        <div className="space-y-2">
          {groupColumns.map((column) => (
            <div
              key={column.key}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => toggleColumn(column.key)}
                  className={`p-1 rounded transition-colors ${
                    tempVisibleColumns[column.key]
                      ? 'text-[#A73249] bg-[#A73249]/10'
                      : 'text-gray-400 bg-gray-200'
                  }`}
                >
                  {tempVisibleColumns[column.key] ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
                <div>
                  <p className="text-sm font-medium text-[#3D1609] font-[Quicksand]">
                    {column.label}
                  </p>
                  {column.priority && (
                    <p className="text-xs text-gray-500">
                      Prioridad {column.priority}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {column.type && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                    {column.type}
                  </span>
                )}
                {column.width && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                    {column.width}px
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Configurar Columnas" size="lg">
      <div className="p-6">
        {/* Estadísticas y acciones rápidas */}
        <div className="mb-6 p-4 bg-[#E8E1D8] rounded-lg border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Columns className="w-5 h-5 text-[#A73249]" />
              <span className="font-semibold text-[#3D1609] font-[Quicksand]">
                {visibleCount} de {totalCount} columnas visibles
              </span>
            </div>
            <div className="text-sm text-gray-600">
              {Math.round((visibleCount / totalCount) * 100)}% visible
            </div>
          </div>

          {/* Acciones rápidas */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={showAll}
              className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors font-[Quicksand]"
            >
              Mostrar Todo
            </button>
            <button
              type="button"
              onClick={showOnlyEssential}
              className="px-3 py-1 text-xs bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition-colors font-[Quicksand]"
            >
              Solo Esenciales
            </button>
            <button
              type="button"
              onClick={resetToDefault}
              className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors font-[Quicksand] flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Por Defecto
            </button>
          </div>
        </div>

        {/* Lista de columnas por prioridad */}
        <div className="max-h-96 overflow-y-auto">
          {renderColumnGroup(
            essentialColumns,
            "Columnas Esenciales",
            "Información crítica que siempre debe estar visible"
          )}
          
          {renderColumnGroup(
            importantColumns,
            "Columnas Importantes",
            "Información útil para pantallas medianas y grandes"
          )}
          
          {renderColumnGroup(
            optionalColumns,
            "Columnas Opcionales",
            "Información adicional para pantallas grandes"
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-[#3D1609] border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-[Quicksand] flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-[#A73249] text-white rounded-lg hover:bg-[#A73249]/90 transition-colors duration-200 font-[Quicksand] flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Guardar Cambios
          </button>
        </div>
      </div>
    </BaseModal>
  )
}

export default ColumnToggleModal