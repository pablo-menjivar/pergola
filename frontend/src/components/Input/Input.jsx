// Componente de input de texto reutilizable
const TextInput = ({ name, text, value, onChange, placeholder, type = "text", disabled = false, required = false }) => {
  return (
    <div className="flex flex-col w-full">
      {/* Etiqueta del input */}
      <label htmlFor={name} className="mb-1 text-sm text-left text-[#3D1609] font-[Quicksand] font-semibold">{text}</label>
      {/* Input de texto */}
      <input 
        name={name} 
        type={type} 
        value={value} 
        onChange={onChange} 
        placeholder={placeholder} 
        disabled={disabled} // Deshabilita el input si la prop lo indica
        required={required} // Hace el campo obligatorio si la prop lo indica
        className={`bg-[#E8E1D8] border border-[#A73249] rounded-md px-3 py-2 outline-none text-[#3D1609] font-[Nunito] placeholder-[#39312f] transition focus:border-[#A73249] focus:ring-2 focus:ring-[#A73249]/20 ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-[#50352C]'}`}
      />
    </div>
  )
}
export default TextInput