import { useState, useEffect } from 'react'

const PhoneInput = ({ name, value, onChange, disabled = false, required = false }) => {
  // Estado para el valor que se muestra en el input (con formato visual)
  const [displayValue, setDisplayValue] = useState('+503-')

  // Efecto para inicializar el valor cuando el componente se monta o el valor cambia
  useEffect(() => {
    if (value && typeof value === 'string') {
      // Extraer solo los dígitos
      const cleaned = value.replace(/[^\d]/g, '')
      const numbers = cleaned.startsWith('503') ? cleaned.slice(3) : cleaned

      // Formatear para mostrar: +503-0000-0000
      let formatted = '+503-'
      if (numbers.length > 0) {
        formatted += numbers.slice(0, 4)
        if (numbers.length > 4) formatted += '-' + numbers.slice(4, 8)
      }
      setDisplayValue(formatted)
    } else {
      setDisplayValue('+503-')
    }
  }, [value]) // Se ejecuta cuando el valor prop cambia

  // Función que aplica formato visual al número mientras el usuario escribe
  const formatPhone = (input) => {
    // Quitar cualquier carácter que no sea número
    let cleaned = input.replace(/[^\d]/g, '')

    // Mantener el prefijo 503 al inicio
    if (!cleaned.startsWith('503')) cleaned = '503' + cleaned

    // Limitar longitud máxima (503 + 8 dígitos)
    cleaned = cleaned.slice(0, 11)

    // Separar los números y aplicar formato visual
    const numbers = cleaned.slice(3)
    let formatted = '+503-'
    if (numbers.length > 0) {
      formatted += numbers.slice(0, 4)
      if (numbers.length > 4) formatted += '-' + numbers.slice(4, 8)
    }
    return formatted
  }

  // Manejar cambios en el input (cada vez que el usuario escribe o borra)
  const handleChange = (e) => {
    const input = e.target.value

    // Permitir solo números, el signo +, guiones y espacios
    if (!/^[\d+\-\s]*$/.test(input)) return

    // Aplicar formato automático
    const formattedValue = formatPhone(input)

    // Actualizar el valor visual mostrado
    setDisplayValue(formattedValue)

    // Preparar el valor para enviar al backend (sin espacios)
    const backendValue = formattedValue.replace(/\s/g, '')

    // Llamar a la función onChange del padre con el valor ya listo para MongoDB
    onChange({
      target: {
        name,
        value: backendValue
      }
    })
  }

  // Manejar teclas presionadas para mejor control de entrada
  const handleKeyDown = (e) => {
    // Teclas permitidas: números, navegación, borrar, etc.
    const allowed =
      e.ctrlKey ||
      e.metaKey ||
      [
        'Backspace',
        'Delete',
        'ArrowLeft',
        'ArrowRight',
        'Tab',
        'Home',
        'End',
        'Enter'
      ].includes(e.key)

    // Si la tecla no es válida (letras, símbolos), prevenir la acción
    if (!allowed && !/^[0-9\-+]$/.test(e.key)) {
      e.preventDefault()
    }
  }

  return (
    <div className="flex flex-col w-full">
      <input
        type="text"
        name={name}
        value={displayValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="+503-0000-0000"
        disabled={disabled}
        required={required}
        className={`w-full px-3 py-2 border rounded-lg font-[Quicksand] text-[#3D1609] placeholder-gray-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#A73249] ${
          disabled
            ? 'opacity-50 cursor-not-allowed border-gray-300 bg-gray-100'
            : 'border-gray-300 bg-white hover:border-[#A73249]/60 focus:border-[#A73249]'
        }`}
      />
    </div>
  )
}

export default PhoneInput