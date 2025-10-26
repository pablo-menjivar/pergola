import { useState } from 'react'

// Componente de input para contraseñas con opción de mostrar/ocultar
const PasswordInput = ({ name, value, onChange, placeholder, disabled = false, required = false }) => {
  // Estado para mostrar u ocultar la contraseña
  const [show, setShow] = useState(false)

  return (
    <div className="flex flex-col w-full relative">
      <div className="relative">
        {/* Input de contraseña */}
        <input 
          name={name} 
          type={show ? 'text' : 'password'} // Cambia el tipo según el estado 'show'
          value={value} 
          onChange={onChange} 
          placeholder={placeholder} 
          disabled={disabled} 
          required={required} 
          className={`w-full px-3 py-2 pr-10 border rounded-lg font-[Quicksand] text-[#3D1609] placeholder-gray-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#A73249] [&::-webkit-credentials-auto-fill-button]:hidden [&::-webkit-password-auto-fill-button]:hidden ${
            disabled
              ? 'opacity-50 cursor-not-allowed border-gray-300 bg-gray-100'
              : 'border-gray-300 bg-white hover:border-[#A73249]/60 focus:border-[#A73249]'
          }`}
        />
        {/* Botón para mostrar/ocultar contraseña */}
        <button 
          type="button" 
          onClick={() => setShow(!show)} 
          disabled={disabled} 
          className={`absolute right-3 top-1/2 -translate-y-[43%] flex items-center text-[18px] text-[#3D1609] ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'hover:text-[#A73249] transition'
          }`}
        > 
          {show ? <i className="fi fi-sc-eye-crossed"></i> : <i className="fi fi-sc-eye"></i>}
        </button>
      </div>
    </div>
  )
}
export default PasswordInput