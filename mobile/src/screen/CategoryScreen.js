import { useState, useEffect, useContext, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar, 
  Animated,
  FlatList
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import { AuthContext } from '../context/AuthContext';
import ProductCard from '../components/product/ProductCard';

const CategoryDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  const { categoryId, categoryName, categoryImage } = route.params;

  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [fontsLoaded] = useFonts({
    'CormorantGaramond-Bold': require('../../assets/fonts/CormorantGaramond-Bold.ttf'),
    'Nunito-Black': require('../../assets/fonts/Nunito-Black.ttf'),
    'Nunito-Bold': require('../../assets/fonts/Nunito-Bold.ttf'),
    'Nunito-Regular': require('../../assets/fonts/Nunito-Regular.ttf'),
    'Quicksand': require('../../assets/fonts/Quicksand-Regular.ttf'),
    'Quicksand-Bold': require('../../assets/fonts/Quicksand-Bold.ttf'),
  });

  useEffect(() => {
    const fetchCategoryDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        // Hacer petición a la API para obtener todas las categorías
        const response = await fetch('https://pergola.onrender.com/api/public/categories');

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const allCategories = await response.json();

        // Buscar la categoría específica por ID
        const foundCategory = allCategories.find(category => category._id === categoryId);

        if (foundCategory) {
          setCategory(foundCategory);
        } else {
          // Si no encuentra, usar datos básicos de los parámetros
          setCategory({
            _id: categoryId,
            name: categoryName,
            image: categoryImage,
            description: 'Una exclusiva selección de joyas cuidadosamente diseñadas para realzar tu estilo único y elegancia natural.'
          });
        }

      } catch (err) {
        console.error('Error fetching category:', err);
        setError('No se pudo cargar la categoría');

        // Fallback: usar datos básicos si la API falla
        setCategory({
          _id: categoryId,
          name: categoryName,
          image: categoryImage,
          description: 'Una exclusiva selección de joyas cuidadosamente diseñadas para realzar tu estilo único y elegancia natural.'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryDetail();

  }, [categoryId, categoryName, categoryImage]);

  const handleBack = () => {
    navigation.goBack();
  };

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar barStyle="dark-content" backgroundColor="#E3C6B8" />
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#3D1609" />
          <Text style={styles.loadingText}>Cargando categoría...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#E3C6B8" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
          <Ionicons name="chevron-back" size={26} color="#3D1609" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Categorías</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.imageContainer}>
            {category?.image ? (
              <Image
                source={{ uri: category.image }}
                style={styles.categoryImage}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.placeholderImage}>
                <Ionicons name="images-outline" size={50} color="#E8E1D8" />
                <Text style={styles.placeholderText}>Sin imagen</Text>
              </View>
            )}
          </View>

          <View style={styles.categoryInfo}>
            <Text style={styles.categoryName}>
              {category?.name}
            </Text>

            {category?.description && (
              <Text style={styles.categoryDescription}>
                {category.description}
              </Text>
            )}
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Características</Text>

          <View style={styles.featuresGrid}>
            <View style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Ionicons name="diamond-outline" size={24} color="#A73249" />
              </View>
              <Text style={styles.featureTitle}>Material Premium</Text>
              <Text style={styles.featureDescription}>
                Joyas elaboradas con materiales de la más alta calidad
              </Text>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Ionicons name="hand-left-outline" size={24} color="#A73249" />
              </View>
              <Text style={styles.featureTitle}>Hecho a Mano</Text>
              <Text style={styles.featureDescription}>
                Cada pieza es cuidadosamente elaborada con amor y dedicación.
              </Text>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Ionicons name="sparkles-outline" size={24} color="#A73249" />
              </View>
              <Text style={styles.featureTitle}>Diseño Exclusivo</Text>
              <Text style={styles.featureDescription}>
                Piezas únicas que reflejan tu estilo personal
              </Text>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Ionicons name="leaf-outline" size={24} color="#A73249" />
              </View>
              <Text style={styles.featureTitle}>Sostenible</Text>
              <Text style={styles.featureDescription}>
                Comprometidos con prácticas responsables y eco-amigables
              </Text>
            </View>
          </View>
        </View>

        {/* Grid de productos de la categoría */}
        <ProductsGrid categoryId={category?._id} navigation={navigation} />
      </ScrollView>
    </SafeAreaView>
  );
};

/// --- COMPONENTE GRID DE PRODUCTOS ---
function ProductsGrid({ categoryId, navigation }) {
  const { API } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API}/public/products`);
        if (response.ok) {
          const data = await response.json();
          // Filtrar productos por categoría
          const filtered = data.filter(
            (product) =>
              product.category &&
              (product.category._id === categoryId ||
                product.category === categoryId
              )
          );
          setProducts(filtered);
        } else {
          setProducts([]);
        }
      } catch (err) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    if (categoryId) fetchProducts();
  }, [categoryId, API]);

  const handleProductPress = (product) => {
    navigation.navigate("ProductDetail", { productId: product._id });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#A73249" />
        <Text style={styles.loadingText}>Cargando productos...</Text>
      </View>
    );
  }

  if (!products.length) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="storefront-outline" size={64} color="#3D1609" />
        <Text style={styles.emptyText}>No hay productos en esta categoría</Text>
      </View>
    );
  }

  return (
    <View style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
      <Text style={styles.sectionTitle}>Productos</Text>

      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => (
          <AnimatedProductCard
            product={item}
            index={index}
            onPress={handleProductPress}
            wishlist={wishlist}
            setWishlist={setWishlist}
          />
        )}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 10 }}
        scrollEnabled={false}
      />
    </View>
  );
}

// --- SUBCOMPONENTE CON ANIMACIÓN ---
function AnimatedProductCard({ product, index, onPress, wishlist, setWishlist }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, translateY, index]);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY }],
        width: "48%",
        marginBottom: 16,
      }}
    >
      <ProductCard
        product={product}
        onPress={onPress}
        wishlist={wishlist}
        setWishlist={setWishlist}
      />
    </Animated.View>
  );
}


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
    paddingVertical: 12,
  },
  backBtn: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 24,
    color: '#3D1609',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontFamily: 'Quicksand',
    fontSize: 16,
    color: '#3D1609',
    marginTop: 12,
  },
  heroSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#3D1609',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F5EDE8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontFamily: 'Quicksand',
    color: '#E8E1D8',
    fontSize: 14,
    marginTop: 8,
  },
  categoryInfo: {
    paddingHorizontal: 4,
  },
  categoryName: {
    fontFamily: 'CormorantGaramond-Bold',
    fontSize: 28,
    color: '#3D1609',
    marginBottom: 12,
    textAlign: 'center',
  },
  categoryDescription: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: '#3D1609',
    lineHeight: 22,
    textAlign: 'center',
    opacity: 0.9,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
    backgroundColor: '#E3C6B8',
  },
  emptyIconWrapper: {
    backgroundColor: '#F5EDE8',
    borderRadius: 50,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#3D1609',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  emptyText: {
    fontFamily: 'Quicksand',
    fontSize: 16,
    color: '#3D1609',
    textAlign: 'center',
    opacity: 0.8,
  },
  featuresSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 20,
    color: '#3D1609',
    marginBottom: 16,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  featureCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#3D1609',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F5EDE8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
    color: '#3D1609',
    textAlign: 'center',
    marginBottom: 4,
  },
  featureDescription: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    color: '#3D1609',
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 16,
  },
  comingSoonSection: {
    paddingHorizontal: 16,
  },
  comingSoonCard: {
    backgroundColor: '#F5EDE8',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8D5C9',
  },
  comingSoonTitle: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 20,
    color: '#3D1609',
    marginTop: 12,
    marginBottom: 8,
  },
  comingSoonDescription: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: '#3D1609',
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.8,
    marginBottom: 20,
  },
  notifyButton: {
    backgroundColor: '#A73249',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  notifyButtonText: {
    fontFamily: 'Quicksand-Bold',
    color: '#FFFFFF',
    fontSize: 14,
  },
});

export default CategoryDetailScreen;