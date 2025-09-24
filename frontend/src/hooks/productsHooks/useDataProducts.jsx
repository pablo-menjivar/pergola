import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"

// Hook para manejar productos y sus datos relacionados
const useDataProducts = () => {
  const API = "https://pergola-production.up.railway.app/api/products"
  const [products, setProducts] = useState([]) // Lista de productos
  const [categories, setCategories] = useState([]) // Lista de categorías
  const [subcategories, setSubategories] = useState([]) // Lista de subcategorías
  const [collections, setCollections] = useState([]) // Lista de colecciones
  const [rawmaterials, setRawMaterials] = useState([]) // Lista de materias primas
  const [loading, setLoading] = useState(true) // Estado de carga

  // Cargar productos desde el servidor
  const fetchProducts = async () => {
    try {
      const response = await fetch(API, {
        credentials: "include" // Incluye sesión
      })
      if (response.status === 403) {
        console.log("⚠️ Sin permisos para productos - usuario no autorizado")
        setProducts([])
        setLoading(false)
        return
      }
      if (!response.ok) {
        throw new Error("Hubo un error al obtener los productos")
      }
      const data = await response.json()
      setProducts(data)
      setLoading(false)
    } catch (error) {
      console.error("Error al obtener productos:", error)
      if (!error.message.includes("403") && !error.message.includes("sin permisos")) {
        toast.error("Error al cargar artículos")
      }
      setLoading(false)
    }
  }

  // Cargar colecciones
  const fetchCollections = async () => {
    try {
      const response = await fetch("https://pergola-production.up.railway.app/api/collections", {
        credentials: "include"
      })
      if (!response.ok) {
        throw new Error("Error al obtener las colecciones")
      }
      const data = await response.json()
      setCollections(data)
    } catch (error) {
      console.error("Error al obtener colecciones:", error)
    }
  }

  // Cargar categorías
  const fetchCategories = async () => {
    try {
      const response = await fetch("https://pergola-production.up.railway.app/api/categories", {
        credentials: "include"
      })
      if (!response.ok) {
        throw new Error("Error al obtener categorías de productos")
      }
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error("Error al obtener categorías:", error)
    }
  }

  // Cargar subcategorías
  const fetchSubcategories = async () => {
    try {
      const response = await fetch("https://pergola-production.up.railway.app/api/subcategories", {
        credentials: "include"
      })
      if (!response.ok) {
        throw new Error("Error al obtener las subcategorías")
      }
      const data = await response.json()
      setSubategories(data)
    } catch (error) {
      console.error("Error al obtener subcategorías:", error)
    }
  }

  // Cargar materias primas
  const fetchRawMaterials = async () => {
    try {
      const response = await fetch("https://pergola-production.up.railway.app/api/rawmaterials", {
        credentials: "include"
      })
      if (!response.ok) {
        throw new Error("Error al obtener las materias primas")
      }
      const data = await response.json()
      setRawMaterials(data)
    } catch (error) {
      console.error("Error al obtener materias primas:", error)
    }
  }

  // Cargar todo cuando el componente se monta
  useEffect(() => {
    fetchProducts()
    fetchCollections()
    fetchCategories()
    fetchSubcategories()
    fetchRawMaterials()
  }, [])

  // Funciones para agregar, editar y eliminar productos
  const createHandlers = (API) => ({
    data: products, // Devuelve los productos
    loading, // Devuelve si está cargando

    // Agregar producto
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

    // Editar producto
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
          throw new Error(errorData.message || "Error al actualizar artículo")
        }
        toast.success('Producto actualizado exitosamente')
        fetchProducts()
      } catch (error) {
        console.error("Error:", error)
        toast.error(error.message || "Error al actualizar producto")
        throw error
      }
    },

    onDelete: deleteProduct // Usa la función para borrar producto
  })

  // Eliminar producto por ID
  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include"
      })
      if (!response.ok) {
        throw new Error("Hubo un error al eliminar el producto")
      }
      toast.success('Producto eliminado exitosamente')
      fetchProducts()
    } catch (error) {
      console.error("Error al eliminar producto:", error)
      toast.error("Error al eliminar producto")
    }
  }

  // Devuelve los datos y funciones listas para usar
  return {
    products,
    categories,
    subcategories,
    collections,
    rawmaterials,
    loading,
    fetchProducts,
    fetchCollections,
    fetchCategories,
    fetchSubcategories,
    fetchRawMaterials,
    deleteProduct,
    createHandlers
  }
}

// Exporta el hook para su uso en otros componentes
export default useDataProducts
