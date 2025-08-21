import { useState } from 'react'

// Componente de input para contraseñas con opción de mostrar/ocultar
const PasswordInput = ({ name, text, value, onChange, placeholder, disabled = false, required = false }) => {
  // Estado para mostrar u ocultar la contraseña
  const [show, setShow] = useState(false)

  return (
    <div className="flex flex-col w-full relative">
      {/* Etiqueta del input */}
      <label htmlFor={name} className="mb-1 text-sm text-left text-[#3D1609] font-[Quicksand] font-semibold">{text}</label>
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
          className={`w-full bg-[#E8E1D8] border border-[#A73249] rounded-md px-3 py-2 pr-10 outline-none text-[#3D1609] font-[Nunito] placeholder-[#39312f] transition focus:border-[#A73249] focus:ring-2 focus:ring-[#A73249]/20 [&::-webkit-credentials-auto-fill-button]:hidden [&::-webkit-password-auto-fill-button]:hidden ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-[#50352C]'}`}
        />
        {/* Botón para mostrar/ocultar contraseña */}
        <button 
          type="button" 
          onClick={() => setShow(!show)} 
          disabled={disabled} 
          className={` absolute right-3 top-1/2 -translate-y-[43%] flex items-center text-[18px] text-[#3D1609] ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:text-[#50352C] transition'}`}
        > 
          {show ? <i className="fi fi-sc-eye-crossed"></i> : <i className="fi fi-sc-eye"></i>}
        </button>
      </div>
    </div>
  )
}
export default PasswordInput