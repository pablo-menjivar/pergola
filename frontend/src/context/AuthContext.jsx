import { createContext, useState, useEffect } from "react"
const API = "https://pergola.onrender.com/api"
const AuthContext = createContext()

// Proveedor de contexto de autenticación
export const AuthProvider = ({ children }) => {
  // Estados para usuario, cookie de autenticación y carga
  const [user, setUser] = useState(null)
  const [authCookie, setAuthCookie] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Función para iniciar sesión
  const Login = async (email, password, rememberMe = false) => {
    try {
      console.log("🔄 Iniciando login...", { email })
      
      // Llama al endpoint de login
      const response = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe }),
        credentials: "include"
      })

      const data = await response.json()
      console.log("📥 Respuesta del servidor:", data)
      
      if (!response.ok) {
        throw new Error(data.message || "Error en la autenticación")
      }

      console.log("✅ Login exitoso, obteniendo info del usuario...")
      
      // Valida el token y obtiene info básica del usuario
      const userInfoResponse = await fetch(`${API}/validateAuthToken`, {
        method: "POST",
        credentials: "include",
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (!userInfoResponse.ok) {
        throw new Error("No se pudo validar el token")
      }
      
      const userInfo = await userInfoResponse.json()
      console.log("📋 Info del usuario obtenida:", userInfo)
      
      // Estructura base del usuario
      let userData = { 
        email, 
        userType: userInfo.userType,
        userId: userInfo.userId,
        id: userInfo.userId,  
        name: userInfo.name || '', 
        lastName: userInfo.lastName || '',
        profilePic: '' 
      }

      // Obtener datos completos según el tipo de usuario
      try {
        let userDataEndpoint = ''
        let useCredentials = true
        
        if (userInfo.userType === 'admin') {
          userDataEndpoint = `${API}/admin/profile/data`
          useCredentials = true
        } else if (userInfo.userType === 'customer') {
          userDataEndpoint = `${API}/customers/${userInfo.userId}`
        } else {
          userDataEndpoint = `${API}/employees/${userInfo.userId}`
        }        
        
        console.log("🔄 Obteniendo datos completos desde:", userDataEndpoint)
        
        const userDataResponse = await fetch(userDataEndpoint, {
          ...(useCredentials && { credentials: 'include' })
        })
        
        if (userDataResponse.ok) {
          const completeUserData = await userDataResponse.json()
          console.log("📊 Datos completos obtenidos:", completeUserData)
          
          // Actualizar userData con datos completos
          userData = {
            ...userData,
            name: completeUserData.name || userData.name,
            lastName: completeUserData.lastName || userData.lastName,
            profilePic: completeUserData.profilePic || '',
            phoneNumber: completeUserData.phoneNumber || '',
            // Para admin, mantener 'admin' como id, para otros usar userId real
            id: userInfo.userType === 'admin' ? 'admin' : userInfo.userId
          }
          console.log("✅ Datos de usuario finales:", userData)
        } else {
          console.log("⚠️ No se pudieron obtener datos completos, usando datos básicos")
        }
      } catch (error) {
        console.log("❌ Error obteniendo datos completos en login:", error)
      }

      // Guardar usuario en localStorage
      localStorage.setItem("user", JSON.stringify(userData))
      
      // Actualizar estado
      setUser(userData)
      setAuthCookie(true)
      
      console.log("🎉 Login completado exitosamente")
      return { success: true, message: data.message, user: userData }
      
    } catch (error) {
      console.log("❌ Login error:", error.message)
      return { success: false, message: error.message }
    }
  }

  // Función para cerrar sesión
  const logout = async () => {
    try {
      // Llama al endpoint de logout para limpiar la cookie
      await fetch(`${API}/logout`, {
        method: "POST",
        credentials: "include", // Para incluir cookies en la petición
      })
      console.log("✅ Server logout successful")
    } catch (error) {
      console.error("❌ Error durante el logout:", error)
    } finally {
      // Limpiar datos locales
      localStorage.removeItem("user")
      setAuthCookie(null)
      setUser(null)
      console.log("🧹 Datos locales limpiados")
    }
  }

  // Verifica autenticación al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("🔍 Verificando autenticación inicial...")
        // Intentar restaurar usuario desde localStorage
        const savedUser = localStorage.getItem("user")
        if (savedUser) {
          console.log("👤 Usuario guardado encontrado, validando sesión...")
          // Verificar si la sesión sigue siendo válida con el servidor
          const response = await fetch(`${API}/validateAuthToken`, {
            method: "POST",
            credentials: "include",
            headers: {
              'Content-Type': 'application/json'
            }
          })
          if (response.ok) {
            const validationData = await response.json()
            const savedUserData = JSON.parse(savedUser)
            console.log("✅ Sesión válida, restaurando usuario")
            // Obtener datos completos incluyendo profilePic
            let completeUserData = savedUserData
            if (validationData.userType === 'admin') {
              try {
                const adminDataResponse = await fetch(`${API}/admin/profile/data`, {
                  credentials: 'include'  // CON credentials aquí
                })
                if (adminDataResponse.ok) {
                  const adminInfo = await adminDataResponse.json()
                  completeUserData = {
                    ...savedUserData,
                    name: adminInfo.name || "Admin",
                    lastName: adminInfo.lastName || "Pérgola",
                    profilePic: adminInfo.profilePic || "",
                    id: "admin",
                    userType: "admin"
                  }
                }
              } catch (error) {
                console.log("Error obteniendo datos de admin en checkAuth:", error)
              }
            } else if (validationData.userType !== 'admin') {
              try {
                let userDataEndpoint = ''
                if (validationData.userType === 'customer') {
                  userDataEndpoint = `${API}/customers/${validationData.userId}`
                } else {
                  userDataEndpoint = `${API}/employees/${validationData.userId}`
                }                
                const userDataResponse = await fetch(userDataEndpoint, {
                  credentials: 'include'
                })
                if (userDataResponse.ok) {
                  const freshUserData = await userDataResponse.json()
                  
                  completeUserData = {
                    ...savedUserData,
                    name: freshUserData.name,
                    lastName: freshUserData.lastName,
                    profilePic: freshUserData.profilePic || '',
                    phoneNumber: freshUserData.phoneNumber,
                    id: validationData.userId,
                    userType: validationData.userType
                  }
                }
              } catch (error) {
                console.log("Error obteniendo datos completos:", error)
              }
            }
            // Actualizar localStorage con datos frescos
            localStorage.setItem("user", JSON.stringify(completeUserData))
            // Sesión válida, restaurar usuario
            setUser(completeUserData)
            setAuthCookie(true) // Indicador de que hay cookie válida
          } else {
            // Sesión inválida, limpiar datos locales
            localStorage.removeItem("user")
            setUser(null)
            setAuthCookie(null)
          }
        } else {
          console.log("📭 No se encontro ningún usuario guardado")
        }
      } catch (error) {
        console.error("❌ Error revisando autenticación:", error)
        // En caso de error, limpiar datos locales
        localStorage.removeItem("user")
        setUser(null)
        setAuthCookie(null)
      } finally {
        console.log("✅ Comprobación de autenticación inicial completada")
        setIsLoading(false)
      }
    }
    checkAuth()
  }, []) // Solo ejecutar una vez al montar

  // Provee el contexto a los componentes hijos
  return (
    <AuthContext.Provider value={{ user, Login,  logout, authCookie, setAuthCookie, setUser, API, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}
// Exporta el contexto para poder usarlo en el hook
export { AuthContext }