import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'
import TextInput from '../components/Input/Input'
import PasswordInput from '../components/Input/PasswordInput'
import { ChevronLeft } from 'lucide-react'
import Pergola from '../assets/pergola.png'
import Logo from '../assets/logo.png'

const Login = () => {
  // Estados para los campos del formulario
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [blockedInfo, setBlockedInfo] = useState(null) // ⬅️ FALTABA ESTO
  
  const navigate = useNavigate()
  const location = useLocation()
  // Obtiene funciones y estados del contexto de autenticación
  const { Login: authLogin, user, isLoading: authLoading } = useAuth()
  // Referencia para manejar el timeout de redirección
  const redirectTimeoutRef = useRef(null)

  // Limpiar timeout al desmontar componente
  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current)
      }
    }
  }, [])

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (!authLoading && user) {
      console.log("👤 Usuario ya autenticado, redirigiendo...", user)
      const from = location.state?.from?.pathname || '/main'
      navigate(from, { replace: true })
    }
  }, [user, authLoading, navigate, location])

  // Maneja el login al enviar el formulario
  const handleLogin = async (e) => {
    e.preventDefault()
    
    // Validaciones
    if (!email || !password) {
      toast.error('Por favor completa todos los campos')
      return
    }
    if (!email.includes('@')) {
      toast.error('Por favor ingresa un email válido')
      return
    }
    
    setIsLoading(true)
    setBlockedInfo(null) // Limpiar mensajes anteriores
    
    try {
      console.log("🔄 Iniciando proceso de login desde componente...")
      const result = await authLogin(email, password, rememberMe, "web")
      console.log("📋 Resultado del login:", result)
    
      if (result.success) {
        toast.success('¡Inicio de sesión exitoso!')
        // Redirigir a la página que intentaba acceder o al main
        const from = location.state?.from?.pathname || '/main'
        console.log("🔄 Redirigiendo a:", from)
        
        // Pequeño delay para que se vea el toast y se actualice el estado
        redirectTimeoutRef.current = setTimeout(() => {
          navigate(from, { replace: true })
        }, 1500)
      } else {
        console.log("❌ Login falló:", result.message)
        
        // Manejo específico para usuarios bloqueados
        if (result.remainingMinutes !== undefined) {
          if (result.remainingMinutes === 0) {
            setBlockedInfo({
              message: 'Usuario bloqueado por 24 horas',
              subtitle: 'Demasiados intentos fallidos de inicio de sesión'
            })
          } else {
            const hours = Math.floor(result.remainingMinutes / 60)
            const minutes = result.remainingMinutes % 60
            
            let timeMessage = ''
            if (hours > 0) {
              timeMessage = `${hours} hora${hours > 1 ? 's' : ''}`
              if (minutes > 0) {
                timeMessage += ` y ${minutes} minuto${minutes > 1 ? 's' : ''}`
              }
            } else {
              timeMessage = `${minutes} minuto${minutes > 1 ? 's' : ''}`
            }
            
            setBlockedInfo({
              message: 'Usuario temporalmente bloqueado',
              subtitle: `Tiempo restante: ${timeMessage}`
            })
          }
        } else {
          toast.error(result.message || 'Error al iniciar sesión')
        }
      }
    } catch (error) {
      console.error('❌ Login error:', error)
      toast.error('Error de conexión. Verifica tu internet.')
    } finally {
      setIsLoading(false)
    }
  }

  // Navega a la página de recuperación de contraseña
  const handleForgotPassword = () => {
    // Limpiar timeout antes de navegar
    if (redirectTimeoutRef.current) {
      console.log("🧹 Limpiando timeout antes de ir a forgot-password")
      clearTimeout(redirectTimeoutRef.current)
      redirectTimeoutRef.current = null
    }
    navigate('/forgot-password')
  }

  // Mostrar loading si está verificando autenticacion
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#E3C6B8' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A73249] mx-auto mb-4"></div>
          <p className="font-[Quicksand]" style={{ color: '#3D1609' }}>Cargando...</p>
        </div>
      </div>
    )
  }

  // Renderiza el formulario de login y la interfaz
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row overflow-hidden">
      {/* Sección Izquierda - Branding */}
      <div className="w-full lg:w-2/5 flex flex-col justify-center items-center px-6 sm:px-8 lg:px-12 py-8 relative" style={{ backgroundColor: '#E8E1D8' }}>
        {/* P decorativa en esquina superior izquierda */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 lg:top-8 lg:left-8">
          <img src={Pergola} alt="P decorativa" className="w-8 sm:w-10 lg:w-12 opacity-60 object-contain" />
        </div>
        <div className="text-center">
          {/* Logo placeholder */}
          <img src={Logo} alt="Logo" className="mb-6 lg:mb-8 mx-auto object-contain" style={{ width: 'min(320px, 90vw)', maxHeight: '400px' }} />
          {/* Texto debajo de la imagen */}
          <div className="max-w-sm mx-auto">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-[Quicksand] font-semibold mb-1" style={{ color: '#A73249' }}>TU BELLEZA</h3>
            <h4 className="text-lg sm:text-xl lg:text-2xl font-[Quicksand] font-semibold mb-1" style={{ color: '#A73249' }}>MERECE CADA</h4>
            <p className="text-lg sm:text-xl lg:text-2xl font-[Quicksand] font-semibold flex items-center justify-center" style={{ color: '#A73249' }}>
              PIEZA <span className="ml-2">✨</span>
            </p>
          </div>
        </div>
      </div>

      {/* Sección Derecha - Login Content */}
      <div className="w-full lg:w-3/5 flex justify-center items-center px-6 sm:px-10 lg:px-16 py-6" style={{ backgroundColor: '#E3C6B8' }}>
        <div className="w-full max-w-lg flex flex-col justify-between h-full">
          
          {/* Header */}
          <div className="flex justify-start items-center mb-1">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center font-[Quicksand] font-semibold hover:opacity-70 text-sm lg:text-base"
              style={{ color: '#3D1609' }}
            >
              <ChevronLeft size={18} className="mr-1" />
              Atrás
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col justify-center">
            {/* Title */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-[Quicksand] font-bold mb-3 text-center" style={{ color: '#3D1609' }}>
              Iniciar sesión
            </h2>
            
            {/* Subtitle */}
            <h3 className="text-lg sm:text-xl lg:text-2xl font-[Quicksand] font-medium mb-6 text-center" style={{ color: '#A73249' }}>
              Únete a nuestro equipo
            </h3>

            {/* Alerta de usuario bloqueado */}
            {blockedInfo && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="text-sm font-[Quicksand] font-semibold text-red-800">
                      {blockedInfo.message}
                    </h3>
                    <p className="text-sm font-[Quicksand] font-medium text-red-700 mt-1">
                      {blockedInfo.subtitle}
                    </p>
                  </div>
                  <div className="ml-3">
                    <button
                      type="button"
                      onClick={() => setBlockedInfo(null)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              <TextInput
                text="Correo electrónico:"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                disabled={isLoading}
                required
              />
              <PasswordInput
                text="Contraseña:"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tu contraseña"
                disabled={isLoading}
                required
              />
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="mr-3 w-5 h-5 rounded"
                    style={{ accentColor: '#A73249' }}
                  />
                  <span className="font-[Quicksand] text-sm font-medium" style={{ color: '#3D1609' }}>
                    Mantenerme conectado
                  </span>
                </label>
                <button 
                  type="button"
                  onClick={handleForgotPassword}
                  className="font-[Quicksand] text-sm font-medium underline hover:opacity-70" 
                  style={{ color: '#A73249' }}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-4 rounded-lg font-[Quicksand] font-bold text-xl transition-all duration-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#A73249', color: '#FFFFFF' }}
              >
                {isLoading ? 'Iniciando sesión...' : 'Continuar'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// Exporta el componente para su uso en rutas
export default Login