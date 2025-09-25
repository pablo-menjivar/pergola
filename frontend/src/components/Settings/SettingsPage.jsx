import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useLanguage, useTranslation } from '../../context/LanguageContext'
import { useEmailNotifications } from '../../hooks/useEmailNotifications.js'
import { useTheme } from '../../context/ThemeContext'
import { toast } from 'react-hot-toast'
import { User, Camera, Mail, Phone, Shield, Palette, Moon, Sun, Bell, Save, Eye, EyeOff } from 'lucide-react'

const SettingsPage = () => {
  const { user, API, setUser } = useAuth()
  const { isDarkMode, toggleDarkMode } = useTheme()
  const { language, changeLanguage } = useLanguage()
  const { t } = useTranslation()
  const { emailNotifications, loading: emailLoading, toggleEmailNotifications } = useEmailNotifications()
  const fileInputRef = useRef(null)

  // Estados para la información del perfil
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    profilePic: user?.profilePic || ''
  })

  // Estados para notificaciones del navegador
  const [browserNotifications, setBrowserNotifications] = useState('default')

  // Estado para el cambio de contraseña
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Estado para mostrar/ocultar contraseñas
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [hasChanges, setHasChanges] = useState(false)

  // Verificar estado de notificaciones del navegador
  useEffect(() => {
    if ('Notification' in window) {
      setBrowserNotifications(Notification.permission)
    }
  }, [])
  // Detectar cambios en los datos del perfil
  useEffect(() => {
    const hasProfileChanges = 
      profileData.name !== (user?.name || '') ||
      profileData.lastName !== (user?.lastName || '') ||
      profileData.email !== (user?.email || '') ||
      profileData.phoneNumber !== (user?.phoneNumber || '')
    
    setHasChanges(hasProfileChanges)
  }, [profileData, user])
  // Manejar notificaciones del navegador
  const handleBrowserNotifications = async () => {
    if (!('Notification' in window)) {
      toast.error('Tu navegador no soporta notificaciones')
      return
    }

    if (Notification.permission === 'granted') {
      setBrowserNotifications('granted')
      new Notification('Notificaciones activadas', {
        body: 'Recibirás notificaciones importantes',
      })
    } else if (Notification.permission === 'denied') {
      toast.error('Las notificaciones están bloqueadas. Actívalas en la configuración del navegador.')
    } else {
      const permission = await Notification.requestPermission()
      setBrowserNotifications(permission)
      
      if (permission === 'granted') {
        toast.success('Notificaciones activadas')
        new Notification('¡Bienvenido!', {
          body: 'Las notificaciones han sido configuradas correctamente',
        })
      } else {
        toast.error('Permisos de notificación denegados')
      }
    }
  }

  // Función para mostrar notificación de prueba
  const showTestNotification = () => {
    const isEdge = /Edg/.test(navigator.userAgent)
  
    if (isEdge) {
      toast.success('🔔 Edge detectado: Las notificaciones pueden no mostrarse en localhost. Revisa el centro de notificaciones de Windows o prueba en Chrome.')
      new Notification('Pergola Test', { body: 'Prueba en Edge' })
    } else {
      new Notification('💎 Pergola Test', {
        body: 'Esta es una notificación de prueba',
        icon: '/vite.svg'
      })
      toast.success('Notificación enviada')
    }
  }

  // Manejar cambio de foto de perfil
  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona un archivo de imagen válido')
      return
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen no puede ser mayor a 5MB')
      return
    }

    try {
      setIsLoading(true)
      const formData = new FormData()
      formData.append('profilePic', file)

      // Determinar el endpoint según el tipo de usuario
      let endpoint = ''
      if (user.userType === 'admin') {
        endpoint = `https://pergola-production.up.railway.app/api/admin/profile`
      } else if (user.userType === 'customer') {
        endpoint = `${API}/customers/${user.id}`
      } else {
        endpoint = `${API}/employees/${user.id}`
      }

      const response = await fetch(endpoint, {
        method: 'PUT',
        credentials: 'include',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Error al subir la imagen')
      }

      // Manejar la respuesta del servidor según el tipo de usuario
      if (user.userType === 'admin') {
        const responseData = await response.json()
        const newProfilePic = responseData.user?.profilePic || ''
        setProfileData(prev => ({ ...prev, profilePic: newProfilePic }))
        
        const updatedUser = { ...user, profilePic: newProfilePic }
        localStorage.setItem("user", JSON.stringify(updatedUser))
        setUser(updatedUser)
      } else {
        await response.text()
        
        let userDataEndpoint = ''
        if (user.userType === 'customer') {
          userDataEndpoint = `${API}/customers/${user.id}`
        } else {
          userDataEndpoint = `${API}/employees/${user.id}`
        }

        const userDataResponse = await fetch(userDataEndpoint, {
          credentials: 'include'
        })

        if (userDataResponse.ok) {
          const freshUserData = await userDataResponse.json()
          setProfileData(prev => ({ ...prev, profilePic: freshUserData.profilePic }))
          const updatedUser = { ...user, profilePic: freshUserData.profilePic }
          localStorage.setItem("user", JSON.stringify(updatedUser))
          setUser(updatedUser)
        }
      }

      toast.success('Foto de perfil actualizada correctamente')
    } catch (error) {
      console.error('Error al subir imagen:', error)
      toast.error('Error al actualizar la foto de perfil')
    } finally {
      setIsLoading(false)
    }
  }
  // Manejar eliminación de foto de perfil
const handleDeleteProfilePic = async () => {
  if (!profileData.profilePic) {
    toast.error('No hay foto de perfil para eliminar')
    return
  }
  if (!window.confirm('¿Estás seguro de que quieres eliminar tu foto de perfil?')) {
    return
  }
  try {
    setIsLoading(true)
    // Determinar el endpoint según el tipo de usuario
    let endpoint = ''
    if (user.userType === 'admin') {
      endpoint = `https://pergola-production.up.railway.app/api/admin/profile/delete-profile-pic`
    } else {
      endpoint = `${API}/employees/${user.id}/delete-profile-pic`
    }
    const response = await fetch(endpoint, {
      method: 'DELETE',
      credentials: 'include'
    })
    if (!response.ok) {
      throw new Error('Error al eliminar la foto de perfil')
    }
    // Actualizar el estado local y localStorage
    setProfileData(prev => ({ ...prev, profilePic: '' }))
    const updatedUser = { ...user, profilePic: '' }
    localStorage.setItem("user", JSON.stringify(updatedUser))
    setUser(updatedUser)

    toast.success('Foto de perfil eliminada correctamente')
  } catch (error) {
    console.error('Error al eliminar foto:', error)
    toast.error('Error al eliminar la foto de perfil')
  } finally {
    setIsLoading(false)
  }
}
  // Manejar actualización del perfil
  const handleProfileUpdate = async () => {
    try {
      setIsLoading(true)

      // Validaciones básicas
      if (!profileData.name || !profileData.lastName || !profileData.email) {
        toast.error('Por favor completa todos los campos obligatorios')
        return
      }
      // Determinar el endpoint según el tipo de usuario
      let endpoint = ''
      if (user.userType === 'admin') {
        endpoint = `${API.replace('/api', '')}/api/admin/profile`
      } else {
        endpoint = `${API}/employees/${user.id}`
      }
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          name: profileData.name,
          lastName: profileData.lastName,
          email: profileData.email,
          phoneNumber: profileData.phoneNumber
        })
      })

      if (!response.ok) {
        throw new Error('Error al actualizar el perfil')
      }

      if (user.userType === 'admin') {
        const responseData = await response.json()
        const updatedUser = { 
          ...user, 
          name: profileData.name,
          lastName: profileData.lastName,
          profilePic: responseData.user?.profilePic || user.profilePic
        }
        localStorage.setItem("user", JSON.stringify(updatedUser))
        setUser(updatedUser)
      }

      toast.success('Perfil actualizado correctamente')
    } catch (error) {
      console.error('Error al actualizar perfil:', error)
      toast.error('Error al actualizar el perfil')
    } finally {
      setIsLoading(false)
    }
  }

  // Manejar cambio de contraseña
  const handlePasswordChange = async () => {
    try {
      // Validaciones
      if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
        toast.error('Por favor completa todos los campos de contraseña')
        return
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast.error('Las contraseñas nuevas no coinciden')
        return
      }

      if (passwordData.newPassword.length < 8) {
        toast.error('La nueva contraseña debe tener al menos 8 caracteres')
        return
      }

      setIsLoading(true)

      let endpoint = ''
      let body = {}

      if (user.userType === 'admin') {
        endpoint = `${API.replace('/api', '')}/api/admin/profile/password`
        body = {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        }
      } else {
        // Validar contraseña actual primero para no-admin
        const validateResponse = await fetch(`${API.replace('/api', '')}/api/validatePassword`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ currentPassword: passwordData.currentPassword })
        })

        if (!validateResponse.ok) {
          toast.error('Contraseña actual incorrecta')
          return
        }

        if (user.userType === 'customer') {
          endpoint = `${API}/customers/${user.userId || user.id}`
        } else {
          endpoint = `${API}/employees/${user.userId || user.id}`
        }
        body = { password: passwordData.newPassword }
      }

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body)
      })

      if (!response.ok) {
        throw new Error('Error al cambiar la contraseña')
      }

      toast.success('Contraseña cambiada correctamente')
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      console.error('Error al cambiar contraseña:', error)
      toast.error('Error al cambiar la contraseña')
    } finally {
      setIsLoading(false)
    }
  }

  const tabs = [
    { id: 'profile', label: t('profile') || 'Perfil', icon: User },
    { id: 'security', label: t('security') || 'Seguridad', icon: Shield },
    { id: 'preferences', label: t('preferences') || 'Preferencias', icon: Palette }
  ]

  return (
    <div className={`p-6 min-h-screen font-[Quicksand] transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className="max-w-4xl mx-auto">
        {/* Encabezado */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-[#3D1609]'}`}>
            ⚙️ {t('settings') || 'Configuración'}
          </h1>
          <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
            {t('personalizeProfile') || 'Personaliza tu perfil y preferencias'}
          </p>
        </div>

        {/* Tabs de navegación */}
        <div className={`flex space-x-1 mb-8 p-1 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
          {tabs.map(tab => { 
            const IconComponent = tab.icon
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all flex-1 justify-center ${
                  activeTab === tab.id ? isDarkMode  ? 'bg-gray-700 text-[#A73249] shadow-sm' : 'bg-white text-[#A73249] shadow-sm' : isDarkMode ? 'text-gray-300 hover:text-[#A73249]' : 'text-gray-600 hover:text-[#A73249]' }`}>
                <IconComponent className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Contenido de las tabs */}
        <div className={`rounded-xl shadow-sm border overflow-hidden ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          {/* Tab: Perfil */}
          {activeTab === 'profile' && (
            <div className="p-6">
              <h2 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-[#3D1609]'}`}>
                {t('profileInformation') || 'Información del Perfil'}
              </h2>
              
              {/* Foto de perfil y botón de cambio */}
              <div className="flex items-center space-x-6 mb-8">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg border-4 border-white">
                    {profileData.profilePic ? (
                      <img src={profileData.profilePic} alt="Perfil" className="w-full h-full object-cover" onError={(e) => { 
                          e.target.style.display = 'none'
                          e.target.nextSibling.style.display = 'flex' 
                        }}/>
                    ) : null}
                    <div className={`w-full h-full bg-gradient-to-br from-[#A73249] to-[#D4667A] flex items-center justify-center text-white text-2xl font-bold ${profileData.profilePic ? 'hidden' : 'flex'}`} style={{ display: profileData.profilePic ? 'none' : 'flex' }}>
                      {`${profileData.name?.charAt(0) || user?.name?.charAt(0) || 'U'}${profileData.lastName?.charAt(0) || user?.lastName?.charAt(0) || ''}`}
                    </div>
                  </div>
                  {/* Botones de cámara y eliminar */}
                  <div className="absolute -bottom-2 -right-2 flex space-x-1">
                    {/* Botón eliminar foto (solo si hay foto) */}
                    {profileData.profilePic && (
                      <button 
                        onClick={handleDeleteProfilePic} 
                        disabled={isLoading} 
                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg disabled:opacity-50 group"
                        title="Eliminar foto de perfil"
                      >
                        {isLoading ? (
                          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                        ) : (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </button>
                    )}
                    {/* Botón cambiar foto */}
                    <button 
                      onClick={() => fileInputRef.current?.click()} 
                      disabled={isLoading} 
                      className="bg-[#A73249] text-white p-2 rounded-full hover:bg-[#8A2A3E] transition-colors shadow-lg disabled:opacity-50 group"
                      title="Cambiar foto de perfil"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                      ) : (
                        <Camera className="w-4 h-4 group-hover:scale-110 transition-transform"/>
                      )}
                    </button>
                  </div>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden"/>
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-[#3D1609]'}`}>
                    {profileData.name} {profileData.lastName}
                  </h3>
                  <p className={`capitalize ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {user?.userType}
                  </p>
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {t('clickCameraIcon') || 'Haz clic en el ícono de cámara para cambiar tu foto'}
                  </p>
                </div>
              </div>

              {/* Formulario de perfil */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-[#3D1609]'}`}>
                    {t('name') || 'Nombre'} *
                  </label>
                  <div className="relative">
                    <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                    <input type="text" value={profileData.name} onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))} className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#A73249] focus:border-transparent ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`} placeholder={t('yourName') || 'Tu nombre'}/>
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-[#3D1609]'}`}>
                    {t('lastName') || 'Apellido'} *
                  </label>
                  <div className="relative">
                    <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                    <input type="text" value={profileData.lastName} onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))} className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#A73249] focus:border-transparent ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`} placeholder={t('yourLastName') || 'Tu apellido'}/>
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-[#3D1609]'}`}>
                    {t('email') || 'Email'} *
                  </label>
                  <div className="relative">
                    <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                    <input type="email" value={profileData.email} onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))} className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#A73249] focus:border-transparent ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`} placeholder="tu@email.com" disabled={user.userType === 'admin'}/>
                  </div>
                </div>
                {/* Campo teléfono solo para usuarios no admin */}
                {user?.userType !== 'admin' && (
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-[#3D1609]'}`}>
                      {t('phone') || 'Teléfono'}
                    </label>
                    <div className="relative">
                      <Phone className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                      <input type="tel" value={profileData.phoneNumber} onChange={(e) => setProfileData(prev => ({ ...prev, phoneNumber: e.target.value }))} className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#A73249] focus:border-transparent ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`} placeholder="0000-0000"/>
                    </div>
                  </div>
                )}
              </div>
              {/* Botón para actualizar perfil */}
              <button onClick={handleProfileUpdate} disabled={isLoading || !hasChanges} className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
                  hasChanges && !isLoading 
                    ? 'bg-[#A73249] text-white hover:bg-[#8A2A3E]' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                } ${isDarkMode && hasChanges && !isLoading ? 'bg-[#A73249] hover:bg-[#8A2A3E]' : ''} ${isDarkMode && (!hasChanges || isLoading) ? 'bg-gray-600 text-gray-400' : ''}`}>
                <Save className="w-4 h-4" />
                <span>
                  {isLoading 
                    ? (t('saving') || 'Guardando...') 
                    : hasChanges 
                      ? (t('saveChanges') || 'Guardar Cambios')
                      : (t('noChanges') || 'Sin Cambios')
                  }
                </span>
              </button>
            </div>
          )}

          {/* Tab: Seguridad */}
          {activeTab === 'security' && (
            <div className="p-6">
              <h2 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-[#3D1609]'}`}>
                {t('security') || 'Seguridad'}
              </h2>

              {/* Aviso sobre cambio de contraseña */}
              <div className={`border rounded-lg p-4 mb-6 ${isDarkMode ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-200'}`}>
                <h3 className={`font-medium mb-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                  {t('changePassword') || 'Cambiar Contraseña'}
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                  {t('passwordRequirements') || 'Asegúrate de usar una contraseña segura con al menos 8 caracteres.'}
                </p>
              </div>

              {/* Formulario de cambio de contraseña */}
              <div className="space-y-4 mb-6">
                {/* Campo contraseña actual */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-[#3D1609]'}`}>
                    {t('currentPassword') || 'Contraseña Actual'}
                  </label>
                  <div className="relative">
                    <Shield className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                    <input type={showPasswords.current ? 'text' : 'password'} value={passwordData.currentPassword} onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))} className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-[#A73249] focus:border-transparent ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`} placeholder={t('yourCurrentPassword') || 'Tu contraseña actual'}/>
                    <button type="button" onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))} className={`absolute right-3 top-1/2 transform -translate-y-1/2 hover:text-gray-600 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}>
                      {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Campo nueva contraseña */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-[#3D1609]'}`}>
                    {t('newPassword') || 'Nueva Contraseña'}
                  </label>
                  <div className="relative">
                    <Shield className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                    <input type={showPasswords.new ? 'text' : 'password'} value={passwordData.newPassword} onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))} className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-[#A73249] focus:border-transparent ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`} placeholder={t('newPasswordPlaceholder') || 'Nueva contraseña (mín. 8 caracteres)'}/>
                    <button type="button" onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))} className={`absolute right-3 top-1/2 transform -translate-y-1/2 hover:text-gray-600 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}>
                      {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Campo confirmar nueva contraseña */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-[#3D1609]'}`}>
                    {t('confirmPassword') || 'Confirmar Nueva Contraseña'}
                  </label>
                  <div className="relative">
                    <Shield className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                    <input type={showPasswords.confirm ? 'text' : 'password'} value={passwordData.confirmPassword} onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))} className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-[#A73249] focus:border-transparent ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'}`} placeholder={t('confirmPasswordPlaceholder') || 'Confirma tu nueva contraseña'}/>
                    <button type="button" onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))} className={`absolute right-3 top-1/2 transform -translate-y-1/2 hover:text-gray-600 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}>
                      {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Botón para cambiar contraseña */}
              <button onClick={handlePasswordChange} disabled={isLoading} className="flex items-center space-x-2 bg-[#A73249] text-white px-6 py-3 rounded-lg hover:bg-[#8A2A3E] transition-colors disabled:opacity-50">
                <Shield className="w-4 h-4" />
                <span>{isLoading ? (t('changing') || 'Cambiando...') : (t('changePassword') || 'Cambiar Contraseña')}</span>
              </button>
            </div>
          )}

          {/* Tab: Preferencias */}
          {activeTab === 'preferences' && (
            <div className="p-6">
              <h2 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-[#3D1609]'}`}>
                {t('preferences') || 'Preferencias'}
              </h2>

              <div className="space-y-6">
                {/* Preferencia de tema */}
                <div className={`flex items-center justify-between p-4 border rounded-lg ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200'}`}>
                  <div className="flex items-center space-x-3">
                    {isDarkMode ?
                      <Moon className="w-5 h-5 text-blue-400" /> :
                      <Sun className="w-5 h-5 text-yellow-500" />
                    }
                    <div>
                      <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-[#3D1609]'}`}>{t('theme') || 'Tema'}</h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>{t('themeDescription') || 'Claro u oscuro'}</p>
                    </div>
                  </div>
                  {/* Switch de tema */}
                  <button onClick={toggleDarkMode} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${ isDarkMode ? 'bg-[#A73249]' : 'bg-gray-300' }`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${ isDarkMode ? 'translate-x-6' : 'translate-x-1' }`}/>
                  </button>
                </div>

                {/* Preferencia de idioma */}
                <div className={`flex items-center justify-between p-4 border rounded-lg ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200'}`}>
                  <div className="flex items-center space-x-3">
                    <Palette className="w-5 h-5 text-purple-500" />
                    <div>
                      <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-[#3D1609]'}`}>{t('language') || 'Idioma'}</h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>{t('languageDescription') || 'Idioma de la interfaz'}</p>
                    </div>
                  </div>
                  <select value={language} onChange={(e) => changeLanguage(e.target.value)} className={`border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#A73249] focus:border-transparent ${isDarkMode ? 'bg-gray-600 border-gray-500 text-white' : 'border-gray-300'}`}>
                    <option value="es">🇪🇸 {t('spanish') || 'Español'}</option>
                    <option value="en">🇺🇸 {t('english') || 'English'}</option>
                  </select>
                </div>

                {/* Preferencia de notificaciones por email */}
                <div className={`flex items-center justify-between p-4 border rounded-lg ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200'}`}>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-green-500" />
                    <div>
                      <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-[#3D1609]'}`}>{t('emailNotifications') || 'Notificaciones por Email'}</h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        {emailNotifications ? 
                          (t('emailNotificationsOn') || 'Recibirás notificaciones por email') : 
                          (t('emailNotificationsOff') || 'No recibirás notificaciones por email')
                        }
                      </p>
                    </div>
                  </div>
                  {/* Switch de notificaciones email */}
                  <button onClick={toggleEmailNotifications} disabled={emailLoading} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${ emailNotifications ? 'bg-[#A73249]' : 'bg-gray-300' } ${emailLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${ emailNotifications ? 'translate-x-6' : 'translate-x-1' }`}/>
                  </button>
                </div>

                {/* Preferencia de notificaciones del navegador */}
                <div className={`flex items-center justify-between p-4 border rounded-lg ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200'}`}>
                  <div className="flex items-center space-x-3">
                    <Bell className="w-5 h-5 text-blue-500" />
                    <div>
                      <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-[#3D1609]'}`}>{t('browserNotifications') || 'Notificaciones del Navegador'}</h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        {browserNotifications === 'granted' ? 
                          (t('browserNotificationsEnabled') || 'Notificaciones activadas') :
                          browserNotifications === 'denied' ?
                          (t('browserNotificationsBlocked') || 'Notificaciones bloqueadas') :
                          (t('browserNotificationsDisabled') || 'Notificaciones desactivadas')
                        }
                      </p>
                    </div>
                  </div>
                  {/* Botón para activar notificaciones navegador */}
                  <button onClick={browserNotifications === 'granted' ? showTestNotification : handleBrowserNotifications} className={`px-4 py-2 text-white text-sm rounded-lg transition-colors ${ browserNotifications === 'granted' ? 'bg-[#A73249] hover:bg-[#8A2A3E]' : 'bg-[#A73249] hover:bg-[#8A2A3E]' }`}>
                    {browserNotifications === 'granted' ? 
                      (t('testNotification') || 'Probar') :
                      (t('enableNotifications') || 'Activar')
                    }
                  </button>
                </div>

                {/* Información de sesión del usuario */}
                <div className={`p-4 rounded-lg border-l-4 border-l-[#A73249] ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <h4 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-[#3D1609]'}`}>👤 Información de Sesión</h4>
                  <div className={`text-sm space-y-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <p>📧 Email: <span className="font-medium">{user?.email || 'No disponible'}</span></p>
                    <p>🏷️ Tipo de Usuario: <span className="font-medium capitalize">{user?.userType || 'No disponible'}</span></p>
                    <p>🆔 ID: <span className="font-medium">{user?.id || 'No disponible'}</span></p>
                    <p>🎨 Tema: <span className="font-medium">{isDarkMode ? (t('dark') || 'Oscuro') : (t('light') || 'Claro')}</span></p>
                    <p>🌍 Idioma: <span className="font-medium">{language === 'es' ? (t('spanish') || 'Español') : (t('english') || 'English')}</span></p>
                  </div>
                </div>
              </div>

              {/* Tips y estado actual */}
              <div className={`mt-8 p-4 border rounded-lg ${ isDarkMode ? 'bg-green-900/30 border-green-700' : 'bg-green-50 border-green-200' }`}>
                <p className={`text-sm ${ isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
                  💡 <strong>{t('tips') || 'Tips'}:</strong>
                </p>
                <ul className={`text-sm mt-2 space-y-1 ${ isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                  <li>• {t('tip1') || 'Las configuraciones se guardan automáticamente'}</li>
                  <li>• {t('tip2') || 'Puedes probar las notificaciones con el botón "Probar"'}</li>
                  <li>• {t('tip3') || 'El tema se aplica inmediatamente en toda la aplicación'}</li>
                  <li>• {t('tip4') || 'El idioma cambia toda la interfaz de usuario'}</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SettingsPage