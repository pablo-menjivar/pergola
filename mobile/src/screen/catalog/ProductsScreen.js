import { useState, useEffect, useContext } from 'react';
import { useRoute } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Dimensions,
  Platform,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import ProductCard from '../../components/product/ProductCard';
import { useFonts } from 'expo-font';
import { 
  filterProductsByCategory, 
  filterProductsBySubcategory, 
  filterProductsByCollection,
  getSubcategoriesByCategory,
  sanitizeProduct 
} from './productUtils';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const statusBarHeight = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;

const ProductsScreen = ({ navigation }) => {
  const { user, API } = useContext(AuthContext);
  const { wishlist } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const route = useRoute(); // <<--- USAR HOOK useRoute

  const initialCategoryRaiz = route.params?.categoriaRaiz || null; // <<--- OBTENER PARÁMETRO
  
  // Estados de carga
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Estados de filtros
  const [searchText, setSearchText] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    category: initialCategoryRaiz,
    subcategory: null,
    collection: null,
    priceRange: { min: 0, max: 1000 },
    status: 'available'
  });

  const [fontsLoaded] = useFonts({
    'Quicksand-Bold': require('../../../assets/fonts/Quicksand-Bold.ttf'),
    'Quicksand-Medium': require('../../../assets/fonts/Quicksand-Medium.ttf'),
    'Nunito-Bold': require('../../../assets/fonts/Nunito-Bold.ttf'),
    'Nunito-SemiBold': require('../../../assets/fonts/Nunito-SemiBold.ttf'),
    'Nunito-Medium': require('../../../assets/fonts/Nunito-Medium.ttf'),
  });

  useEffect(() => {
    loadInitialData();
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [searchText, activeFilters, products]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadProducts(),
        loadCategories(),
        loadSubcategories(),
        loadCollections()
      ]);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await fetch(`${API}/public/products`);
      if (response.ok) {
        const data = await response.json();
        // Sanitizar productos para evitar errores de referencias undefined
        const sanitizedProducts = data.map(product => sanitizeProduct(product)).filter(Boolean);
        setProducts(sanitizedProducts);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await fetch(`${API}/public/categories`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadSubcategories = async () => {
    try {
      const response = await fetch(`${API}/public/subcategories`);
      if (response.ok) {
        const data = await response.json();
        setSubcategories(data);
      }
    } catch (error) {
      console.error('Error loading subcategories:', error);
    }
  };

  const loadCollections = async () => {
    try {
      const response = await fetch(`${API}/public/collections`);
      if (response.ok) {
        const data = await response.json();
        setCollections(data);
      }
    } catch (error) {
      console.error('Error loading collections:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Filtro por texto de búsqueda
    if (searchText.trim()) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(product =>
        (product.name && product.name.toLowerCase().includes(searchLower)) ||
        (product.description && product.description.toLowerCase().includes(searchLower))
      );
    }

    // Filtro por categoría usando utility function
    if (activeFilters.category) {
      filtered = filterProductsByCategory(filtered, activeFilters.category);
    }

    // Filtro por subcategoría usando utility function
    if (activeFilters.subcategory) {
      filtered = filterProductsBySubcategory(filtered, activeFilters.subcategory);
    }

    // Filtro por colección usando utility function
    if (activeFilters.collection) {
      filtered = filterProductsByCollection(filtered, activeFilters.collection);
    }

    // Filtro por estado (solo disponibles por defecto)
    if (activeFilters.status === 'available') {
      filtered = filtered.filter(product => 
        product.status === 'disponible' && product.stock > 0
      );
    }

    // Filtro por rango de precios
    filtered = filtered.filter(product => {
      const price = product.discount > 0 ? 
        product.price * (1 - product.discount) : 
        product.price;
      return price >= activeFilters.priceRange.min && 
             price <= activeFilters.priceRange.max;
    });

    setFilteredProducts(filtered);
  };

  const clearFilters = () => {
    setActiveFilters({
      category: null,
      subcategory: null,
      collection: null,
      priceRange: { min: 0, max: 1000 },
      status: 'available'
    });
    setSearchText('');
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (activeFilters.category) count++;
    if (activeFilters.subcategory) count++;
    if (activeFilters.collection) count++;
    if (searchText.trim()) count++;
    return count;
  };

  const navigateToProduct = (product) => {
    navigation.navigate('ProductDetail', { productId: product._id });
  };

  const renderProduct = ({ item }) => (
    <ProductCard
      product={item}
      onPress={navigateToProduct}
    />
  );

  const renderFilterModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showFilters}
      onRequestClose={() => setShowFilters(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.filterModal}>
          <View style={styles.filterHeader}>
            <Text style={styles.filterTitle}>Filtros</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Ionicons name="close" size={24} color="#3D1609" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.filterContent}>
            {/* Categorías */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Categoría</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    !activeFilters.category && styles.filterChipActive
                  ]}
                  onPress={() => setActiveFilters(prev => ({ ...prev, category: null }))}
                >
                  <Text style={[
                    styles.filterChipText,
                    !activeFilters.category && styles.filterChipTextActive
                  ]}>Todas</Text>
                </TouchableOpacity>
                
                {categories.map(category => (
                  <TouchableOpacity
                    key={category._id}
                    style={[
                      styles.filterChip,
                      activeFilters.category === category._id && styles.filterChipActive
                    ]}
                    onPress={() => setActiveFilters(prev => ({ 
                      ...prev, 
                      category: category._id,
                      subcategory: null // Reset subcategory when changing category
                    }))}
                  >
                    <Text style={[
                      styles.filterChipText,
                      activeFilters.category === category._id && styles.filterChipTextActive
                    ]}>{category.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Subcategorías */}
            {activeFilters.category && (
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Subcategoría</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <TouchableOpacity
                    style={[
                      styles.filterChip,
                      !activeFilters.subcategory && styles.filterChipActive
                    ]}
                    onPress={() => setActiveFilters(prev => ({ ...prev, subcategory: null }))}
                  >
                    <Text style={[
                      styles.filterChipText,
                      !activeFilters.subcategory && styles.filterChipTextActive
                    ]}>Todas</Text>
                  </TouchableOpacity>
                  
                  {getSubcategoriesByCategory(subcategories, activeFilters.category)
                    .map(subcategory => (
                    <TouchableOpacity
                      key={subcategory._id}
                      style={[
                        styles.filterChip,
                        activeFilters.subcategory === subcategory._id && styles.filterChipActive
                      ]}
                      onPress={() => setActiveFilters(prev => ({ 
                        ...prev, 
                        subcategory: subcategory._id 
                      }))}
                    >
                      <Text style={[
                        styles.filterChipText,
                        activeFilters.subcategory === subcategory._id && styles.filterChipTextActive
                      ]}>{subcategory.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Colecciones */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Colección</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    !activeFilters.collection && styles.filterChipActive
                  ]}
                  onPress={() => setActiveFilters(prev => ({ ...prev, collection: null }))}
                >
                  <Text style={[
                    styles.filterChipText,
                    !activeFilters.collection && styles.filterChipTextActive
                  ]}>Todas</Text>
                </TouchableOpacity>
                
                {collections.map(collection => (
                  <TouchableOpacity
                    key={collection._id}
                    style={[
                      styles.filterChip,
                      activeFilters.collection === collection._id && styles.filterChipActive
                    ]}
                    onPress={() => setActiveFilters(prev => ({ 
                      ...prev, 
                      collection: collection._id 
                    }))}
                  >
                    <Text style={[
                      styles.filterChipText,
                      activeFilters.collection === collection._id && styles.filterChipTextActive
                    ]}>{collection.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </ScrollView>

          <View style={styles.filterFooter}>
            <TouchableOpacity style={styles.clearFiltersBtn} onPress={clearFilters}>
              <Text style={styles.clearFiltersText}>Limpiar filtros</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.applyFiltersBtn} 
              onPress={() => setShowFilters(false)}
            >
              <Text style={styles.applyFiltersText}>Aplicar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A73249" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Productos</Text>
        
        {/* Barra de búsqueda */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#A73249" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar productos..."
            placeholderTextColor="#A73249AA"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* Botones de filtro y vista */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilters(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="options" size={20} color="#A73249" />
            <Text style={styles.filterButtonText}>Filtros</Text>
            {getActiveFiltersCount() > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{getActiveFiltersCount()}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Lista de productos */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#A73249" />
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          keyExtractor={item => item._id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.productsList}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="storefront-outline" size={64} color="#3D1609" />
              <Text style={styles.emptyText}>No se encontraron productos</Text>
              <Text style={styles.emptySubtext}>
                {searchText || getActiveFiltersCount() > 0
                  ? 'Intenta ajustar los filtros'
                  : 'No hay productos disponibles'
                }
              </Text>
            </View>
          }
        />
      )}

      {/* Modal de filtros */}
      {renderFilterModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3C6B8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E3C6B8',
  },
  header: {
    backgroundColor: '#E3C6B8',
    paddingTop: statusBarHeight + 10,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8D5C9',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Quicksand-Bold',
    color: '#3D1609',
    marginBottom: 16,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E8D5C9',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Nunito-Medium',
    color: '#3D1609',
    paddingVertical: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#A73249',
    position: 'relative',
  },
  filterButtonText: {
    color: '#A73249',
    fontSize: 14,
    fontFamily: 'Quicksand-Bold',
    marginLeft: 6,
  },
  filterBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#A73249',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Quicksand-Bold',
  },
  productsList: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Quicksand-Bold',
    color: '#333333',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Nunito-Medium',
    color: '#222222',
    marginTop: 4,
    textAlign: 'center',
  },

  // Estilos del modal de filtros
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  filterModal: {
    backgroundColor: '#F5EDE8',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: screenHeight * 0.8,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E8D5C9',
  },
  filterTitle: {
    fontSize: 18,
    fontFamily: 'Quicksand-Bold',
    color: '#3D1609',
  },
  filterContent: {
    padding: 20,
    maxHeight: screenHeight * 0.5,
  },
  filterSection: {
    marginBottom: 20,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontFamily: 'Quicksand-Bold',
    color: '#3D1609',
    marginBottom: 12,
  },
  filterChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E8D5C9',
  },
  filterChipActive: {
    backgroundColor: '#A73249',
    borderColor: '#A73249',
  },
  filterChipText: {
    fontSize: 14,
    fontFamily: 'Nunito-Medium',
    color: '#3D1609',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontFamily: 'Nunito-Bold',
  },
  filterFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E8D5C9',
    gap: 12,
  },
  clearFiltersBtn: {
    flex: 1,
    backgroundColor: '#E8D5C9',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  clearFiltersText: {
    color: '#3D1609',
    fontFamily: 'Quicksand-Bold',
    fontSize: 14,
  },
  applyFiltersBtn: {
    flex: 1,
    backgroundColor: '#A73249',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  applyFiltersText: {
    color: '#FFFFFF',
    fontFamily: 'Quicksand-Bold',
    fontSize: 14,
  },
});

export default ProductsScreen;
