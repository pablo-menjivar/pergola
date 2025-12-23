// screen/cart/CartScreen.js
import { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import { useFonts } from 'expo-font';
import { formatPrice } from '../../screen/catalog/productUtils';

const statusBarHeight = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;

const CartScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartSubtotal,
    cartSavings,
    cartItemsCount
  } = useContext(CartContext);

  const [fontsLoaded] = useFonts({
    'Quicksand-Bold': require('../../../assets/fonts/Quicksand-Bold.ttf'),
    'Nunito-Bold': require('../../../assets/fonts/Nunito-Bold.ttf'),
    'Nunito-SemiBold': require('../../../assets/fonts/Nunito-SemiBold.ttf'),
    'Nunito-Regular': require('../../../assets/fonts/Nunito-Regular.ttf'),
  });

  const handleRemoveItem = (productId, productName) => {
    Alert.alert(
      'Eliminar producto',
      `¿Deseas eliminar "${productName}" del carrito?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => removeFromCart(productId)
        }
      ]
    );
  };

  const handleClearCart = () => {
    Alert.alert(
      'Vaciar carrito',
      '¿Estás seguro de que deseas vaciar el carrito?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Vaciar',
          style: 'destructive',
          onPress: clearCart
        }
      ]
    );
  };

  const handleCheckout = () => {
    if (!user) {
      Alert.alert(
        'Inicia sesión',
        'Debes iniciar sesión para realizar una compra',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Iniciar sesión', onPress: () => navigation.navigate('Login') }
        ]
      );
      return;
    }

    navigation.navigate('Checkout');
  };

  const renderCartItem = ({ item }) => {
    const itemPrice = item.discount > 0 
      ? item.price * (1 - item.discount) 
      : item.price;
    const itemTotal = itemPrice * item.quantity;

    return (
      <View style={styles.cartItem}>
        <Image
          source={{ uri: item.images?.[0] || 'https://via.placeholder.com/80' }}
          style={styles.itemImage}
        />
        
        <View style={styles.itemDetails}>
          <Text style={styles.itemName} numberOfLines={2}>
            {item.name}
          </Text>
          
          <View style={styles.priceRow}>
            {item.discount > 0 && (
              <Text style={styles.originalPrice}>
                {formatPrice(item.price)}
              </Text>
            )}
            <Text style={styles.itemPrice}>
              {formatPrice(itemPrice)}
            </Text>
          </View>

          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityBtn}
              onPress={() => updateQuantity(item._id, item.quantity - 1)}
            >
              <Ionicons name="remove" size={16} color="#A73249" />
            </TouchableOpacity>
            
            <Text style={styles.quantityText}>{item.quantity}</Text>
            
            <TouchableOpacity
              style={styles.quantityBtn}
              onPress={() => {
                if (item.quantity >= item.stock) {
                  Alert.alert('Stock', `Solo hay ${item.stock} unidades disponibles`);
                  return;
                }
                updateQuantity(item._id, item.quantity + 1);
              }}
            >
              <Ionicons name="add" size={16} color="#A73249" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.itemActions}>
          <Text style={styles.itemTotal}>
            {formatPrice(itemTotal)}
          </Text>
          
          <TouchableOpacity
            style={styles.removeBtn}
            onPress={() => handleRemoveItem(item._id, item.name)}
          >
            <Ionicons name="trash-outline" size={20} color="#A73249" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#3D1609" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Carrito</Text>
        
        {cart.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearCart}
          >
            <Ionicons name="trash-outline" size={22} color="#A73249" />
          </TouchableOpacity>
        )}
      </View>

      {/* Lista de productos */}
      {cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color="#3d1609" />
          <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
          <Text style={styles.emptyText}>
            Agrega productos para comenzar tu compra
          </Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => navigation.navigate('ProductLines')}
          >
            <Text style={styles.shopButtonText}>Explorar productos</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            renderItem={renderCartItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          {/* Resumen */}
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal ({cartItemsCount} items):</Text>
              <Text style={styles.summaryValue}>
                {formatPrice(cartSubtotal)}
              </Text>
            </View>

            {cartSavings > 0 && (
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, styles.savingsLabel]}>
                  Ahorros:
                </Text>
                <Text style={[styles.summaryValue, styles.savingsValue]}>
                  -{formatPrice(cartSavings)}
                </Text>
              </View>
            )}

            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>
                {formatPrice(cartTotal)}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={handleCheckout}
            >
              <Text style={styles.checkoutButtonText}>
                Proceder al pago
              </Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3C6B8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: statusBarHeight + 10,
    paddingBottom: 16,
    backgroundColor: '#E3C6B8',
    borderBottomWidth: 1,
    borderBottomColor: '#E8D5C9',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Quicksand-Bold',
    color: '#3D1609',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  clearButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 22,
    fontFamily: 'Quicksand-Bold',
    color: '#3D1609',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#666666',
    textAlign: 'center',
    marginBottom: 30,
  },
  shopButton: {
    backgroundColor: '#A73249',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  shopButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Quicksand-Bold',
  },
  listContent: {
    padding: 16,
    paddingBottom: 20,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 14,
    fontFamily: 'Quicksand-Bold',
    color: '#3D1609',
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  originalPrice: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#999999',
    textDecorationLine: 'line-through',
  },
  itemPrice: {
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
    color: '#A73249',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5EDE8',
    borderRadius: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 4,
  },
  quantityBtn: {
    padding: 6,
  },
  quantityText: {
    fontSize: 14,
    fontFamily: 'Nunito-Bold',
    color: '#3D1609',
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  itemActions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginLeft: 8,
  },
  itemTotal: {
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
    color: '#3D1609',
  },
  removeBtn: {
    padding: 6,
  },
  summary: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#666666',
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: 'Nunito-Bold',
    color: '#3D1609',
  },
  savingsLabel: {
    color: '#4CAF50',
  },
  savingsValue: {
    color: '#4CAF50',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E8E1D8',
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 18,
    fontFamily: 'Quicksand-Bold',
    color: '#3D1609',
  },
  totalValue: {
    fontSize: 22,
    fontFamily: 'Nunito-Bold',
    color: '#A73249',
  },
  checkoutButton: {
    backgroundColor: '#A73249',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Quicksand-Bold',
  },
});

export default CartScreen;