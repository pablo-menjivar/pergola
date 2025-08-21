import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import PasswordInput from '../components/Input/PasswordInput'
import Pergola from '../assets/pergola.png'
import Logo from '../assets/logo.png'
import { ChevronLeft } from 'lucide-react'

const ResetPassword = () => {
  // Estados para las contraseñas y el estado de carga
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email

  // Redirigir si no hay email en el estado
  useEffect(() => {
    if (!email) {
      navigate('/forgot-password')
    }
  }, [email, navigate])

  // Valida la contraseña según reglas de seguridad
  const validatePassword = (password) => {
    const errors = []
    if (password.length < 8) {
      errors.push('Mínimo 8 caracteres')
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Al menos una mayúscula')
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Al menos una minúscula')
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Al menos un número')
    }
    return errors
  }

  // Maneja el envío del formulario para cambiar la contraseña
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validaciones de campos
    if (!newPassword || !confirmPassword) {
      toast.error('Por favor completa todos los campos')
      return
    }
    const passwordErrors = validatePassword(newPassword)
    if (passwordErrors.length > 0) {
      toast.error(`Contraseña debe tener: ${passwordErrors.join(', ')}`)
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas no coinciden')
      return
    }
    setIsLoading(true)
    try {
      // Petición para cambiar la contraseña
      const response = await fetch('https://pergola.onrender.com/api/recoveryPassword/changePassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ newPassword })
      })
      
      const data = await response.json()

      // Si fue exitosa, muestra mensaje y redirige al login
      if (response.ok) {
        toast.success('Contraseña cambiada exitosamente')
        setTimeout(() => {
          navigate('/login')
        }, 1500)
      } else {
        toast.error(data.message || 'Error al cambiar la contraseña')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error de conexión. Verifica tu internet.')
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
      {/* Sección Derecha - Reset Password Content */}
      <div className="w-full lg:w-3/5 flex flex-col justify-center items-center px-8 sm:px-12 lg:px-16 py-8 lg:py-0 relative" style={{ backgroundColor: '#E3C6B8' }}>
        <div className="w-full max-w-lg text-center">
          {/* Header */}
          <div className="flex justify-between items-center mb-10 lg:mb-12">
            <button
              onClick={() => navigate('/verify-code', { state: { email } })}
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
              Nueva contraseña
            </h2>
            {/* Subtítulo */}
            <h3 className="text-lg sm:text-xl lg:text-2xl font-[Quicksand] font-medium mb-8 lg:mb-10" style={{ color: '#A73249' }}>
              Restablece tu acceso
            </h3>
            {/* Descripción */}
            <p className="text-base font-[Quicksand] mb-8" style={{ color: '#3D1609' }}>
              Crea una nueva contraseña segura para tu cuenta
            </p>
            {/* Información de seguridad */}
            <div className="bg-white/30 border border-white/50 rounded-lg p-4 mb-8 text-left">
              <h4 className="text-sm font-[Quicksand] font-semibold mb-3" style={{ color: '#3D1609' }}>
                Tu contraseña debe contener:
              </h4>
              <ul className="text-sm font-[Quicksand] space-y-1" style={{ color: '#3D1609' }}>
                <li>• Mínimo 8 caracteres</li>
                <li>• Al menos una letra mayúscula</li>
                <li>• Al menos una letra minúscula</li>
                <li>• Al menos un número</li>
              </ul>
            </div>
            {/* Formulario para cambiar contraseña */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <PasswordInput
                text="Nueva contraseña:"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Tu nueva contraseña"
                disabled={isLoading}
                required
              />
              <PasswordInput
                text="Confirmar contraseña:"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirma tu contraseña"
                disabled={isLoading}
                required
              />
              {/* Indicador de coincidencia de contraseñas */}
              {confirmPassword && (
                <div className={`text-sm font-[Quicksand] ${
                  newPassword === confirmPassword ? 'text-green-600' : 'text-red-600'
                }`}>
                  {newPassword === confirmPassword ? '✓ Las contraseñas coinciden' : '✗ Las contraseñas no coinciden'}
                </div>
              )}
            </form>
          </div>
          {/* Botón para enviar el cambio de contraseña */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full py-4 px-4 rounded-lg font-[Quicksand] font-bold text-xl transition-all duration-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              backgroundColor: '#A73249',
              color: '#FFFFFF'
            }}
          >
            {isLoading ? 'Cambiando contraseña...' : 'Cambiar contraseña'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Exporta el componente para su uso en rutas
export default ResetPassword