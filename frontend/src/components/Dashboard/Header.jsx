import { Bell } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth.js'

// Componente Header para el dashboard
const Header = () => {
  // Obtiene el usuario autenticado
  const { user } = useAuth();

  // Función para obtener el nombre a mostrar en el saludo y perfil
  const getDisplayName = () => {
    if (!user) return 'Usuario' // Si no hay usuario, mostrar "Usuario"
    if (user.name) {
      return user.name // Si tiene nombre, mostrarlo
    }
    if (user.email === 'thehillsami@gmail.com') {
      return 'Admin' // Si es el email del admin, mostrar "Admin"
    }
    // Para otros usuarios, extraer el nombre del email
    const emailName = user.email.split('@')[0]
    return emailName.charAt(0).toUpperCase() + emailName.slice(1)
  }

  // Función para mostrar el rol del usuario
  const getUserRole = () => {
    if (!user) return 'Empleado' // Si no hay usuario, mostrar "Empleado"
    // Mapear userType a texto legible
    const roleMap = {
      'admin': 'Administrador',
      'employee': 'Colaborador',
    }
    return roleMap[user.userType] || 'Empleado'
  }

  return (
    <div className="bg-[#E3C6B8] px-6 py-4 flex items-center justify-between font-[Quicksand] border-b border-[#3D1609]/10 shadow-sm">
      {/* Lado izquierdo - Saludo y estadisticas */}
      <div className="flex-1">
        <h1 className="text-xl font-bold text-[#3D1609] mb-1">
          Bienvenido de vuelta, {getDisplayName()}
        </h1>
        <p className="text-sm text-[#3D1609]/70">
          ¡Aquí están las estadísticas del inventario de la tienda en línea!
        </p>
      </div>
      {/* Lado derecho - Usuario autenticado */}
      <div className="flex items-center space-x-4">
        {/* Perfil de usuario */}
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <div className="text-sm font-semibold text-[#3D1609]">{getDisplayName()}</div>
            <div className="text-xs text-[#3D1609]/70">{getUserRole()}</div>
          </div>
          {/* Avatar */}
          <div className="relative group cursor-pointer">
            <button className="w-10 h-10 rounded-full flex items-center justify-center hover:shadow-lg transition-all duration-200 transform hover:scale-105 overflow-hidden">
              {/* Si el usuario tiene foto de perfil, mostrarla */}
              {user?.profilePic ? (
                <img src={user.profilePic} alt="Perfil" className="w-full h-full object-cover rounded-full" onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }} />
              ) : null}
              {/* Si no tiene foto, mostrar inicial */}
              <div className={`w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold ${user?.profilePic ? 'hidden' : 'flex'}`} style={{ display: user?.profilePic ? 'none' : 'flex' }}>
                {getDisplayName().charAt(0).toUpperCase()}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Header