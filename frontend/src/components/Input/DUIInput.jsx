import { useState } from 'react'

const DUIInput = ({ name, value, onChange, disabled = false, required = false }) => {
  // Estado para almacenar el valor formateado
  const [formattedValue, setFormattedValue] = useState(value)

  // Función para formatear el DUI como 00000000-0
  const formatDUI = (input) => {
    // Remover todos los caracteres no numéricos
    const cleaned = input.replace(/\D/g, '')
    // Limitar a 9 dígitos
    const limited = cleaned.slice(0, 9)
    // Formatear como 00000000-0
    if (limited.length >= 9) {
      return limited.slice(0, 8) + '-' + limited.slice(8)
    } else if (limited.length >= 8) {
      return limited.slice(0, 8) + '-'
    } else {
      return limited
    }
  }

  // Maneja el cambio en el input y actualiza el valor formateado
  const handleChange = (e) => {
    const input = e.target.value
    const formatted = formatDUI(input)
    setFormattedValue(formatted)
    // Pasar el valor formateado al componente padre
    onChange({ target: { name: e.target.name, value: formatted } })
  }

  return (
    <div className="flex flex-col w-full">
      {/* Input de texto para DUI */}
      <input 
        type="text" 
        name={name}
        value={formattedValue} 
        onChange={handleChange} 
        placeholder="00000000-0" 
        disabled={disabled} 
        required={required} 
        maxLength={10}
        className={`w-full px-3 py-2 border rounded-lg font-[Quicksand] text-[#3D1609] placeholder-gray-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#A73249] ${
          disabled
            ? 'opacity-50 cursor-not-allowed border-gray-300 bg-gray-100'
            : 'border-gray-300 bg-white hover:border-[#A73249]/60 focus:border-[#A73249]'
        }`}
      />
    </div>
  )
}
export default DUIInput