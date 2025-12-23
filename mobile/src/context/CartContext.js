import { createContext, useState, useEffect, useContext } from 'react';
import { CartStorage, WishlistStorage } from '../services/localStorage';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos al iniciar o cuando cambie el usuario
  useEffect(() => {
    if (user) {
    // Usuario logueado: cargar su carrito específico
    loadData();
    } else {
      // Usuario invitado: cargar carrito general
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const userId = user?.id || null;
      
      const [cartData, wishlistData] = await Promise.all([
        CartStorage.getCart(userId),
        WishlistStorage.getWishlist(userId)
      ]);
      
      setCart(cartData);
      setWishlist(wishlistData);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  // ========== FUNCIONES DEL CARRITO ==========
  const addToCart = async (product, quantity = 1) => {
    try {
      const userId = user?.id || null;
      const updatedCart = await CartStorage.addToCart(product, quantity, userId);
      setCart(updatedCart);
      return { success: true, cart: updatedCart };
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      return { success: false, error: error.message };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const userId = user?.id || null;
      const updatedCart = await CartStorage.removeFromCart(productId, userId);
      setCart(updatedCart);
      return { success: true, cart: updatedCart };
    } catch (error) {
      console.error('Error al remover del carrito:', error);
      return { success: false, error: error.message };
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const userId = user?.id || null;
      const updatedCart = await CartStorage.updateQuantity(productId, quantity, userId);
      setCart(updatedCart);
      return { success: true, cart: updatedCart };
    } catch (error) {
      console.error('Error al actualizar cantidad:', error);
      return { success: false, error: error.message };
    }
  };

  const clearCart = async () => {
    try {
      const userId = user?.id || null;
      await CartStorage.clearCart(userId);
      setCart([]);
      return { success: true };
    } catch (error) {
      console.error('Error al limpiar carrito:', error);
      return { success: false, error: error.message };
    }
  };

  const isInCart = (productId) => {
    return cart.some(item => item._id === productId);
  };

  const getCartItemQuantity = (productId) => {
    const item = cart.find(item => item._id === productId);
    return item ? item.quantity : 0;
  };

  // ========== FUNCIONES DE WISHLIST ==========
  const addToWishlist = async (product) => {
    try {
      const userId = user?.id || null;
      const updatedWishlist = await WishlistStorage.addToWishlist(product, userId);
      setWishlist(updatedWishlist);
      return { success: true, wishlist: updatedWishlist };
    } catch (error) {
      console.error('Error al agregar a wishlist:', error);
      return { success: false, error: error.message };
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const userId = user?.id || null;
      const updatedWishlist = await WishlistStorage.removeFromWishlist(productId, userId);
      setWishlist(updatedWishlist);
      return { success: true, wishlist: updatedWishlist };
    } catch (error) {
      console.error('Error al remover de wishlist:', error);
      return { success: false, error: error.message };
    }
  };

  const toggleWishlist = async (product) => {
    try {
      const userId = user?.id || null;
      const updatedWishlist = await WishlistStorage.toggleWishlist(product, userId);
      setWishlist(updatedWishlist);
      return { success: true, wishlist: updatedWishlist };
    } catch (error) {
      console.error('Error al toggle wishlist:', error);
      return { success: false, error: error.message };
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item._id === productId);
  };

  // ========== CÁLCULOS ==========
  const cartTotal = CartStorage.getCartTotal(cart);
  const cartSubtotal = CartStorage.getCartSubtotal(cart);
  const cartItemsCount = CartStorage.getCartItemsCount(cart);
  const cartSavings = cartSubtotal - cartTotal;

  const value = {
    // Estado
    cart,
    wishlist,
    loading,
    // Funciones del carrito
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getCartItemQuantity,
    // Funciones de wishlist
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    // Cálculos
    cartTotal,
    cartSubtotal,
    cartItemsCount,
    cartSavings
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }
  return context;
};