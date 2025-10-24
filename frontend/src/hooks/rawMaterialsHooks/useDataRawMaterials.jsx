import { useEffect, useState, useCallback } from "react"
import { toast } from "react-hot-toast"

// Hook personalizado para manejar datos de materias primas
const useDataRawMaterials = () => {
  const API = "https://pergola.onrender.com/api/rawmaterials"
  // Estado para almacenar materia prima, proveedor y estado de carga
  const [rawmaterials, setRawMaterials] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchRawMaterials = useCallback(async () => {
    try {
      setLoading(true)
      const response = await window.fetch(API, { credentials: "include" }) 
      
      if (response.status === 403) {
        console.log("Sin permisos para materias primas")
        setRawMaterials([])
        return
      }
      
      if (!response.ok) throw new Error("Hubo un error al obtener las materias primas")
      
      const data = await response.json()
      setRawMaterials(data)
    } catch (error) {
      console.error("Error al obtener materias primas:", error)
      if (!error.message.includes("403")) {
        toast.error("Error al cargar materias primas")
      }
      setRawMaterials([])
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchSuppliers = useCallback(async () => {
    try {
      const response = await window.fetch("https://pergola.onrender.com/api/suppliers", {
        credentials: "include"
      })
      
      if (!response.ok) {
        throw new Error("Error al obtener proveedores")
      }
      
      const data = await response.json()
      setSuppliers(data)
    } catch (error) {
      console.error("Error al obtener proveedores:", error)
      setSuppliers([])
    }
  }, [])

  useEffect(() => {
    let mounted = true
    
    const loadData = async () => {
      if (mounted) {
        await Promise.all([
          fetchRawMaterials(),
          fetchSuppliers()
        ])
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
      await Promise.all([
        fetchRawMaterials(),
        fetchSuppliers()
      ])
    } catch (error) {
      console.error("Error en refresh:", error)
    }
  }, [fetchRawMaterials, fetchSuppliers])

  // Crea los handlers para agregar, editar y eliminar materias primas
  const createHandlers = useCallback((API) => ({
    data: rawmaterials,
    loading,
    // Handler para agregar materias primas
    onAdd: async (data) => {
      try {
        const response = await window.fetch(`${API}/rawmaterials`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data)
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al crear materia prima")
        }
        toast.success('Materia prima creada exitosamente')
        
        await fetchRawMaterials()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al crear materia prima")
        throw error
      }
    },
    // Handler para editar materia prima
    onEdit: async (id, data) => {
      try {
        const response = await window.fetch(`${API}/rawmaterials/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data)
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al actualizar materia prima")
        }
        
        toast.success('Materia prima actualizado exitosamente')
        await fetchRawMaterials()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al actualizar materia prima")
        throw error
      }
    },
    // Handler para eliminar materia prima
    onDelete: async (id) => {
      try {
        const response = await window.fetch(`${API}/rawmaterials/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include"
        })
        
        if (!response.ok) throw new Error("Hubo un error al eliminar la materia prima")
        
        toast.success('Materia prima eliminada exitosamente')
        await fetchRawMaterials()
      } catch (error) {
        console.error("Error al eliminar materia prima:", error)
        toast.error("Error al eliminar materia prima")
        throw error
      }
    }
  }), [rawmaterials, loading, fetchRawMaterials])

  return {
    rawmaterials,
    suppliers,
    loading,
    fetch: refreshData,
    fetchRawMaterials,
    fetchSuppliers,
    createHandlers
  }
}
// Exporta el hook para su uso en otros componentes
export default useDataRawMaterials