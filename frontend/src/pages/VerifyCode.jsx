import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import TextInput from '../components/Input/Input'
import Pergola from '../assets/pergola.png'
import Logo from '../assets/logo.png'
import { ChevronLeft } from 'lucide-react'

const VerifyCode = () => {
  // Estado para el código, loading y tiempo restante
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(20 * 60) // 20 minutos en segundos
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email

  // Redirigir si no hay email
  useEffect(() => {
    if (!email) {
      navigate('/forgot-password')
    }
  }, [email, navigate])

  // Contador de tiempo para expirar el código
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  // Formatea el tiempo restante en minutos:segundos
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // Maneja el envío del formulario para verificar el código
  const handleSubmit = async (e) => {
    e.preventDefault() 
    
    // Validaciones del código
    if (!code) {
      toast.error('Por favor ingresa el código')
      return
    }
    if (code.length !== 5) {
      toast.error('El código debe tener 5 dígitos')
      return
    }
    setIsLoading(true)
    try {
      // Petición para verificar el código
      const response = await fetch('https://pergola-production.up.railway.app/api/recoveryPassword/verifyCode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ code })
      })
      const data = await response.json()
      
      // Si fue exitoso, muestra mensaje y navega a reset password
      if (response.ok) {
        toast.success('Código verificado correctamente')
        navigate('/reset-password', { state: { email } })
      } else {
        toast.error(data.message || 'Código incorrecto')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error de conexión. Verifica tu internet.')
    } finally {
      setIsLoading(false)
    }
  }

  // Maneja el reenvío del código
  const handleResendCode = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('https://pergola-production.up.railway.app/api/recoveryPassword/requestCode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email })
      })
      const data = await response.json()

      // Si fue exitoso, reinicia contador y limpia código
      if (response.ok) {
        toast.success('Nuevo código enviado')
        setTimeLeft(20 * 60) // Reiniciar contador
        setCode('')
      } else {
        toast.error(data.message || 'Error al reenviar el código')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error de conexión')
    } finally {
      setIsLoading(false)
    }
  }

  // Render principal
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
      {/* Sección Derecha - Verify Code Content */}
      <div className="w-full lg:w-3/5 flex flex-col justify-center items-center px-8 sm:px-12 lg:px-16 py-8 lg:py-0 relative" style={{ backgroundColor: '#E3C6B8' }}>
        <div className="w-full max-w-lg text-center">
          {/* Header */}
          <div className="flex justify-between items-center mb-10 lg:mb-12">
            <button
              onClick={() => navigate('/forgot-password')}
              className="flex items-center font-[Quicksand] font-semibold hover:opacity-70 transition-opacity text-sm lg:text-base"
              style={{ color: '#3D1609' }}
            >
              <ChevronLeft size={18} className="mr-1" />
              Atrás
            </button>
          </div>
          {/* Content principal */}
          <div className="mb-10 lg:mb-12">
            {/* Título */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-[Quicksand] font-bold mb-3 lg:mb-4" style={{ color: '#3D1609' }}>
              Verificar código
            </h2>
            {/* Subtítulo */}
            <h3 className="text-lg sm:text-xl lg:text-2xl font-[Quicksand] font-medium mb-6" style={{ color: '#A73249' }}>
              Código de verificación
            </h3>
            {/* Email info */}
            <div className="mb-8">
              <p className="text-base font-[Quicksand] mb-2" style={{ color: '#3D1609' }}>
                Hemos enviado un código de 5 dígitos a:
              </p>
              <p className="text-lg font-[Quicksand] font-semibold" style={{ color: '#A73249' }}>
                {email}
              </p>
            </div>
            {/* Contador de tiempo */}
            <div className="mb-8">
              <div className="bg-white/30 border border-white/50 rounded-lg p-4">
                <p className="text-sm font-[Quicksand] mb-1" style={{ color: '#3D1609' }}>
                  El código expira en:
                </p>
                <p className="text-2xl font-bold font-[Quicksand]" style={{ color: '#A73249' }}>
                  {formatTime(timeLeft)}
                </p>
              </div>
            </div>
            {/* Formulario para ingresar el código */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <TextInput
                text="Código de verificación:"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                placeholder="12345"
                disabled={isLoading}
                required
              />
            </form>
          </div>
          {/* Botón para verificar el código */}
          <button
            onClick={handleSubmit}
            disabled={isLoading || timeLeft === 0}
            className="w-full py-4 px-4 rounded-lg font-[Quicksand] font-bold text-xl transition-all duration-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
            style={{ 
              backgroundColor: '#A73249',
              color: '#FFFFFF'
            }}
          >
            {isLoading ? 'Verificando...' : 'Verificar código'}
          </button>
          {/* Opción para reenviar el código */}
          <div className="text-center">
            <p className="text-sm font-[Quicksand] mb-2" style={{ color: '#3D1609' }}>
              ¿No recibiste el código?
            </p>
            <button 
              onClick={handleResendCode}
              disabled={isLoading || timeLeft > 0}
              className={`text-sm underline font-semibold transition ${
                (isLoading || timeLeft > 0) 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:opacity-80'
              }`}
              style={{ 
                color: (isLoading || timeLeft > 0) ? '#7A6E6E' : '#A73249' 
              }}
            >
              {timeLeft > 0 ? 'Reenviar disponible cuando expire' : 'Reenviar código'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Exporta el componente para su uso en rutas
export default VerifyCode