import { createContext, useState, useEffect } from "react"
const API = "https://pergola-production.up.railway.app/api"
const AuthContext = createContext()

// Proveedor de contexto de autenticación
export const AuthProvider = ({ children }) => {
  // Estados para usuario, cookie de autenticación y carga
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Función para iniciar sesión
  const Login = async (email, password, rememberMe = false) => {
    try {      
      // Llama al endpoint de login
      const response = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe }),
        credentials: "include"
      })
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || "Error en la autenticación")
      }
      // Pequeño retraso para garantizar que la cookie se configure correctamente
      await new Promise(resolve => setTimeout(resolve, 100))
      // Valida el token y obtiene info básica del usuario
      const userInfoResponse = await fetch(`${API}/validateAuthToken`, {
        method: "POST",
        credentials: "include",
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (!userInfoResponse.ok) throw new Error("No se pudo validar el token")
      const userInfo = await userInfoResponse.json()
      
      // Estructura base del usuario
      let userData = { 
        email, 
        userType: userInfo.userType,
        userId: userInfo.userId,
        id: userInfo.userId,  
        name: userInfo.name || '', 
        lastName: userInfo.lastName || '',
        profilePic: userInfo.profilePic || '' 
      }
      // Obtener datos completos según el tipo de usuario
      try {
        let userDataEndpoint = ''
        let useCredentials = true
        
        if (userInfo.userType === 'admin') {
          userDataEndpoint = `${API}/admin/profile/data`
          useCredentials = true
        } else {
          userDataEndpoint = `${API}/employees/${userInfo.userId}`
        }        
        console.log("🔄 Obteniendo datos completos desde:", userDataEndpoint)
        
        const userDataResponse = await fetch(userDataEndpoint, {
          ...(useCredentials && { credentials: 'include' })
        })
        
        if (userDataResponse.ok) {
          const completeUserData = await userDataResponse.json()          
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
        } else {
          console.warn("⚠️ No se pudieron obtener datos completos, usando datos básicos")
        }
      } catch (error) {
        console.warn("⚠️ No se pudieron obtener datos completos, usando datos básicos")
      }
      // Actualizar estado
      setUser(userData)
      return { success: true, message: data.message, user: userData }      
    } catch (error) {
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
    } catch (error) {
    } finally {
      // Limpiar estado y cookie
      setUser(null)
    }
  }

  // Verifica autenticación al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Verificar si la sesión sigue siendo válida con el servidor
        const response = await fetch(`${API}/validateAuthToken`, {
          method: "POST",
          credentials: "include",
          headers: { 'Content-Type': 'application/json' }
        })
        if (response.ok) {
          const validationData = await response.json()

          let userData = {
            email: validationData.email,
            userType: validationData.userType,
            userId: validationData.userId,
            id: validationData.userType === "admin" ? "admin" : validationData.userId,
            name: validationData.name || "",
            lastName: validationData.lastName || "",
            profilePic: validationData.profilePic || "",
          }
          // Cargar datos completos
          let endpoint = ""
          if (validationData.userType === "admin") {
            endpoint = `${API}/admin/profile/data`
          } else if (validationData.userType === "customer") {
            endpoint = `${API}/customers/${validationData.userId}`
          } else {
            endpoint = `${API}/employees/${validationData.userId}`
          }
          const extraRes = await fetch(endpoint, { credentials: "include" })
          if (extraRes.ok) {
            const extraData = await extraRes.json()
            userData = {
              ...userData,
              ...extraData,
              id: validationData.userType === "admin" ? "admin" : validationData.userId,
            }
          }
          setUser(userData)
        } else {
          // Sesión inválida
          setUser(null)
        }
      } catch (error) {
        // En caso de error
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, []) // Solo ejecutar una vez al montar
  // Provee el contexto a los componentes hijos
  return (
    <AuthContext.Provider value={{ user, Login, logout, API, isLoading  }}>
      {children}
    </AuthContext.Provider>
  )
}
// Exporta el contexto para poder usarlo en el hook
export { AuthContext }