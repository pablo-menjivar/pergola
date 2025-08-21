import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../hooks/useAuth'
import TextInput from '../components/Input/Input'
import PasswordInput from '../components/Input/PasswordInput'
import SelectInput from '../components/Input/SelectInput'
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
    userType: '',
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

  // Opciones para el tipo de usuario
  const userTypeOptions = [
    {
      value: 'colaborador',
      label: 'Colaborador'
    }
  ]

  // Maneja cambios en los inputs del formulario
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }
      console.log('Nuevo formData:', newData)
      return newData
    })
    console.log(e.target.value)
  }

  // Valida los datos del formulario antes de enviar
  const validateForm = () => {
    const { name, lastName, username, email, password, confirmPassword, phoneNumber, birthDate, DUI, userType, hireDate } = formData

    // Debug para desarrollo
    console.log('=== DEBUGGING FORM DATA ===')
    console.log('formData completo:', formData)
    // Verifica campos vacíos
    const emptyFields = []
    if (!name) emptyFields.push('name')
    if (!lastName) emptyFields.push('lastName')
    if (!username) emptyFields.push('username')
    if (!email) emptyFields.push('email')
    if (!password) emptyFields.push('password')
    if (!confirmPassword) emptyFields.push('confirmPassword')
    if (!phoneNumber) emptyFields.push('phoneNumber')
    if (!birthDate) emptyFields.push('birthDate')
    if (!DUI) emptyFields.push('DUI')
    if (!userType) emptyFields.push('userType')
    if (!hireDate) emptyFields.push('hireDate')
    console.log('Campos vacíos:', emptyFields)
    console.log('===============================')
    // Validaciones de campos obligatorios
    if (!name || !lastName || !username || !email || !password || !phoneNumber || !birthDate || !DUI || !userType || !hireDate) {
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
    // En la función validateForm, modifica la validación del teléfono:
    if (phoneNumber.length !== 13 || !phoneNumber.startsWith('+503')) {
      toast.error('El teléfono debe tener el formato correcto (+5030000-0000)')
      return false
    }
    if (DUI.length !== 10) {
      toast.error('El número de DUI debe tener el formato correcto (00000000-0)')
      return false
    }
    if (!'colaborador'.includes(userType)) {
      toast.error('Debe seleccionar un tipo de usuario válido')
      return false
    }
    // Validar fechas
    const birthDateObj = new Date(birthDate)
    const hireDateObj = new Date(hireDate)
    const today = new Date()
    if (birthDateObj >= today) {
        
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
          userType: formData.userType,
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
    <div className="flex flex-col lg:flex-row h-screen">
      {/* Sección Izquierda - Branding */}
      <div className="w-full lg:w-2/5 h-64 lg:h-screen flex flex-col justify-center items-center px-6 sm:px-8 lg:px-12 py-8 relative" style={{ backgroundColor: '#E8E1D8' }}>
        {/* P decorativa en esquina superior izquierda */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 lg:top-8 lg:left-8">
          <img src={Pergola} alt="P decorativa" className="w-8 h-auto sm:w-10 lg:w-12 opacity-60 object-contain"/>
        </div>
        <div className="text-center">
          {/* Logo placeholder */}
          <img src={Logo} alt="Pérgola Joyería Logo" className="mb-6 lg:mb-8 mx-auto max-w-full object-contain" style={{ width: 'min(320px, 90vw)', height: 'auto', maxHeight: '400px' }}/>
          {/* Texto debajo de la imagen */}
          <div className="max-w-sm mx-auto">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-[Quicksand] font-semibold mb-1 sm:mb-2" style={{ color: '#A73249' }}>
              TU BELLEZA
            </h3>
            <h4 className="text-lg sm:text-xl lg:text-2xl font-[Quicksand] font-semibold mb-1 sm:mb-2" style={{ color: '#A73249' }}>
              MERECE CADA
            </h4>
            <p className="text-lg sm:text-xl lg:text-2xl font-[Quicksand] font-semibold flex items-center justify-center" style={{ color: '#A73249' }}>
              PIEZA <span className="ml-2">✨</span>
            </p>
          </div>
        </div>
      </div>
      {/* Sección Derecha - Signup Content */}
      <div className="w-full lg:w-3/5 h-full max-h-screen overflow-y-auto px-8 sm:px-12 lg:px-16 py-8 relative" style={{ backgroundColor: '#E3C6B8' }}>
        <div className="w-full max-w-2xl mx-auto pb-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8 lg:mb-10">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center font-[Quicksand] font-semibold hover:opacity-70 transition-opacity text-sm lg:text-base"
              style={{ color: '#3D1609' }}
            >
              <ChevronLeft size={18} className="mr-1" />
              Atrás
            </button>
          </div>
          {/* Content */}
          <div className="mb-8 lg:mb-10">
            {/* Title */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-[Quicksand] font-bold mb-3 lg:mb-4 text-center" style={{ color: '#3D1609' }}>
              Únete al Equipo
            </h2>
            {/* Subtitle */}
            <h3 className="text-lg sm:text-xl lg:text-2xl font-[Quicksand] font-medium mb-8 lg:mb-10 text-center" style={{ color: '#A73249' }}>
              Crea una cuenta
            </h3>
            {/* Registration Form */}
            <div className="space-y-6">
              {/* Información Personal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput
                  text="Nombre *"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Ingresa tu nombre"
                  disabled={isLoading}
                  required
                />
                <TextInput
                  text="Apellido *"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Ingresa tu apellido"
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput
                  text="Nombre de Usuario *"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Nombre de usuario único"
                  disabled={isLoading}
                  required
                />
                <DUIInput
                  text="Número de DUI *"
                  name="DUI"
                  value={formData.DUI}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                />
              </div>
              {/* Fechas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DateInput
                  text="Fecha de Nacimiento *"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  max={new Date().toISOString().split('T')[0]}
                  disabled={isLoading}
                  required
                />
                <DateInput
                  text="Fecha de Contratación *"
                  name="hireDate"
                  value={formData.hireDate}
                  onChange={handleInputChange}
                  max={new Date().toISOString().split('T')[0]}
                  disabled={isLoading}
                  required
                />
              </div>
              {/* Información de Contacto */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput
                  text="Correo Electrónico *"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="correo@ejemplo.com"
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PasswordInput
                  text="Contraseña *"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Mínimo 8 caracteres"
                  disabled={isLoading}
                  required
                />
                <PasswordInput
                  text="Confirmar Contraseña *"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirma la contraseña"
                  disabled={isLoading}
                  required
                />
              </div>
              {/* Tipo de Usuario */}
              <SelectInput
                text="Tipo de Usuario *"
                name="userType"
                value={formData.userType}
                onChange={handleInputChange}
                options={userTypeOptions}
                placeholder="Selecciona tu rol"
                disabled={isLoading}
                required
              />
              {/* Información sobre roles */}
              <div className="bg-white/30 rounded-lg p-4 border border-white/50 font-[Quicksand]">
                <h4 className=" font-semibold mb-2" style={{ color: '#3D1609' }}>
                  ℹ️ Información sobre roles:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-semibold">
                  <div>
                    <strong style={{ color: '#A73249' }}>Colaborador:</strong>
                    <p style={{ color: '#3D1609' }}>
                      Acceso a funciones básicas del sistema, gestión de productos y ventas.
                    </p>
                  </div>
                  <div>
                    <strong style={{ color: '#A73249' }}>Administrador:</strong>
                    <p style={{ color: '#3D1609' }}>
                      Acceso completo al sistema, gestión de empleados y configuración.
                    </p>
                  </div>
                </div>
              </div>

              {/* Verificación */}
              <div className="flex items-center space-x-3 p-4 bg-blue-50/30 rounded-lg border border-blue-200/50">
                <input
                  type="checkbox"
                  name="isVerified"
                  checked={formData.isVerified}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: '#A73249', borderColor: '#A73249', }}
                />
                <label className="text-sm font-[Quicksand] font-medium" style={{ color: '#3D1609' }}>
                  Marcar como empleado verificado (recomendado para empleados de confianza)
                </label>
              </div>
            </div>
          </div>
          {/* Register Button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full py-4 px-4 rounded-lg font-[Quicksand] font-bold text-xl transition-all duration-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
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
          {/* Login Link */}
          <p className="text-center font-[Quicksand] text-sm mt-6" style={{ color: '#3D1609' }}>
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
    </div>
  );
};

// Exporta el componente para su uso en rutas
export default SignUp