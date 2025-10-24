import { useEffect, useState, useCallback } from "react"
import { toast } from "react-hot-toast"

// Hook personalizado para manejar datos de productos
const useDataProducts = () => {
  const API = "https://pergola.onrender.com/api/products"
  // Estado para almacenar producto, categoría, subcategoría, colección, materia prima, proveedor y estado de carga
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [subcategories, setSubategories] = useState([])
  const [collections, setCollections] = useState([])
  const [rawmaterials, setRawMaterials] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      const response = await window.fetch(API, {
        credentials: "include"
      })
      
      if (response.status === 403) {
        console.log("Sin permisos para productos")
        setProducts([])
        setLoading(false)
        return
      }
      
      if (!response.ok) {
        throw new Error("Hubo un error al obtener los productos")
      }
      
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error("Error al obtener productos:", error)
      if (!error.message.includes("403") && !error.message.includes("sin permisos")) {
        toast.error("Error al cargar artículos")
      }
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchCollections = useCallback(async () => {
    try {
      const response = await window.fetch("https://pergola.onrender.com/api/collections", {
        credentials: "include"
      })
      if (!response.ok) {
        throw new Error("Error al obtener las colecciones")
      }
      const data = await response.json()
      setCollections(data)
    } catch (error) {
      console.error("Error al obtener colecciones:", error)
      setCollections([])
    }
  }, [])

  const fetchCategories = useCallback(async () => {
    try {
      const response = await window.fetch("https://pergola.onrender.com/api/categories", {
        credentials: "include"
      })
      if (!response.ok) {
        throw new Error("Error al obtener categorías de productos")
      }
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error("Error al obtener categorías:", error)
      setCategories([])
    }
  }, [])

  const fetchSubcategories = useCallback(async () => {
    try {
      const response = await window.fetch("https://pergola.onrender.com/api/subcategories", {
        credentials: "include"
      })
      if (!response.ok) {
        throw new Error("Error al obtener las subcategorías")
      }
      const data = await response.json()
      setSubategories(data)
    } catch (error) {
      console.error("Error al obtener subcategorías:", error)
      setSubategories([])
    }
  }, [])

  const fetchRawMaterials = useCallback(async () => {
    try {
      const response = await window.fetch("https://pergola.onrender.com/api/rawmaterials", {
        credentials: "include"
      })
      if (!response.ok) {
        throw new Error("Error al obtener materias primas")
      }
      const data = await response.json()
      setRawMaterials(data)
    } catch (error) {
      console.error("Error al obtener materias primas:", error)
      setRawMaterials([])
    }
  }, [])

  useEffect(() => {
    let mounted = true
    
    const loadData = async () => {
      if (mounted) {
        await Promise.all([
          fetchProducts(),
          fetchCategories(),
          fetchSubcategories(),
          fetchCollections(),
          fetchRawMaterials()
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
        fetchProducts(),
        fetchCategories(),
        fetchSubcategories(),
        fetchCollections(),
        fetchRawMaterials()
      ])
    } catch (error) {
      console.error("Error en fetch unificado:", error)
    }
  }, [fetchProducts, fetchCategories, fetchSubcategories, fetchCollections, fetchRawMaterials])

  // Crea los handlers para agregar, editar y eliminar productos
  const createHandlers = useCallback((API) => ({
    data: products,
    loading,
    // Handler para agregar producto
    onAdd: async (data) => {
      try {
        let body
        let headers = { credentials: "include" }

        // Si hay imágenes, usar FormData
        if (data.images && Array.isArray(data.images) && data.images.some(file => file instanceof File)) {
          const formData = new FormData()
          Object.keys(data).forEach(key => {
            if (key === "images") {
              data.images.forEach((file) => {
                if (file instanceof File) {
                  formData.append("images", file) // Adjunta imagen
                }
              })
            } else {
              formData.append(key, data[key]) // Adjunta otros campos
            }
          })
          body = formData
        } else {
          headers["Content-Type"] = "application/json"
          body = JSON.stringify(data)
        }
        
        const response = await fetch(`${API}/products`, {
          method: "POST",
          headers,
          credentials: "include",
          body
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al registrar producto")
        }
        
        toast.success('Producto registrado exitosamente')
        fetchProducts()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al registrar producto")
        throw error
      }
    },
    // Handler para editar producto
    onEdit: async (id, data) => {
      try {
        let body
        let headers = { credentials: "include" }

        // Si hay imágenes, usar FormData
        if (data.images && Array.isArray(data.images) && data.images.some(file => file instanceof File)) {
          const formData = new FormData()
          Object.keys(data).forEach(key => {
            if (key === "images") {
              data.images.forEach((file) => {
                if (file instanceof File) {
                  formData.append("images", file) // Adjunta imagen
                }
              })
            } else {
              formData.append(key, data[key]) // Adjunta otros campos
            }
          })
          body = formData
        } else {
          headers["Content-Type"] = "application/json"
          body = JSON.stringify(data)
        }

        const response = await fetch(`${API}/products/${id}`, {
          method: "PUT",
          headers,
          credentials: "include",
          body
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Error al actualizar producto")
        }
        
        toast.success('Producto actualizado exitosamente')
        fetchProducts()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al actualizar producto")
        throw error
      }
    },
    // Handler para eliminar producto
    onDelete: async (id) => {
      try {
        const response = await window.fetch(`${API}/products/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include"
        })
        
        if (!response.ok) throw new Error("Hubo un error al eliminar los productos")
        
        toast.success('Producto eliminado exitosamente')
        await fetchProducts()
      } catch (error) {
        console.error("Error al eliminar producto:", error)
        toast.error("Error al eliminar producto")
        throw error
      }
    }
  }), [products, loading, fetchProducts])

  return {
    products,
    categories,
    subcategories,
    collections,
    rawmaterials,
    loading,
    fetch: refreshData,
    fetchProducts,
    fetchCategories,
    fetchSubcategories,
    fetchCollections,
    fetchRawMaterials,
    createHandlers
  }
}
// Exporta el hook para su uso en otros componentes
export default useDataProducts