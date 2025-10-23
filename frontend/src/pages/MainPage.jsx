import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import Sidebar from '../components/Dashboard/Sidebar'
import Header from '../components/Dashboard/Header'
import Dashboard from '../components/Dashboard/Dashboard'

const MainPage = () => {
  const { user, logout } = useAuth()
  const [currentView, setCurrentView] = useState('dashboard')
  
  console.log("🚨 EMERGENCY MODE - MainPage iniciando")
  console.log("👤 User:", user?.userType)
  console.log("📄 Current view:", currentView)
  
  const handleLogout = async () => {
    await logout()
  }
  
  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <div className="p-6 bg-white min-h-screen font-[Quicksand]">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl font-bold text-[#3D1609] mb-6">
                🚨 Modo de Emergencia
              </h1>
              <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-4 mb-6">
                <h2 className="text-lg font-semibold text-yellow-800 mb-2">
                  Sistema en Recuperación
                </h2>
                <p className="text-yellow-700">
                  La aplicación está funcionando en modo básico mientras se solucionan los problemas técnicos.
                </p>
                <p className="text-yellow-700 mt-2">
                  Usuario actual: <strong>{user?.userType}</strong>
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-[#3D1609] mb-3">Estado del Sistema</h3>
                  <p className="text-green-600">✅ Autenticación: Funcionando</p>
                  <p className="text-yellow-600">⚠️ Tablas: En mantenimiento</p>
                  <p className="text-red-600">❌ Hooks: Deshabilitados temporalmente</p>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-[#3D1609] mb-3">Información del Usuario</h3>
                  <p><strong>Tipo:</strong> {user?.userType || 'No definido'}</p>
                  <p><strong>Email:</strong> {user?.email || 'No disponible'}</p>
                  <p><strong>ID:</strong> {user?._id || 'No disponible'}</p>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-[#3D1609] mb-3">Próximos Pasos</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Revisar hooks individuales</li>
                    <li>• Verificar bucles infinitos</li>
                    <li>• Restaurar funcionalidad gradualmente</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return (
          <div className="p-6 bg-white min-h-screen font-[Quicksand] flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-[#3D1609] mb-4">
                🚧 Sección en Mantenimiento
              </h1>
              <p className="text-gray-600">
                Esta sección estará disponible pronto.
              </p>
              <button 
                onClick={() => setCurrentView('dashboard')}
                className="mt-4 px-4 py-2 bg-[#A73249] text-white rounded-lg hover:bg-[#8B2940]"
              >
                Volver al Dashboard
              </button>
            </div>
          </div>
        )
    }
  }
  
  return (
    <div className="flex h-screen bg-white font-[Quicksand] overflow-hidden">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        onLogout={handleLogout}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onLogout={handleLogout}/>
        <div className="flex-1 overflow-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default MainPage