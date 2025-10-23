import { useEffect, useState, useCallback } from "react"
import { toast } from "react-hot-toast"

// Hook personalizado para manejar materias primas y sus proveedores
const useDataRawMaterials = () => {
  const API = "https://pergola.onrender.com/api/rawmaterials"
  const [rawMaterials, setRawMaterials] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)

  // ✅ USAR useCallback para evitar re-creaciones innecesarias
  const fetchRawMaterials = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API}`, {
        credentials: "include"
      })

      // Si el usuario no tiene permisos, evitar mostrar error
      if (response.status === 403) {
        console.log("⚠️ Sin permisos para materias primas - usuario no autorizado")
        setRawMaterials([])
        setLoading(false)
        return
      }

      // Si la respuesta no es exitosa, lanza error
      if (!response.ok) {
        throw new Error("Hubo un error al obtener las materias primas")
      }

      // Guarda los datos obtenidos
      const data = await response.json()
      setRawMaterials(data)
    } catch (error) {
      console.error("Error al obtener materias primas:", error)
      // Mostrar toast solo si no es un error por falta de permisos
      if (!error.message.includes("403") && !error.message.includes("sin permisos")) {
        toast.error("Error al cargar materias primas")
      }
      setRawMaterials([])
    } finally {
      setLoading(false)
    }
  }, [API])

  // ✅ USAR useCallback
  const fetchSuppliers = useCallback(async () => {
    try {
      const response = await fetch("https://pergola.onrender.com/api/suppliers", {
        credentials: "include"
      })
      // Si la respuesta no es exitosa, lanza error
      if (!response.ok) {
        throw new Error("Error al obtener proveedores")
      }
      // Guarda los datos obtenidos
      const data = await response.json()
      setSuppliers(data)
    } catch (error) {
      console.error("Error al obtener proveedores:", error)
      setSuppliers([])
    }
  }, [])

  // ✅ useEffect CON DEPENDENCIAS CONTROLADAS
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
  }, [fetchRawMaterials, fetchSuppliers])

  // ✅ Función fetch unificada
  const fetch = useCallback(async () => {
    try {
      await Promise.all([
        fetchRawMaterials(),
        fetchSuppliers()
      ])
    } catch (error) {
      console.error("Error en fetch unificado:", error)
    }
  }, [fetchRawMaterials, fetchSuppliers])

  // ✅ Eliminar una materia prima por ID con useCallback
  const deleteRawMaterial = useCallback(async (id) => {
    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      })
      // Si la respuesta no es exitosa, lanza error
      if (!response.ok) {
        throw new Error("Hubo un error al eliminar la materia prima")
      }
      toast.success("Materia prima eliminada exitosamente")
      fetchRawMaterials() // Recargar lista
    } catch (error) {
      console.error("Error al eliminar materia prima:", error)
      toast.error("Error al eliminar materia prima")
    }
  }, [API, fetchRawMaterials])

  // ✅ Handlers protegidos contra errores
  const createHandlers = useCallback((API) => ({
    data: rawMaterials,
    loading,

    // Crear nueva materia prima
    onAdd: async (data) => {
      try {
        const response = await fetch(`${API}/rawmaterials`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data)
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al registrar materia prima")
        }
        toast.success('Materia prima registrada exitosamente')
        fetchRawMaterials()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al registrar materia prima")
        throw error
      }
    },
    // Editar materia prima existente
    onEdit: async (id, data) => {
      try {
        const response = await fetch(`${API}/rawmaterials/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data)
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al actualizar materia prima")
        }
        toast.success('Materia prima actualizada exitosamente')
        fetchRawMaterials()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al actualizar materia prima")
        throw error
      }
    },
    // Eliminar materia prima
    onDelete: deleteRawMaterial
  }), [rawMaterials, loading, fetchRawMaterials, deleteRawMaterial])

  return {
    rawMaterials,
    suppliers,
    loading,
    fetch,
    fetchRawMaterials,
    fetchSuppliers,
    deleteRawMaterial,
    createHandlers
  }
}

export default useDataRawMaterials