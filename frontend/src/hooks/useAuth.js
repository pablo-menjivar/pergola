import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
    // Obtiene el contexto de autenticación
    const context = useContext(AuthContext)
    
    // Si el contexto no existe, lanza error (debe estar dentro de AuthProvider)
    if (!context) {
        console.error("❌ useAuth debe ser usado dentro de AuthProvider")
        throw new Error("useAuth debe ser usado dentro de AuthProvider")
    }
    
    // Muestra información útil en consola para depuración
    console.log("🔍 useAuth context:", { 
        hasUser: !!context.user, 
        userType: context?.user?.userType,
        isLoading: context.isLoading 
    })
    
    // Retorna el contexto para usar en componentes
    return context
}