import { useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import { useFonts } from 'expo-font';
import { getProductPricing, getProductStatus, formatPrice } from '../../screen/catalog/productUtils';

const { width: screenWidth } = Dimensions.get('window');
const cardWidth = (screenWidth - 60) / 2; // 2 columnas con márgenes

const ProductCard = ({ product, onPress }) => {
  const { user } = useContext(AuthContext);
  const { toggleWishlist, isInWishlist } = useContext(CartContext);

  const inWishlist = isInWishlist(product._id);


  const [fontsLoaded] = useFonts({
    'Quicksand-Bold': require('../../../assets/fonts/Quicksand-Bold.ttf'),
    'Quicksand-Medium': require('../../../assets/fonts/Quicksand-Medium.ttf'),
    'Nunito-Bold': require('../../../assets/fonts/Nunito-Bold.ttf'),
    'Nunito-SemiBold': require('../../../assets/fonts/Nunito-SemiBold.ttf'),
    'Nunito-Regular': require('../../../assets/fonts/Nunito-Regular.ttf'),
  });

  const handleToggleWishlist = async () => {
    if (!user) {
      Alert.alert('Inicia sesión', 'Debes iniciar sesión para guardar productos en tu lista de deseos');
      return;
    }

    await toggleWishlist(product);
  };

  const formatPriceDisplay = (price) => {
    return formatPrice(price);
  };

  const getStatusInfo = () => {
    return getProductStatus(product);
  };

  if (!fontsLoaded) {
    return null;
  }

  const pricing = getProductPricing(product);
  const statusInfo = getStatusInfo();

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(product)} activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.images?.[0] || 'https://via.placeholder.com/150' }}
          style={styles.productImage}
          resizeMode="cover"
        />
        
        {/* Botón de wishlist */}
        <TouchableOpacity
          style={styles.wishlistBtn}
          onPress={handleToggleWishlist}
          activeOpacity={0.7}
        >
          <Ionicons
            name={inWishlist ? "heart" : "heart-outline"}
            size={20}
            color={inWishlist ? "#A73249" : "#3D1609"}
          />
        </TouchableOpacity>

        {/* Etiqueta de descuento */}
        {pricing.hasDiscount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>
              -{pricing.discountPercentage}%
            </Text>
          </View>
        )}

        {/* Etiqueta de stock agotado */}
        {!statusInfo.available && (
          <View style={styles.outOfStockOverlay}>
            <Text style={styles.outOfStockText}>{statusInfo.displayText}</Text>
          </View>
        )}
      </View>

      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        
        <View style={styles.priceContainer}>
          {pricing.hasDiscount ? (
            <>
              <Text style={styles.originalPrice}>
                {formatPriceDisplay(pricing.originalPrice)}
              </Text>
              <Text style={styles.discountedPrice}>
                {formatPriceDisplay(pricing.finalPrice)}
              </Text>
            </>
          ) : (
            <Text style={styles.price}>
              {formatPriceDisplay(pricing.finalPrice)}
            </Text>
          )}
        </View>

        {/* Estado del producto */}
        <View style={styles.statusContainer}>
          <View style={[
            styles.statusIndicator,
            { backgroundColor: statusInfo.color }
          ]} />
          <Text style={styles.statusText}>
            {statusInfo.displayText}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginBottom: 16,
    shadowColor: '#3D1609',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E8E1D8',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: cardWidth * 0.75,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F5F5F5',
  },
  wishlistBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#A73249',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Quicksand-Bold',
  },
  outOfStockOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: 4,
    alignItems: 'center',
  },
  outOfStockText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Quicksand-Bold',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontFamily: 'Quicksand-Bold',
    color: '#3D1609',
    marginBottom: 6,
    lineHeight: 18,
  },
  priceContainer: {
    marginBottom: 6,
  },
  price: {
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
    color: '#A73249',
  },
  originalPrice: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#9E9E9E',
    textDecorationLine: 'line-through',
  },
  discountedPrice: {
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
    color: '#A73249',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'Nunito-Regular',
    color: '#666666',
  },
});

export default ProductCard;