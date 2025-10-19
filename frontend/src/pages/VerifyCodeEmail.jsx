import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ChevronLeft } from 'lucide-react'
import Logo from '../assets/logo.png'

const VerifyCodeEmail = () => {
  const [verificationCode, setVerificationCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  // Maneja cambios en el input del código
  const handleCodeChange = (e) => {
    const value = e.target.value.replace(/[^a-fA-F0-9]/g, '') // Solo permitir hex
    if (value.length <= 6) {
      setVerificationCode(value.toUpperCase())
    }
  }

  // Maneja el envío del código de verificación
  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) {
      toast.error('El código debe tener 6 caracteres')
      return
    }
    // Debug: verificar cookies
    console.log('Cookies disponibles:', document.cookie)
    setIsLoading(true)
    try {
      const response = await fetch(`https://pergola.onrender.com/api/signup/verifyCode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Importante para enviar las cookies
        body: JSON.stringify({
          verCodeRequest: verificationCode.toLowerCase()
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error al verificar el código')
      }

      toast.success('¡Cuenta verificada exitosamente!')
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        navigate('/login')
      }, 2000)

    } catch (error) {
      console.error('Error:', error)
      toast.error(error.message || 'Error al verificar el código')
    } finally {
      setIsLoading(false)
    }
  }
  // Reenviar código (opcional)
  const handleResendCode = async () => {
    toast.error('Función de reenvío no implementada aún')
  }

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
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Títulos */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-[Quicksand] font-bold mb-2" style={{ color: '#3D1609' }}>
              Verifica tu Correo
            </h2>
            <p className="text-sm font-[Quicksand] font-medium" style={{ color: '#A73249' }}>
              Hemos enviado un código de verificación de 6 dígitos a tu correo electrónico
            </p>
          </div>

          {/* Formulario de verificación */}
          <div className="bg-white/40 rounded-xl p-6 mb-6 shadow-sm">
            <div className="space-y-4">
              {/* Input del código */}
              <div>
                <label className="block text-sm font-[Quicksand] font-semibold mb-2" style={{ color: '#3D1609' }}>
                  Código de Verificación
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={handleCodeChange}
                  placeholder="Ejemplo: A1B2C3"
                  maxLength={6}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:border-[#A73249] focus:outline-none font-[Quicksand] font-medium text-center text-lg tracking-widest"
                  style={{ backgroundColor: '#FFFFFF' }}
                  disabled={isLoading}
                />
                <p className="text-xs font-[Quicksand] mt-1" style={{ color: '#666' }}>
                  Ingresa el código hexadecimal que recibiste por correo
                </p>
              </div>

              {/* Botón de verificación */}
              <button
                onClick={handleVerifyCode}
                disabled={isLoading || verificationCode.length !== 6}
                className="w-full py-3 rounded-xl font-[Quicksand] font-bold text-lg transition-all duration-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  backgroundColor: '#A73249',
                  color: '#FFFFFF'
                }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Verificando...
                  </div>
                ) : (
                  'Verificar Código'
                )}
              </button>
            </div>
          </div>

          {/* Enlaces adicionales */}
          <div className="text-center space-y-3">
            <p className="text-sm font-[Quicksand]" style={{ color: '#3D1609' }}>
              ¿No recibiste el código?
            </p>
            <button 
              onClick={handleResendCode}
              className="text-sm font-[Quicksand] font-semibold underline hover:opacity-80 transition-opacity"
              style={{ color: '#A73249' }}
              disabled={isLoading}
            >
              Reenviar código
            </button>
          </div>

          {/* Mensaje informativo */}
          <div className="mt-6 bg-blue-50/40 rounded-xl p-3 text-center border border-blue-200/50">
            <p className="font-[Quicksand] text-xs font-medium" style={{ color: '#3D1609' }}>
              💡 El código expira en 2 horas. Revisa tu bandeja de entrada y spam.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyCodeEmail