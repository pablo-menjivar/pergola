import { useState, useEffect } from 'react'

const PhoneInput = ({ text, name, value, onChange, disabled = false, required = false }) => {
  // Estado para el valor que se muestra en el input (con formato visual)
  const [displayValue, setDisplayValue] = useState('+503 ')

  // Efecto para inicializar el valor cuando el componente se monta o el valor cambia
  useEffect(() => {
    if (value) {
      // Si ya hay un valor (por ejemplo, al editar), convertirlo al formato de visualización
      if (value.startsWith('+503') && value.length >= 8) {
        // Extraer solo los números del valor
        const numbers = value.replace(/\D/g, '').slice(3) // Quitar +503 y caracteres no numéricos
        // Formatear para mostrar: +503 0000-0000
        const formatted = numbers.length > 4 
          ? `+503 ${numbers.slice(0, 4)}-${numbers.slice(4, 8)}`
          : `+503 ${numbers}`
        setDisplayValue(formatted)
      }
    }
  }, [value]) // Se ejecuta cuando el valor prop cambia

  // Manejar cambios en el input
  const handleChange = (e) => {
    let input = e.target.value
    
    // Permitir solo números, el signo +, guiones y espacios
    if (!/^[\d+\-\s]*$/.test(input)) {
      return
    }

    // Mantener siempre el prefijo +503 al principio
    if (!input.startsWith('+503')) {
      // Si el usuario borra el +503, lo restauramos automáticamente
      input = '+503 ' + input.replace(/[^\d]/g, '')
    }

    // Limitar la longitud máxima para evitar overflow
    if (input.length > 14) {
      input = input.slice(0, 14)
    }

    // Variable para el valor formateado que se mostrará
    let formattedValue = input
    
    // Aplicar formato automático cuando hay suficientes dígitos
    if (input.length > 8) {
      // Extraer solo los números (sin +, espacios o guiones)
      const numbers = input.replace(/[^\d]/g, '').slice(3) // Quitar el 503
      if (numbers.length > 4) {
        // Formatear como +503 0000-0000
        formattedValue = `+503 ${numbers.slice(0, 4)}-${numbers.slice(4, 8)}`
      }
    }

    // Actualizar el valor visual
    setDisplayValue(formattedValue)

    // Preparar el valor para enviar al backend (sin espacios)
    const backendValue = formattedValue
      .replace(/\s/g, '')     // Eliminar todos los espacios
      .replace(/(\+503)(\d{4})(\d{4})/, '$1$2-$3') // Asegurar formato con guión

    // Llamar a la función onChange del padre con el valor para el backend
    onChange({ 
      target: { 
        name: e.target.name, 
        value: backendValue 
      } 
    })
  }

  // Manejar teclas presionadas para mejor control de entrada
  const handleKeyDown = (e) => {
    // Teclas permitidas: números, teclas de navegación y control
    const allowedKeys = [
      'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 
      'Tab', 'Home', 'End'
    ]
    
    // Si la tecla no es un número y no está en las teclas permitidas, prevenir la acción
    if (!allowedKeys.includes(e.key) && !/[\d]/.test(e.key)) {
      e.preventDefault()
    }
  }

  return (
    <div className="flex flex-col w-full">
      <label className="mb-1 text-sm text-left text-[#3D1609] font-[Quicksand] font-semibold">
        {text}
      </label>
      <input 
        type="text"
        name={name}
        value={displayValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="+503 0000-0000"
        disabled={disabled}
        required={required}
        className={`bg-[#E8E1D8] border border-[#A73249] rounded-md px-3 py-2 outline-none text-[#3D1609] font-[Nunito] placeholder-[#39312f] transition focus:border-[#A73249] focus:ring-2 focus:ring-[#A73249]/20 ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-[#50352C]'}`}
      />
    </div>
  )
}

export default PhoneInput