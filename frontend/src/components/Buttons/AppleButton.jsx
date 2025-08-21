import { FaApple } from 'react-icons/fa'

// Componente de botón para autenticación con Apple
const AppleAuthButton = ({ disabled = false }) => {
  return (
    // Botón estilizado con ícono de Apple
    <button
      type="button"
      disabled={disabled} // Deshabilita el botón si la prop lo indica
      className="w-full h-12 flex items-center justify-center gap-2 border-2 border-[#3D1609] rounded-md py-2 text-[#3D1609] font-[Quicksand] font-semibold hover:text-[#A73249]  transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <FaApple className="text-xl" /> {/* Ícono de Apple */}
      Continuar con Apple {/* Texto del botón */}
    </button>
  )
}

export default AppleAuthButton