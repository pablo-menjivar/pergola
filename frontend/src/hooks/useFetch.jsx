// Hook personalizado para manejar peticiones de autenticación (login)
const useFetch =()=> {
    const API = 'https://pergola-production.up.railway.app/api' // URL base de la API

    // Función para iniciar sesión
    const useLogin = async (email, password)=>{
        // Realiza la petición POST al endpoint de login
        const response = await fetch(`${API}/login`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
        // Si la respuesta no es exitosa, lanza error
        if (!response.ok) {
            throw new Error('Error en la autenticación: ' + response.statusText)
        }
        // Obtiene los datos de la respuesta
        const data = await response.json()
        
        alert(data.message) // Muestra mensaje recibido (puede ser éxito o error)
        return data // Devuelve los datos del login
    }
    // Retorna la función de login para usar en componentes
    return { useLogin }
}
export default useFetch