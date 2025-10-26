// Componente de input para seleccionar fechas
const DateInput = ({ name, value, onChange, disabled = false, required = false, max = null, min = null }) => {
  return (
    <div className="flex flex-col w-full">
      {/* Input tipo fecha */}
      <input 
        type="date" 
        name={name}
        value={value || ""} // Forzar cadena vacía si es `null`/`undefined` 
        onChange={onChange} 
        disabled={disabled} // Deshabilita el input si la prop lo indica
        required={required} // Hace el campo obligatorio si la prop lo indica
        max={max} // Fecha máxima permitida
        min={min} // Fecha mínima permitida
        className={`w-full px-3 py-2 border rounded-lg font-[Quicksand] text-[#3D1609] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#A73249] ${
          disabled
            ? 'opacity-50 cursor-not-allowed border-gray-300 bg-gray-100'
            : 'border-gray-300 bg-white hover:border-[#A73249]/60 focus:border-[#A73249]'
        }`}
      />
    </div>
  )
}
export default DateInput