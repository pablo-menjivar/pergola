import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"

// Hook personalizado para manejar la lógica relacionada con proveedores
const useDataSuppliers = () => {
  const API = "https://pergola.onrender.com/api/suppliers" // URL base para la API de proveedores

  // Estado para almacenar la lista de proveedores
  const [suppliers, setSuppliers] = useState([])

  // Estado para indicar si los datos están cargando
  const [loading, setLoading] = useState(true)

  // Función para obtener proveedores desde la API
  const fetchSuppliers = async () => {
    try {
      const response = await fetch(API, {
        credentials: "include" // Incluir cookies (autenticación)
      })

      // Si el usuario no tiene permisos, no lanzar error
      if (response.status === 403) {
        console.log("⚠️ Sin permisos para proveedores - usuario no autorizado")
        setSuppliers([])
        setLoading(false)
        return
      }

      // Si la respuesta no fue exitosa, lanzar error
      if (!response.ok) {
        throw new Error("Hubo un error al obtener proveedores")
      }

      // Guardar los proveedores obtenidos
      const data = await response.json()
      setSuppliers(data)
      setLoading(false)
    } catch (error) {
      console.error("Error al obtener proveedores:", error)

      // Mostrar toast solo si el error no es por falta de permisos
      if (!error.message.includes("403") && !error.message.includes("sin permisos")) {
        toast.error("Error al cargar proveedores")
      }

      setLoading(false)
    }
  }

  // Ejecutar `fetchSuppliers` una vez al montar el componente
  useEffect(() => {
    fetchSuppliers()
  }, [])

  // Función para manejar la lógica de crear, editar y eliminar proveedores
  const createHandlers = (API) => ({
    data: suppliers,
    loading,

    // Agregar un nuevo proveedor
    onAdd: async (data) => {
      try {
        const response = await fetch(`${API}/suppliers`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data) // Enviar datos en formato JSON
        })

        // Validar respuesta
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al registrar proveedor")
        }

        toast.success("Proveedor registrado exitosamente")
        fetchSuppliers() // Recargar lista
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al registrar proveedor")
        throw error
      }
    },

    // Editar proveedor existente
    onEdit: async (id, data) => {
      try {
        const response = await fetch(`${API}/suppliers/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data)
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al actualizar proveedor")
        }

        toast.success("Proveedor actualizado exitosamente")
        fetchSuppliers()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al actualizar proveedor")
        throw error
      }
    },

    // Eliminar proveedor
    onDelete: deleteSuppliers
  })

  // Función para eliminar proveedor por ID
  const deleteSuppliers = async (id) => {
    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      })

      // Si la respuesta no fue exitosa, lanzar error
      if (!response.ok) {
        throw new Error("Hubo un error al eliminar el proveedor")
      }

      toast.success("Proveedor eliminado exitosamente")
      fetchSuppliers() // Actualizar lista después de borrar
    } catch (error) {
      console.error("Error al eliminar proveedores:", error)
      toast.error("Error al eliminar proveedores")
    }
  }

  // Valores y funciones que expone el hook
  return {
    suppliers,
    loading,
    deleteSuppliers,
    fetchSuppliers,
    createHandlers
  }
}

export default useDataSuppliers
