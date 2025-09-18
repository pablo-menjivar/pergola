import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'
import TextInput from '../components/Input/Input'
import PasswordInput from '../components/Input/PasswordInput'
import PhoneInput from '../components/Input/PhoneInput'
import DUIInput from '../components/Input/DUIInput'
import DateInput from '../components/Input/DateInput'
import { ChevronLeft } from 'lucide-react'
import Pergola from '../assets/pergola.png'
import Logo from '../assets/logo.png'

const SignUp = () => {
  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    birthDate: '',
    DUI: '',
    hireDate: '',
    isVerified: false
  })
  // Estado para mostrar loading
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  // Obtiene usuario, loading y API del contexto de autenticación
  const { user, isLoading: authLoading, API } = useAuth()

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (!authLoading && user) {
      const from = location.state?.from?.pathname || '/main'
      navigate(from, { replace: true })
    }
  }, [user, authLoading, navigate, location])

  // Maneja cambios en los inputs del formulario
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }
      return newData
    })
  }

  // Valida los datos del formulario antes de enviar
  const validateForm = () => {
    const { name, lastName, username, email, password, confirmPassword, phoneNumber, birthDate, DUI, hireDate } = formData

    // Validaciones de campos obligatorios
    if (!name || !lastName || !username || !email || !password || !phoneNumber || !birthDate || !DUI || !hireDate) {
      toast.error('Todos los campos marcados con * son obligatorios')
      return false
    }
    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden')
      return false
    }
    if (password.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres')
      return false
    }
    if (!email.includes('@')) {
      toast.error('El email no es válido')
      return false
    }
    if (phoneNumber.length !== 13 || !phoneNumber.startsWith('+503')) {
      toast.error('El teléfono debe tener el formato correcto (+5030000-0000)')
      return false
    }
    if (DUI.length !== 10) {
      toast.error('El número de DUI debe tener el formato correcto (00000000-0)')
      return false
    }
    // Validar fechas
    const birthDateObj = new Date(birthDate)
    const hireDateObj = new Date(hireDate)
    const today = new Date()
    if (birthDateObj >= today) {
      toast.error('La fecha de nacimiento no puede ser hoy o una fecha futura')
      return false
    }
    if (hireDateObj > today) {
      toast.error('La fecha de contratación no puede estar en el futuro')
      return false
    }
    return true
  }

  // Maneja el envío del formulario de registro
  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    try {
      // Petición para registrar usuario
      const response = await fetch(`${API}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name,
          lastName: formData.lastName,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          phoneNumber: formData.phoneNumber,
          birthDate: formData.birthDate,
          DUI: formData.DUI,
          hireDate: formData.hireDate,
          isVerified: formData.isVerified
        })
      })
      const data = await response.json()

      // Si hubo error, muestra mensaje
      if (!response.ok) {
        throw new Error(data.message || 'Error al registrar empleado')
      }
      toast.success('¡Registro exitoso! Redirigiendo...')
      // Pequeño delay antes de redirigir
      setTimeout(() => {
        navigate('/main')
      }, 2000)
    } catch (error) {
      console.error('Error:', error)
      toast.error(error.message || 'Error al registrar empleado')
    } finally {
      setIsLoading(false)
    }
  }

  // Navega a la página de login
  const handleGoToLogin = () => {
    navigate('/login')
  }

  // Mostrar loading si está verificando autenticación
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#E3C6B8' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A73249] mx-auto mb-4"></div>
          <p className="font-[Quicksand] font-semibold" style={{ color: '#3D1609' }}>Cargando...</p>
        </div>
      </div>
    )
  }

  // Render principal del formulario de registro
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#E3C6B8' }}>
      {/* Header */}
      <div className="w-full px-4 py-4 flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center font-[Quicksand] font-semibold hover:opacity-70 transition-opacity text-sm"
          style={{ color: '#3D1609' }}
        >
          <ChevronLeft size={18} className="mr-1" />
          Atrás
        </button>
        <img src={Logo} alt="Pérgola Joyería Logo" className="h-8 object-contain" />
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col items-center px-4 pb-6">
        <div className="w-full max-w-md">
          {/* Títulos */}
          <div className="text-center mb-4">
            <h2 className="text-2xl font-[Quicksand] font-bold mb-2" style={{ color: '#3D1609' }}>
              Únete al Equipo
            </h2>
            <h3 className="text-lg font-[Quicksand] font-medium" style={{ color: '#A73249' }}>
              Crea una cuenta
            </h3>
          </div>

          {/* Mensaje para administradores */}
          <div className="bg-blue-50/40 rounded-xl p-3 mb-4 text-center border border-blue-200/50">
            <p className="font-[Quicksand] text-sm font-medium" style={{ color: '#3D1609' }}>
              💼 Si eres administrador, puedes omitir este paso
            </p>
          </div>

          {/* Formulario */}
          <div className="bg-white/40 rounded-xl p-4 mb-4 shadow-sm">
            <div className="space-y-3">
              {/* Información Personal */}
              <div className="grid grid-cols-2 gap-3">
                <TextInput
                  text="Nombre *"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nombre"
                  disabled={isLoading}
                  required
                />
                <TextInput
                  text="Apellido *"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Apellido"
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <TextInput
                  text="Usuario *"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Usuario"
                  disabled={isLoading}
                  required
                />
                <DUIInput
                  text="DUI *"
                  name="DUI"
                  value={formData.DUI}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                />
              </div>

              {/* Fechas */}
              <div className="grid grid-cols-2 gap-3">
                <DateInput
                  text="Nacimiento *"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  max={new Date().toISOString().split('T')[0]}
                  disabled={isLoading}
                  required
                />
                <DateInput
                  text="Contratación *"
                  name="hireDate"
                  value={formData.hireDate}
                  onChange={handleInputChange}
                  max={new Date().toISOString().split('T')[0]}
                  disabled={isLoading}
                  required
                />
              </div>

              {/* Información de Contacto */}
              <div className="grid grid-cols-2 gap-3">
                <TextInput
                  text="Email *"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="email@ejemplo.com"
                  disabled={isLoading}
                  required
                />
                <PhoneInput
                  text="Teléfono *"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                />
              </div>

              {/* Contraseñas */}
              <div className="grid grid-cols-2 gap-3">
                <PasswordInput
                  text="Contraseña *"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Mín. 8 caracteres"
                  disabled={isLoading}
                  required
                />
                <PasswordInput
                  text="Confirmar *"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirma contraseña"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>
          </div>

          {/* Verificación */}
          <div className="flex items-center space-x-3 p-3 bg-blue-50/30 rounded-xl border border-blue-200/50 mb-4">
            <input
              type="checkbox"
              name="isVerified"
              checked={formData.isVerified}
              onChange={handleInputChange}
              className="w-4 h-4 rounded"
              style={{ accentColor: '#A73249', borderColor: '#A73249' }}
            />
            <label className="text-sm font-[Quicksand] font-medium" style={{ color: '#3D1609' }}>
              Empleado verificado
            </label>
          </div>

          {/* Botón de registro */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full py-3 rounded-xl font-[Quicksand] font-bold text-lg transition-all duration-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            style={{ 
              backgroundColor: '#A73249',
              color: '#FFFFFF'
            }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Registrando...
              </div>
            ) : (
              'Registrarse'
            )}
          </button>

          {/* Enlace a login */}
          <p className="text-center font-[Quicksand] text-sm" style={{ color: '#3D1609' }}>
            ¿Ya tienes una cuenta?{' '}
            <button 
              onClick={handleGoToLogin}
              className="underline font-semibold hover:opacity-80" 
              style={{ color: '#A73249' }}
            >
              Inicia sesión
            </button>
          </p>
        </div>
      </div>

      {/* Footer con marca */}
      <div className="py-4 px-4 text-center" style={{ backgroundColor: '#E8E1D8' }}>
        <div className="flex items-center justify-center mb-2">
          <img src={Pergola} alt="P decorativa" className="w-6 h-auto opacity-60 mr-2"/>
          <p className="font-[Quicksand] font-semibold text-sm" style={{ color: '#A73249' }}>
            PÉRGOLA JOYERÍA
          </p>
        </div>
        <p className="font-[Quicksand] text-xs" style={{ color: '#3D1609' }}>
          Tu belleza merece cada pieza ✨
        </p>
      </div>
    </div>
  );
};

// Exporta el componente para su uso en rutas
export default SignUp