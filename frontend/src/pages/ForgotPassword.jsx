import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import TextInput from '../components/Input/Input'
import Pergola from '../assets/pergola.png'
import Logo from '../assets/logo.png'
import { ChevronLeft } from 'lucide-react'

const ForgotPassword = () => {
  // Estado para el email y el estado de carga
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validaciones básicas de email
    if (!email) {
      toast.error('Por favor ingresa tu correo electrónico')
      return
    }
    if (!email.includes('@')) {
      toast.error('Por favor ingresa un email válido')
      return
    }

    setIsLoading(true)
    try {
      // Realiza la petición para solicitar el código de recuperación
      const response = await fetch('https://pergola.onrender.com/api/recoveryPassword/requestCode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email })
      })
      
      const data = await response.json()
      
      // Si la petición fue exitosa, muestra mensaje y navega a la verificación
      if (response.ok) {
        toast.success('Código enviado a tu correo electrónico')
        navigate('/verify-code', { state: { email } })
      } else {
        // Si hubo error, muestra mensaje de error
        toast.error(data.message || 'Error al enviar el código')
      }
    } catch (error) {
      // Error de conexión
      console.error('Error:', error)
      toast.error('Error de conexión. Verifica tu internet.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Sección Izquierda - Branding */}
      <div className="w-full lg:w-2/5 flex flex-col justify-center items-center px-6 sm:px-8 lg:px-12 py-8 lg:py-0 relative overflow-hidden" style={{ backgroundColor: '#E8E1D8' }}>
        {/* P decorativa - FIJA */}
        <div className="fixed top-4 left-4 sm:top-6 sm:left-6 lg:top-8 lg:left-8 z-10">
          <img src={Pergola} alt="P decorativa" className="w-8 h-auto sm:w-10 lg:w-12 opacity-60 object-contain"/>
        </div>
        <div className="text-center flex-shrink-0">
          {/* Logo - FIJO */}
          <img src={Logo} alt="Pérgola Joyería Logo" className="mx-auto max-w-full object-contain" style={{ width: 'min(320px, 90vw)', height: 'auto', maxHeight: '400px' }}/>
        </div>
      </div>

      {/* Sección Derecha - Forgot Password Content */}
      <div className="w-full lg:w-3/5 flex flex-col justify-center items-center px-8 sm:px-12 lg:px-16 py-8 lg:py-0 relative" style={{ backgroundColor: '#E3C6B8' }}>
        <div className="w-full max-w-lg text-center">
          {/* Header con botón para volver al login */}
          <div className="flex justify-between items-center mb-10 lg:mb-12">
            <button
              onClick={() => navigate('/login')}
              className="flex items-center font-[Quicksand] font-semibold hover:opacity-70 transition-opacity text-sm lg:text-base"
              style={{ color: '#3D1609' }}
            >
              <ChevronLeft size={18} className="mr-1" />
              Volver al login
            </button>
          </div>

          {/* Content principal */}
          <div className="mb-10 lg:mb-12">
            {/* Título */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-[Quicksand] font-bold mb-3 lg:mb-4" style={{ color: '#3D1609' }}>
              ¿Olvidaste tu contraseña?
            </h2>
            {/* Subtítulo */}
            <h3 className="text-lg sm:text-xl lg:text-2xl font-[Quicksand] font-medium mb-8 lg:mb-10" style={{ color: '#A73249' }}>
              Recupera tu acceso
            </h3>
            
            {/* Descripción */}
            <p className="text-base font-[Quicksand] mb-8 lg:mb-10" style={{ color: '#3D1609' }}>
              Ingresa tu correo electrónico y te enviaremos un código para restablecer tu contraseña
            </p>

            {/* Formulario de email */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <TextInput
                text="Correo electrónico:"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                disabled={isLoading}
                required
              />
            </form>
          </div>

          {/* Botón para enviar el código */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full py-4 px-4 rounded-lg font-[Quicksand] font-bold text-xl transition-all duration-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed mb-8"
            style={{ 
              backgroundColor: '#A73249',
              color: '#FFFFFF'
            }}
          >
            {isLoading ? 'Enviando código...' : 'Enviar código'}
          </button>

          {/* Enlace para volver al login si recuerda la contraseña */}
          <p className="text-center font-[Quicksand] text-sm" style={{ color: '#3D1609' }}>
            ¿Recordaste tu contraseña?{' '}
            <button 
              onClick={() => navigate('/login')}
              className="underline font-semibold hover:opacity-80" 
              style={{ color: '#A73249' }}
            >
              Volver al inicio de sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword