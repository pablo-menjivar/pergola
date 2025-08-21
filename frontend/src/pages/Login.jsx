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
  const navigate = useNavigate()
  const location = useLocation()
  // Obtiene funciones y estados del contexto de autenticación
  const { Login: authLogin, user, isLoading: authLoading } = useAuth()
  // Referencia para manejar el timeout de redirección
  const redirectTimeoutRef = useRef(null)

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
    try {
      console.log("🔄 Iniciando proceso de login desde componente...")
      const result = await authLogin(email, password, rememberMe)
      console.log("📋 Resultado del login:", result)
    
      if (result.success) {
        toast.success('¡Inicio de sesión exitoso!')
        // Redirigir a la página que intentaba acceder o al main
        const from = location.state?.from?.pathname || '/main'
        console.log("🔄 Redirigiendo a:", from)
        // Pequeño delay para que se vea el toast y se actualice el estado
        setTimeout(() => {
          navigate(from, { replace: true })
        }, 1500)
      } else {
        console.log("❌ Login falló:", result.message)
        toast.error(result.message || 'Error al iniciar sesión')
      }
    } catch (error) {
      console.error('❌ Login error:', error)
      toast.error('Error de conexión. Verifica tu internet.')
    } finally {
      setIsLoading(false)
    }
  }

  // Navega a la página de registro
  const handleGoToRegister = () => {
    navigate('/register')
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
          {/* Register Link */}
          <p className="text-center mt-6 mb-3 font-[Quicksand] font-medium text-sm" style={{ color: '#3D1609' }}>
            ¿No tienes una cuenta?{' '}
            <button 
              onClick={handleGoToRegister}
              className="underline font-semibold hover:opacity-80" 
              style={{ color: '#A73249' }}
            >
              Regístrate
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// Exporta el componente para su uso en rutas
export default Login