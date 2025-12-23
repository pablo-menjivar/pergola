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
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useFonts } from 'expo-font';
import { formatPrice, getProductPricing } from './catalog/productUtils';

const statusBarHeight = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;

const WishlistScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const {
    wishlist,
    removeFromWishlist,
    addToCart
  } = useContext(CartContext);

  const [fontsLoaded] = useFonts({
    'Quicksand-Bold': require('../../assets/fonts/Quicksand-Bold.ttf'),
    'Nunito-Bold': require('../../assets/fonts/Nunito-Bold.ttf'),
    'Nunito-SemiBold': require('../../assets/fonts/Nunito-SemiBold.ttf'),
    'Nunito-Regular': require('../../assets/fonts/Nunito-Regular.ttf'),
  });

  const handleRemoveItem = (productId, productName) => {
    Alert.alert(
      'Eliminar de wishlist',
      `¿Deseas eliminar "${productName}" de tu lista de deseos?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => removeFromWishlist(productId)
        }
      ]
    );
  };

  const handleAddToCart = async (product) => {
    if (!user) {
      Alert.alert(
        'Inicia sesión',
        'Debes iniciar sesión para agregar productos al carrito'
      );
      return;
    }

    if (product.stock <= 0 || product.status !== 'disponible') {
      Alert.alert('No disponible', 'Este producto no está disponible actualmente');
      return;
    }

    const result = await addToCart(product, 1);
    
    if (result.success) {
      Alert.alert(
        'Agregado al carrito',
        `${product.name} ha sido agregado al carrito`,
        [
          { text: 'Seguir comprando', style: 'cancel' },
          { 
            text: 'Ver carrito', 
            onPress: () => navigation.navigate('Home', { screen: 'Cart' })
          }
        ]
      );
    }
  };

  const renderWishlistItem = ({ item }) => {
    const pricing = getProductPricing(item);

    return (
      <View style={styles.wishlistItem}>
        <TouchableOpacity
          style={styles.itemContent}
          onPress={() => navigation.navigate('ProductDetail', { productId: item._id })}
        >
          <Image
            source={{ uri: item.images?.[0] || 'https://via.placeholder.com/100' }}
            style={styles.itemImage}
          />
          
          <View style={styles.itemDetails}>
            <Text style={styles.itemName} numberOfLines={2}>
              {item.name}
            </Text>
            
            <Text style={styles.itemDescription} numberOfLines={2}>
              {item.description}
            </Text>
            
            <View style={styles.priceRow}>
              {pricing.hasDiscount ? (
                <>
                  <Text style={styles.originalPrice}>
                    {formatPrice(pricing.originalPrice)}
                  </Text>
                  <Text style={styles.itemPrice}>
                    {formatPrice(pricing.finalPrice)}
                  </Text>
                </>
              ) : (
                <Text style={styles.itemPrice}>
                  {formatPrice(pricing.finalPrice)}
                </Text>
              )}
            </View>

            {item.stock > 0 && item.status === 'disponible' ? (
              <Text style={styles.stockAvailable}>En stock</Text>
            ) : (
              <Text style={styles.stockUnavailable}>No disponible</Text>
            )}
          </View>
        </TouchableOpacity>

        <View style={styles.itemActions}>
          <TouchableOpacity
            style={[
              styles.addToCartBtn,
              (item.stock <= 0 || item.status !== 'disponible') && styles.addToCartBtnDisabled
            ]}
            onPress={() => handleAddToCart(item)}
            disabled={item.stock <= 0 || item.status !== 'disponible'}
          >
            <Ionicons name="cart-outline" size={18} color="#FFFFFF" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.removeBtn}
            onPress={() => handleRemoveItem(item._id, item.name)}
          >
            <Ionicons name="trash-outline" size={18} color="#A73249" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (!fontsLoaded) {
    return null;
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#3D1609" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Lista de Deseos</Text>
          <View style={{ width: 40 }} />
        </View>
        
        <View style={styles.emptyContainer}>
          <Ionicons name="log-in-outline" size={80} color="#CCCCCC" />
          <Text style={styles.emptyTitle}>Inicia sesión</Text>
          <Text style={styles.emptyText}>
            Debes iniciar sesión para ver tu lista de deseos
          </Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginButtonText}>Iniciar sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
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
        
        <Text style={styles.headerTitle}>Lista de Deseos</Text>
        
        <View style={{ width: 40 }} />
      </View>

      {/* Lista de productos */}
      {wishlist.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={80} color="#CCCCCC" />
          <Text style={styles.emptyTitle}>Tu lista está vacía</Text>
          <Text style={styles.emptyText}>
            Guarda tus productos favoritos aquí
          </Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => navigation.navigate('Products')}
          >
            <Text style={styles.shopButtonText}>Explorar productos</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={wishlist}
          renderItem={renderWishlistItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
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
  loginButton: {
    backgroundColor: '#A73249',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Quicksand-Bold',
  },
  listContent: {
    padding: 16,
    paddingBottom: 20,
  },
  wishlistItem: {
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
  itemContent: {
    flex: 1,
    flexDirection: 'row',
  },
  itemImage: {
    width: 100,
    height: 100,
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
  itemDescription: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#666666',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
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
  stockAvailable: {
    fontSize: 11,
    fontFamily: 'Nunito-SemiBold',
    color: '#4CAF50',
  },
  stockUnavailable: {
    fontSize: 11,
    fontFamily: 'Nunito-SemiBold',
    color: '#F44336',
  },
  itemActions: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 8,
  },
  addToCartBtn: {
    backgroundColor: '#A73249',
    borderRadius: 20,
    padding: 10,
  },
  addToCartBtnDisabled: {
    backgroundColor: '#CCCCCC',
  },
  removeBtn: {
    backgroundColor: '#F5EDE8',
    borderRadius: 20,
    padding: 10,
  },
});

export default WishlistScreen;