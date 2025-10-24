import { useEffect, useState, useCallback } from "react"
import { toast } from "react-hot-toast"

// Hook personalizado para manejar datos de proveedor
const useDataSuppliers = () => {
  const API = "https://pergola.onrender.com/api/suppliers"
  // Estado para almacenar proveedor y estado de carga
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchSuppliers = useCallback(async () => {
    try {
      setLoading(true)
      const response = await window.fetch(API, { 
        credentials: "include"
      })
      
      if (response.status === 403) {
        console.log("Sin permisos para proveedores")
        setSuppliers([])
        return
      }
      
      if (!response.ok) {
        throw new Error("Hubo un error al obtener los proveedores")
      }
      
      const data = await response.json()
      setSuppliers(data)
    } catch (error) {
      console.error("Error al obtener proveedores:", error)
      if (!error.message.includes("403")) {
        toast.error("Error al cargar proveedores")
      }
      setSuppliers([])
    } finally {
      setLoading(false)
    }
  }, []) 
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
  }, [])

  // Función fetch unificada con protección contra errores
  const refreshData = useCallback(async () => {
    try {
      await fetchSuppliers()
    } catch (error) {
      console.error("Error en refresh:", error)
    }
  }, [fetchSuppliers])

  // Borra proveedor por ID con useCallback
  const deleteSuppliers = useCallback(async (id) => {
    try {
      const response = await window.fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      })
      if (!response.ok) {
        throw new Error("Hubo un error al eliminar el proveedor")
      }
      toast.success('Proveedor eliminado exitosamente')
      await fetchSuppliers()
    } catch (error) {
      console.error("Error al eliminar proveedor:", error)
      toast.error("Error al eliminar proveedor")
    }
  }, [fetchSuppliers]) 

  // Crea los handlers para agregar, editar y eliminar proveedores
  const createHandlers = useCallback((API) => ({
    data: suppliers,
    loading,
    // Handler para agregar proveedor
    onAdd: async (data) => {
      try {
        const response = await window.fetch(`${API}/suppliers`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data)
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al registrar proveedor")
        }
        toast.success('Proveedor registrado exitosamente')
        await fetchSuppliers()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al registrar proveedor")
        throw error
      }
    },
    // Handler para editar proveedor
    onEdit: async (id, data) => {
      try {
        const response = await window.fetch(`${API}/suppliers${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data)
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al registrar proveedor")
        }
        toast.success('Proveedor registrado exitosamente')
        await fetchSuppliers()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al actualizar proveedor")
        throw error
      }
    },
  // Handler para eliminar proveedor
  onDelete: deleteSuppliers
  }), [suppliers, loading, fetchSuppliers, deleteSuppliers])

  return {
    suppliers,
    loading,
    fetch: refreshData,
    deleteSuppliers,
    fetchSuppliers,
    createHandlers
  }
}
// Exporta el hook para su uso en otros componentes
export default useDataSuppliers