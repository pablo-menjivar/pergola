import { useEffect, useState, useCallback } from "react"
import { toast } from "react-hot-toast"

// Hook personalizado para manejar la lógica relacionada con proveedores
const useDataSuppliers = () => {
  const API = "https://pergola.onrender.com/api/suppliers"
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)

  // ✅ USAR useCallback para evitar re-creaciones innecesarias
  const fetchSuppliers = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(API, {
        credentials: "include"
      })

      if (response.status === 403) {
        console.log("⚠️ Sin permisos para proveedores - usuario no autorizado")
        setSuppliers([])
        setLoading(false)
        return
      }

      if (!response.ok) {
        throw new Error("Hubo un error al obtener proveedores")
      }

      const data = await response.json()
      setSuppliers(data)
    } catch (error) {
      console.error("Error al obtener proveedores:", error)
      if (!error.message.includes("403") && !error.message.includes("sin permisos")) {
        toast.error("Error al cargar proveedores")
      }
      setSuppliers([])
    } finally {
      setLoading(false)
    }
  }, [API])

  // ✅ useEffect CON DEPENDENCIAS CONTROLADAS
  useEffect(() => {
    let mounted = true
    
    const loadData = async () => {
      if (mounted) {
        await fetchSuppliers()
      }
    }

    loadData()
    
    return () => {
      mounted = false
    }
  }, [fetchSuppliers])

  // ✅ Función fetch unificada
  const fetch = useCallback(async () => {
    try {
      await fetchSuppliers()
    } catch (error) {
      console.error("Error en fetch unificado:", error)
    }
  }, [fetchSuppliers])

  // ✅ Función para eliminar proveedor por ID con useCallback
  const deleteSuppliers = useCallback(async (id) => {
    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      })

      if (!response.ok) {
        throw new Error("Hubo un error al eliminar el proveedor")
      }

      toast.success("Proveedor eliminado exitosamente")
      fetchSuppliers()
    } catch (error) {
      console.error("Error al eliminar proveedores:", error)
      toast.error("Error al eliminar proveedores")
    }
  }, [API, fetchSuppliers])

  // ✅ Handlers protegidos contra errores
  const createHandlers = useCallback((API) => ({
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
  }), [suppliers, loading, fetchSuppliers, deleteSuppliers])

  return {
    suppliers,
    loading,
    fetch,
    deleteSuppliers,
    fetchSuppliers,
    createHandlers
  }
}

export default useDataSuppliers