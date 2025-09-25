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
import Logo from '../assets/logo.png'

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '', lastName: '', username: '', email: '', password: '', 
    confirmPassword: '', phoneNumber: '', birthDate: '', DUI: '', hireDate: '',
    isVerified: false
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isLoading: authLoading, API } = useAuth()

  useEffect(() => {
    if (!authLoading && user) {
      navigate(location.state?.from?.pathname || '/main', { replace: true })
    }
  }, [user, authLoading, navigate, location])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const validateForm = () => {
    const { name, lastName, username, email, password, confirmPassword, phoneNumber, birthDate, DUI, hireDate } = formData

    if (!name || !lastName || !username || !email || !password || !phoneNumber || !birthDate || !DUI || !hireDate) {
      toast.error('Todos los campos son obligatorios')
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
      toast.error('Email no válido')
      return false
    }
    if (phoneNumber.length !== 13 || !phoneNumber.startsWith('+503')) {
      toast.error('Teléfono debe tener formato +5030000-0000')
      return false
    }
    if (DUI.length !== 10) {
      toast.error('DUI debe tener formato 00000000-0')
      return false
    }
    
    const birthDateObj = new Date(birthDate)
    const hireDateObj = new Date(hireDate)
    const today = new Date()
    if (birthDateObj >= today) {
      toast.error('Fecha de nacimiento inválida')
      return false
    }
    if (hireDateObj > today) {
      toast.error('Fecha de contratación no puede ser futura')
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return
    setIsLoading(true)
    
    try {
      const response = await fetch(`${API}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name, lastName: formData.lastName, username: formData.username,
          email: formData.email, password: formData.password, phoneNumber: formData.phoneNumber,
          birthDate: formData.birthDate, DUI: formData.DUI, hireDate: formData.hireDate,
          isVerified: formData.isVerified
        })
      })
      
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Error al registrar')
      
      toast.success('¡Registro exitoso!')
      setTimeout(() => navigate('/main'), 1500)
    } catch (error) {
      toast.error(error.message || 'Error al registrar empleado')
    } finally {
      setIsLoading(false)
    }
  }

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

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#E3C6B8' }}>
      {/* Header ultra compacto */}
      <div className="px-3 py-2 flex justify-between items-center">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center font-[Quicksand] font-semibold text-xs"
          style={{ color: '#3D1609' }}
        >
          <ChevronLeft size={16} className="mr-1" />
          Atrás
        </button>
        <img src={Logo} alt="Logo" className="h-6 object-contain" />
      </div>

      {/* Contenido principal - Sin scroll */}
      <div className="flex-1 flex flex-col px-3 pb-3">
        {/* Títulos compactos */}
        <div className="text-center mb-3">
          <h2 className="text-xl font-[Quicksand] font-bold" style={{ color: '#3D1609' }}>Únete al Equipo</h2>
          <p className="text-sm font-[Quicksand]" style={{ color: '#A73249' }}>Crea tu cuenta</p>
        </div>

        {/* Mensaje administrador */}
        <div className="bg-blue-50/50 rounded-lg p-2 mb-2 text-center">
          <p className="font-[Quicksand] text-xs" style={{ color: '#3D1609' }}>
            💼 Administrador? Omite este paso
          </p>
        </div>

        {/* Formulario ultra compacto */}
        <div className="space-y-2 flex-1">
          {/* Fila 1: Nombre + Apellido */}
          <div className="grid grid-cols-2 gap-2">
            <TextInput
              text="Nombre"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Nombre"
              disabled={isLoading}
              required
            />
            <TextInput
              text="Apellido"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Apellido"
              disabled={isLoading}
              required
            />
          </div>

          {/* Fila 2: Usuario + DUI */}
          <div className="grid grid-cols-2 gap-2">
            <TextInput
              text="Usuario"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Usuario"
              disabled={isLoading}
              required
            />
            <DUIInput
              text="DUI"
              name="DUI"
              value={formData.DUI}
              onChange={handleInputChange}
              disabled={isLoading}
              required
            />
          </div>

          {/* Fila 3: Nacimiento + Contratación */}
          <div className="grid grid-cols-2 gap-2">
            <DateInput
              text="Nacimiento"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleInputChange}
              max={new Date().toISOString().split('T')[0]}
              disabled={isLoading}
              required
            />
            <DateInput
              text="Contratación"
              name="hireDate"
              value={formData.hireDate}
              onChange={handleInputChange}
              max={new Date().toISOString().split('T')[0]}
              disabled={isLoading}
              required
            />
          </div>

          {/* Fila 4: Email + Teléfono */}
          <div className="grid grid-cols-2 gap-2">
            <TextInput
              text="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="email@ejemplo.com"
              disabled={isLoading}
              required
            />
            <PhoneInput
              text="Teléfono"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              disabled={isLoading}
              required
            />
          </div>

          {/* Fila 5: Contraseñas */}
          <div className="grid grid-cols-2 gap-2">
            <PasswordInput
              text="Contraseña"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Mín. 8 chars"
              disabled={isLoading}
              required
            />
            <PasswordInput
              text="Confirmar"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirma"
              disabled={isLoading}
              required
            />
          </div>

          {/* Verificación compacta */}
          <div className="flex items-center space-x-2 p-2 bg-white/40 rounded-lg">
            <input
              type="checkbox"
              name="isVerified"
              checked={formData.isVerified}
              onChange={handleInputChange}
              className="w-3 h-3 rounded"
              style={{ accentColor: '#A73249' }}
            />
            <label className="font-[Quicksand] text-xs" style={{ color: '#3D1609' }}>
              Empleado verificado
            </label>
          </div>
        </div>

        {/* Botón de registro y login */}
        <div className="mt-3 space-y-2">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full py-2 rounded-lg font-[Quicksand] font-bold text-sm transition-all duration-300 hover:opacity-90 disabled:opacity-50"
            style={{ 
              backgroundColor: '#A73249',
              color: '#FFFFFF'
            }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Registrando...
              </div>
            ) : (
              'Registrarse'
            )}
          </button>

          <p className="text-center font-[Quicksand] text-xs" style={{ color: '#3D1609' }}>
            ¿Ya tienes cuenta?{' '}
            <button 
              onClick={() => navigate('/login')}
              className="underline font-semibold" 
              style={{ color: '#A73249' }}
            >
              Inicia sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignUp