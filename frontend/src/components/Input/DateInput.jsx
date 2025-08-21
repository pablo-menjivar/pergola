// Componente de input para seleccionar fechas
const DateInput = ({ text, name, value, onChange, disabled = false, required = false, max = null, min = null }) => {
  return (
    <div className="flex flex-col w-full">
      {/* Etiqueta del input */}
      <label className="mb-1 text-sm text-left text-[#3D1609] font-[Quicksand] font-semibold">{text}</label>
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
        className={`bg-[#E8E1D8] border border-[#A73249] rounded-md px-3 py-2 outline-none text-[#3D1609] font-[Nunito] transition focus:border-[#A73249] focus:ring-2 focus:ring-[#A73249]/20 ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-[#50352C]'}`}
      />
    </div>
  )
}
export default DateInput