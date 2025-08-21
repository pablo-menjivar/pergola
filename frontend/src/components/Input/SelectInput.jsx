// Componente de input tipo select (desplegable)
const SelectInput = ({ text, name, value, onChange, options, placeholder, disabled = false, required = false }) => {
  return (
    <div className="flex flex-col w-full">
      {/* Etiqueta del select */}
      <label className="mb-1 text-sm text-left text-[#3D1609] font-[Quicksand] font-semibold">{text}</label>
      <div className="relative">
        {/* Select principal */}
        <select 
          name={name} 
          value={value} 
          onChange={onChange} 
          disabled={disabled} 
          required={required}
          className={`w-full bg-[#E8E1D8] border border-[#A73249] rounded-md px-3 py-2 pr-8 outline-none text-[#3D1609] font-[Nunito] transition focus:border-[#A73249] focus:ring-2 focus:ring-[#A73249]/20 appearance-none cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-[#50352C]'}`}
        >
          {/* Placeholder como opción deshabilitada */}
          <option value="" disabled className="text-[#39312f]">
            {placeholder}
          </option>
          {/* Opciones del select */}
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-[#E8E1D8] text-[#3D1609] py-2">
              {option.label}
            </option>
          ))}
        </select>
        {/* Flecha personalizada para el select */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="w-4 h-4 text-[#A73249]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
          </svg>
        </div>
      </div>
    </div>
  )
}
export default SelectInput