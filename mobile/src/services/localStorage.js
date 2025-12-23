import AsyncStorage from '@react-native-async-storage/async-storage';

const CART_KEY = '@pergola_cart';
const WISHLIST_KEY = '@pergola_wishlist';

export const CartStorage = {
  // Obtener carrito del usuario
  getCart: async (userId) => {
    try {
      const key = userId ? `${CART_KEY}_${userId}` : CART_KEY;
      const cart = await AsyncStorage.getItem(key);
      return cart ? JSON.parse(cart) : [];
    } catch (error) {
      console.error('Error al obtener carrito:', error);
      return [];
    }
  },

  // Guardar carrito
  saveCart: async (cart, userId) => {
    try {
      const key = userId ? `${CART_KEY}_${userId}` : CART_KEY;
      await AsyncStorage.setItem(key, JSON.stringify(cart));
    } catch (error) {
      console.error('Error al guardar carrito:', error);
    }
  },

  // Agregar producto al carrito
  addToCart: async (product, quantity = 1, userId) => {
    try {
      const cart = await CartStorage.getCart(userId);
      const existingIndex = cart.findIndex(item => item._id === product._id);

      if (existingIndex !== -1) {
        // Si ya existe, incrementar cantidad
        cart[existingIndex].quantity += quantity;
        
        // Verificar stock
        if (cart[existingIndex].quantity > product.stock) {
          cart[existingIndex].quantity = product.stock;
        }
      } else {
        // Si no existe, agregarlo
        cart.push({
          _id: product._id,
          name: product.name,
          description: product.description,
          price: product.price,
          discount: product.discount || 0,
          images: product.images,
          stock: product.stock,
          status: product.status,
          quantity: Math.min(quantity, product.stock)
        });
      }

      await CartStorage.saveCart(cart, userId);
      return cart;
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      return [];
    }
  },

  // Remover producto del carrito
  removeFromCart: async (productId, userId) => {
    try {
      const cart = await CartStorage.getCart(userId);
      const updatedCart = cart.filter(item => item._id !== productId);
      await CartStorage.saveCart(updatedCart, userId);
      return updatedCart;
    } catch (error) {
      console.error('Error al remover del carrito:', error);
      return [];
    }
  },

  // Actualizar cantidad de producto
  updateQuantity: async (productId, quantity, userId) => {
    try {
      const cart = await CartStorage.getCart(userId);
      const itemIndex = cart.findIndex(item => item._id === productId);
      
      if (itemIndex !== -1) {
        if (quantity <= 0) {
          // Si la cantidad es 0 o negativa, remover item
          cart.splice(itemIndex, 1);
        } else {
          // Actualizar cantidad (respetando stock)
          cart[itemIndex].quantity = Math.min(quantity, cart[itemIndex].stock);
        }
      }

      await CartStorage.saveCart(cart, userId);
      return cart;
    } catch (error) {
      console.error('Error al actualizar cantidad:', error);
      return [];
    }
  },

  // Limpiar carrito
  clearCart: async (userId) => {
    try {
      const key = userId ? `${CART_KEY}_${userId}` : CART_KEY;
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error al limpiar carrito:', error);
    }
  },

  // Obtener total del carrito
  getCartTotal: (cart) => {
    return cart.reduce((total, item) => {
      const price = item.discount > 0 
        ? item.price * (1 - item.discount) 
        : item.price;
      return total + (price * item.quantity);
    }, 0);
  },

  // Obtener subtotal (sin descuentos)
  getCartSubtotal: (cart) => {
    return cart.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  },

  // Obtener cantidad total de items
  getCartItemsCount: (cart) => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }
};

export const WishlistStorage = {
  // Obtener lista de deseos
  getWishlist: async (userId) => {
    try {
      const key = userId ? `${WISHLIST_KEY}_${userId}` : WISHLIST_KEY;
      const wishlist = await AsyncStorage.getItem(key);
      return wishlist ? JSON.parse(wishlist) : [];
    } catch (error) {
      console.error('Error al obtener wishlist:', error);
      return [];
    }
  },

  // Guardar lista de deseos
  saveWishlist: async (wishlist, userId) => {
    try {
      const key = userId ? `${WISHLIST_KEY}_${userId}` : WISHLIST_KEY;
      await AsyncStorage.setItem(key, JSON.stringify(wishlist));
    } catch (error) {
      console.error('Error al guardar wishlist:', error);
    }
  },

  // Agregar a lista de deseos
  addToWishlist: async (product, userId) => {
    try {
      const wishlist = await WishlistStorage.getWishlist(userId);
      const exists = wishlist.some(item => item._id === product._id);

      if (!exists) {
        wishlist.push({
          _id: product._id,
          name: product.name,
          description: product.description,
          price: product.price,
          discount: product.discount || 0,
          images: product.images,
          stock: product.stock,
          status: product.status
        });
        await WishlistStorage.saveWishlist(wishlist, userId);
      }

      return wishlist;
    } catch (error) {
      console.error('Error al agregar a wishlist:', error);
      return [];
    }
  },

  // Remover de lista de deseos
  removeFromWishlist: async (productId, userId) => {
    try {
      const wishlist = await WishlistStorage.getWishlist(userId);
      const updatedWishlist = wishlist.filter(item => item._id !== productId);
      await WishlistStorage.saveWishlist(updatedWishlist, userId);
      return updatedWishlist;
    } catch (error) {
      console.error('Error al remover de wishlist:', error);
      return [];
    }
  },

  // Toggle wishlist (agregar/remover)
  toggleWishlist: async (product, userId) => {
    try {
      const wishlist = await WishlistStorage.getWishlist(userId);
      const existingIndex = wishlist.findIndex(item => item._id === product._id);

      if (existingIndex !== -1) {
        // Si existe, removerlo
        wishlist.splice(existingIndex, 1);
      } else {
        // Si no existe, agregarlo
        wishlist.push({
          _id: product._id,
          name: product.name,
          description: product.description,
          price: product.price,
          discount: product.discount || 0,
          images: product.images,
          stock: product.stock,
          status: product.status
        });
      }

      await WishlistStorage.saveWishlist(wishlist, userId);
      return wishlist;
    } catch (error) {
      console.error('Error al toggle wishlist:', error);
      return [];
    }
  },

  // Verificar si está en wishlist
  isInWishlist: async (productId, userId) => {
    try {
      const wishlist = await WishlistStorage.getWishlist(userId);
      return wishlist.some(item => item._id === productId);
    } catch (error) {
      console.error('Error al verificar wishlist:', error);
      return false;
    }
  }
};