import { FaFacebook } from 'react-icons/fa'

// Componente de botón para autenticación con Facebook
const FacebookAuthButton = ({ disabled = false }) => {
  return (
    // Botón estilizado con ícono de Facebook
    <button
      type="button"
      disabled={disabled} // Deshabilita el botón si la prop lo indica
      className="w-full h-12 flex items-center justify-center gap-2 border-2 border-[#3D1609] rounded-md py-2 text-[#3D1609] font-[Quicksand]  font-semibold hover:text-[#A73249]  transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <FaFacebook className="text-xl" /> {/* Ícono de Facebook */}
      Continuar con Facebook {/* Texto del botón */}
    </button>
  )
}

export default FacebookAuthButton