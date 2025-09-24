import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { toast } from 'react-hot-toast'

// Componente para proteger rutas privadas
const ProtectedRoute = ({ children }) => {
  // Obtiene datos de autenticación y función de logout
  const { user, authCookie, logout } = useAuth()
  // Estado para saber si está validando la sesión
  const [isValidating, setIsValidating] = useState(true)
  // Estado para saber si el usuario está autenticado
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  // Estado para evitar mostrar el error varias veces
  const [hasShownError, setHasShownError] = useState(false)
  // Ubicación actual para redirección
  const location = useLocation()

  useEffect(() => {
    // Función para validar autenticación
    const validateAuth = async () => {
      // Si no hay usuario ni token, no está autenticado
      if (!user && !authCookie) {
        setIsAuthenticated(false)
        setIsValidating(false)
        return
      }
      try {
        // Verifica el token con el servidor
        const response = await fetch('https://pergola-production.up.railway.app/api/validateAuthToken', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        if (response.ok) {
          // Token válido
          console.log("✅ Token válido - user authenticated")
          setIsAuthenticated(true)
          setHasShownError(false) // Reinicia el flag de error
        } else {
          // Token inválido, limpia datos locales
          await logout() // Limpia localStorage y cookies
          setIsAuthenticated(false)
          // Solo muestra el error una vez
          if (!hasShownError) {
            setHasShownError(true)
            if (response.status === 401) {
              toast.error('Sesión expirada. Por favor, inicia sesión.')
            } else if (response.status === 403) {
              toast.error('Acceso no autorizado.')
            } else {
              toast.error('Error de autenticación.')
            }
          }
        }
      } catch (error) {
        // Error de conexión, limpia datos
        console.error('Error validando auth:', error)
        await logout()
        setIsAuthenticated(false)
        // Solo muestra el error una vez
        if (!hasShownError) {
          setHasShownError(true)
          toast.error('Error de conexión. Redirigiendo al login.')
        }
      } finally {
        // Finaliza la validación
        setIsValidating(false)
      }
    }
    validateAuth()
  }, [user, authCookie, logout, hasShownError])

  // Muestra loading mientras valida
  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#E8E1D8]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#A73249] mx-auto mb-4"></div>
          <p className="text-[#3D1609] font-[Nunito]">Verificando sesión...</p>
        </div>
      </div>
    )
  }
  // Si no está autenticado, redirige al login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  // Si está autenticado, muestra el contenido protegido
  return children
}
export default ProtectedRoute