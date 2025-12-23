import { useState, useEffect, useContext, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  StatusBar,
  Animated,
  Share
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext'; // AGREGAR ESTA IMPORTACIÓN
import ProductImageGallery from '../../components/product/ProductImageGallery';
import ReviewsSection from '../../components/product/ReviewsSection';
import { useFonts } from 'expo-font';
import { getProductPricing, getProductStatus, formatPrice, getProductCategoryInfo, sanitizeProduct, capitalizeFirst} from '../../screen/catalog/productUtils';

const statusBarHeight = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;

const ProductDetailScreen = ({ route, navigation }) => {
  const { productId } = route.params;
  const { user, API, fetchWithAuth } = useContext(AuthContext);
  
  // USAR EL CONTEXTO DEL CARRITO
  const { 
    addToCart: addToCartContext, 
    toggleWishlist, 
    isInWishlist: checkIsInWishlist 
  } = useContext(CartContext);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  const [cartQuantity, setCartQuantity] = useState(1);

  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100, 200],
    outputRange: [0, 0.8, 1],
    extrapolate: 'clamp'
  });

  const [fontsLoaded] = useFonts({
    'Quicksand-Bold': require('../../../assets/fonts/Quicksand-Bold.ttf'),
    'Quicksand-Medium': require('../../../assets/fonts/Quicksand-Medium.ttf'),
    'Nunito-Bold': require('../../../assets/fonts/Nunito-Bold.ttf'),
    'Nunito-SemiBold': require('../../../assets/fonts/Nunito-SemiBold.ttf'),
    'Nunito-Regular': require('../../../assets/fonts/Nunito-Regular.ttf'),
  });

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth(`${API}/public/products`);
      
      if (response.ok) {
        const products = await response.json();
        const foundProduct = products.find(p => p._id === productId);
        if (foundProduct) {
          const sanitizedProduct = sanitizeProduct(foundProduct);
          setProduct(sanitizedProduct);
        } else {
          Alert.alert('Error', 'Producto no encontrado');
          navigation.goBack();
        }
      } else {
        throw new Error('Error al cargar productos');
      }
    } catch (error) {
      console.error('Error loading product:', error);
      if (error.message !== 'SESSION_EXPIRED') {
        Alert.alert('Error', 'No se pudo cargar el producto');
      }
    } finally {
      setLoading(false);
    }
  };

  // VERIFICAR SI ESTÁ EN WISHLIST DE FORMA SEGURA
  const isInWishlist = product ? checkIsInWishlist(product._id) : false;

  const handleToggleWishlist = async () => {
    if (!user) {
      Alert.alert('Inicia sesión', 'Debes iniciar sesión para guardar productos en tu lista de deseos');
      return;
    }

    if (!product) return;

    await toggleWishlist(product);
  };

  const handleAddToCart = async () => {
    if (!user) {
      Alert.alert('Inicia sesión', 'Debes iniciar sesión para agregar productos al carrito');
      return;
    }

    if (!product) return;

    const statusInfo = getProductStatus(product);
    
    if (!statusInfo.available) {
      Alert.alert('Producto no disponible', 'Este producto no está disponible actualmente');
      return;
    }

    if (cartQuantity > product.stock) {
      Alert.alert('Stock insuficiente', `Solo hay ${product.stock} unidades disponibles`);
      return;
    }

    const result = await addToCartContext(product, cartQuantity);
    
    if (result.success) {
      Alert.alert(
        'Producto agregado',
        `${cartQuantity} ${cartQuantity === 1 ? 'unidad agregada' : 'unidades agregadas'} al carrito`,
        [
          { text: 'Seguir comprando', style: 'cancel' },
          { 
            text: 'Ver carrito', 
            onPress: () => navigation.navigate('Home', { screen: 'Cart' })
          }
        ]
      );
    } else {
      Alert.alert('Error', 'No se pudo agregar al carrito');
    }
  };

  const renderFloatingHeader = () => (
    <Animated.View style={[styles.floatingHeader, { opacity: headerOpacity }]}>
      <TouchableOpacity 
        style={styles.floatingBackButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#3D1609" />
      </TouchableOpacity>
      
      <Text style={styles.floatingTitle} numberOfLines={1}>
        {product?.name}
      </Text>
      
      <View style={styles.floatingActions}>
        <TouchableOpacity style={styles.floatingActionBtn} onPress={handleToggleWishlist}>
          <Ionicons
            name={isInWishlist ? "heart" : "heart-outline"}
            size={20}
            color={isInWishlist ? "#A73249" : "#3D1609"}
          />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderProductHighlights = () => (
    <View style={styles.highlightsContainer}>
      <View style={styles.highlightItem}>
        <Ionicons name="shield-checkmark" size={20} color="#4CAF50" />
        <Text style={styles.highlightText}>Garantía de calidad</Text>
      </View>
      
      <View style={styles.highlightItem}>
        <Ionicons name="rocket" size={20} color="#2196F3" />
        <Text style={styles.highlightText}>Envío rápido</Text>
      </View>
      
      <View style={styles.highlightItem}>
        <Ionicons name="refresh" size={20} color="#FF9800" />
        <Text style={styles.highlightText}>Devolución fácil</Text>
      </View>
    </View>
  );

  const renderTabContent = () => {
    if (activeTab === 'details') {
      return (
        <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
          {/* Información básica */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Descripción</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          {/* Información de categorías */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categorización</Text>
            <View style={styles.categoryCards}>
              {(() => {
                const categoryInfo = getProductCategoryInfo(product);
                return (
                  <>
                    <View style={styles.categoryCard}>
                      <Ionicons name="layers" size={16} color="#A73249" />
                      <Text style={styles.categoryCardText}>{categoryInfo.collection.name}</Text>
                    </View>
                    <View style={styles.categoryCard}>
                      <Ionicons name="folder" size={16} color="#A73249" />
                      <Text style={styles.categoryCardText}>{categoryInfo.category.name}</Text>
                    </View>
                    <View style={styles.categoryCard}>
                      <Ionicons name="list" size={16} color="#A73249" />
                      <Text style={styles.categoryCardText}>{categoryInfo.subcategory.name}</Text>
                    </View>
                  </>
                );
              })()}
            </View>
          </View>

          {/* Información de stock y estado */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Disponibilidad</Text>
            <View style={styles.availabilityCard}>
              <View style={styles.availabilityRow}>
                <Text style={styles.availabilityLabel}>Stock disponible</Text>
                <View style={styles.stockBadge}>
                  <Text style={styles.stockBadgeText}>{product.stock} unidades</Text>
                </View>
              </View>
              
              <View style={styles.availabilityRow}>
                <Text style={styles.availabilityLabel}>Estado</Text>
                {(() => {
                  const statusInfo = getProductStatus(product);
                  return (
                    <View style={styles.statusBadge}>
                      <View style={[styles.statusDot, { backgroundColor: statusInfo.color }]} />
                      <Text style={styles.statusBadgeText}>{statusInfo.displayText}</Text>
                    </View>
                  );
                })()}
              </View>
              
              {product.highlighted && (
                <View style={styles.featuredBadge}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.featuredText}>Producto destacado</Text>
                </View>
              )}
            </View>
          </View>

          {/* Información adicional */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información Adicional</Text>
            <View style={styles.additionalInfoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Código de producto:</Text>
                <Text style={styles.infoValue}>{product.codeProduct || 'No especificado'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Tipo de movimiento:</Text>
                <Text style={styles.infoValue}>{product.movementType ? capitalizeFirst(product.movementType) : 'No especificado'}</Text>
              </View>
              {product.applicableCosts && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Costos aplicables:</Text>
                  <Text style={styles.infoValue}>{product.applicableCosts}</Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      );
    } else {
      return <ReviewsSection productId={productId} />;
    }
  };

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A73249" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Producto no encontrado</Text>
        <TouchableOpacity style={styles.goBackBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.goBackText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const pricing = getProductPricing(product);
  const statusInfo = getProductStatus(product);

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Galería de imágenes */}
        <ProductImageGallery images={product.images} />

        {/* Información del producto */}
        <View style={styles.productInfo}>
          <View style={styles.productHeader}>
            <Text style={styles.productName}>{product.name}</Text>
          </View>
          
          <View style={styles.priceContainer}>
            {pricing.hasDiscount ? (
              <View style={styles.discountContainer}>
                <View style={styles.priceRow}>
                  <Text style={styles.originalPrice}>{formatPrice(pricing.originalPrice)}</Text>
                  <View style={styles.discountTag}>
                    <Text style={styles.discountTagText}>
                      -{pricing.discountPercentage}%
                    </Text>
                  </View>
                </View>
                <Text style={styles.discountedPrice}>{formatPrice(pricing.finalPrice)}</Text>
                <Text style={styles.savingsText}>Ahorras {formatPrice(pricing.savings)}</Text>
              </View>
            ) : (
              <Text style={styles.price}>{formatPrice(pricing.finalPrice)}</Text>
            )}
          </View>

          {/* Highlights */}
          {renderProductHighlights()}
        </View>

        {/* Tabs mejorados */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'details' && styles.activeTab]}
            onPress={() => setActiveTab('details')}
          >
            <Ionicons 
              name="information-circle" 
              size={20} 
              color={activeTab === 'details' ? '#A73249' : '#666'} 
            />
            <Text style={[
              styles.tabText,
              activeTab === 'details' && styles.activeTabText
            ]}>Detalles</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'reviews' && styles.activeTab]}
            onPress={() => setActiveTab('reviews')}
          >
            <Ionicons 
              name="star" 
              size={20} 
              color={activeTab === 'reviews' ? '#A73249' : '#666'} 
            />
            <Text style={[
              styles.tabText,
              activeTab === 'reviews' && styles.activeTabText
            ]}>Reseñas</Text>
          </TouchableOpacity>
        </View>

        {/* Contenido de las tabs */}
        <View style={[ styles.tabContentContainer, activeTab === 'details' && { paddingTop: 16 } ]}>
          {renderTabContent()}
        </View>
      </Animated.ScrollView>

      {/* Header flotante */}
      {renderFloatingHeader()}

      {/* Footer fijo */}
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <View style={styles.quantitySection}>
            <Text style={styles.quantityLabel}>Cantidad</Text>
            <View style={styles.quantitySelector}>
              <TouchableOpacity
                style={styles.quantityBtn}
                onPress={() => setCartQuantity(Math.max(1, cartQuantity - 1))}
              >
                <Ionicons name="remove" size={20} color="#A73249" />
              </TouchableOpacity>
              
              <Text style={styles.quantityText}>{cartQuantity}</Text>
              
              <TouchableOpacity
                style={styles.quantityBtn}
                onPress={() => setCartQuantity(Math.min(product.stock, cartQuantity + 1))}
              >
                <Ionicons name="add" size={20} color="#A73249" />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.addToCartBtn,
              !statusInfo.available && styles.addToCartBtnDisabled
            ]}
            onPress={handleAddToCart}
            disabled={!statusInfo.available}
          >
            <Ionicons name="bag-add" size={22} color="#FFFFFF" />
            <Text style={styles.addToCartText}>
              {statusInfo.available ? 'Agregar al carrito' : 'No disponible'}
            </Text>
            {statusInfo.available && (
              <Text style={styles.priceBadge}>
                {formatPrice(pricing.finalPrice * cartQuantity)}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// Los estilos permanecen igual...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E3C6B8',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E3C6B8',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'Quicksand-Bold',
    color: '#A73249',
    marginBottom: 20,
    textAlign: 'center',
  },
  goBackBtn: {
    backgroundColor: '#A73249',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  goBackText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Quicksand-Bold',
  },
  
  // HEADER FLOTANTE
  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: statusBarHeight + 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E1D8',
    zIndex: 1000,
  },
  floatingBackButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 8,
    marginRight: 12,
  },
  floatingTitle: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Quicksand-Bold',
    color: '#3D1609',
  },
  floatingActions: {
    flexDirection: 'row',
    gap: 8,
  },
  floatingActionBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 8,
  },

  // PRODUCT INFO MEJORADO
  productInfo: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  productName: {
    flex: 1,
    fontSize: 24,
    fontFamily: 'Quicksand-Bold',
    color: '#3D1609',
    lineHeight: 30,
    marginRight: 12,
  },
  shareButton: {
    padding: 8,
  },
  priceContainer: {
    marginBottom: 16,
  },
  discountContainer: {
    gap: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  originalPrice: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#999999',
    textDecorationLine: 'line-through',
  },
  discountTag: {
    backgroundColor: '#A73249',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  discountTagText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Quicksand-Bold',
  },
  discountedPrice: {
    fontSize: 28,
    fontFamily: 'Nunito-Bold',
    color: '#A73249',
  },
  savingsText: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#4CAF50',
  },
  price: {
    fontSize: 28,
    fontFamily: 'Nunito-Bold',
    color: '#A73249',
  },

  // HIGHLIGHTS
  highlightsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F0F0F0',
  },
  highlightItem: {
    alignItems: 'center',
    flex: 1,
  },
  highlightText: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#666666',
    marginTop: 4,
    textAlign: 'center',
  },

  // TABS MEJORADOS
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E1D8',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#A73249',
  },
  tabText: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: '#666666',
  },
  activeTabText: {
    color: '#A73249',
    fontFamily: 'Nunito-Bold',
  },

  tabContentContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  tabContent: {
    flex: 1,
  },

  // SECCIONES MEJORADAS
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Quicksand-Bold',
    color: '#3D1609',
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    fontFamily: 'Nunito-Regular',
    color: '#3D1609',
    lineHeight: 22,
  },

  // CATEGORÍAS MEJORADAS
  categoryCards: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5EDE8',
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  categoryCardText: {
    fontSize: 12,
    fontFamily: 'Nunito-SemiBold',
    color: '#3D1609',
    flex: 1,
  },

  // DISPONIBILIDAD MEJORADA
  availabilityCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  availabilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  availabilityLabel: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#666666',
  },
  stockBadge: {
    backgroundColor: '#E8F5E8',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  stockBadgeText: {
    fontSize: 12,
    fontFamily: 'Nunito-Bold',
    color: '#4CAF50',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusBadgeText: {
    fontSize: 12,
    fontFamily: 'Nunito-Bold',
    color: '#3D1609',
  },

  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
    alignSelf: 'flex-start',
  },
  featuredText: {
    fontSize: 12,
    fontFamily: 'Quicksand-Bold',
    color: '#F57C00',
  },

  // INFORMACIÓN ADICIONAL
  additionalInfoCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#666666',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#3D1609',
    flex: 1,
    textAlign: 'right',
  },

  // FOOTER MEJORADO CON PADDING SEGURO
  footer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8E1D8',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  quantitySection: {
    alignItems: 'center',
  },
  quantityLabel: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#666666',
    marginBottom: 8,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5EDE8',
    borderRadius: 12,
    paddingHorizontal: 8,
  },
  quantityBtn: {
    padding: 8,
  },
  quantityText: {
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
    color: '#3D1609',
    marginHorizontal: 16,
    minWidth: 20,
    textAlign: 'center',
  },
  addToCartBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#A73249',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 8,
    position: 'relative',
  },
  addToCartBtnDisabled: {
    backgroundColor: '#CCCCCC',
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Quicksand-Bold',
  },
  priceBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#3D1609',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 12,
    fontFamily: 'Quicksand-Bold',
    color: '#FFFFFF',
  },
});

export default ProductDetailScreen;