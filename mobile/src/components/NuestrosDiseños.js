import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';

const NuestrosDiseños = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigation = useNavigation();

  const [fontsLoaded] = useFonts({
    'CormorantGaramond-Bold': require('../../assets/fonts/CormorantGaramond-Bold.ttf'),
    'Nunito-Black': require('../../assets/fonts/Nunito-Black.ttf'),
    'Quicksand': require('../../assets/fonts/Quicksand-Regular.ttf'),
    'Quicksand-Bold': require('../../assets/fonts/Quicksand-Bold.ttf'),
    'Quicksand-BoldItalic': require('../../assets/fonts/Quicksand-BoldItalic.ttf'),
  });

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch('https://pergola.onrender.com/api/public/categories');
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        setCategorias(data);
      } catch (error) {
        setError(error.message);
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  // 3. Función de manejo de la pulsación para navegar
  const handleItemPress = (categoryId, categoryName, categoryImage) => {
    // Redirige a la pantalla 'CategoryDetail' (ajusta el nombre de la ruta si es necesario)
    // y pasa el ID y el nombre del ítem como parámetros.
    navigation.navigate('CategoryDetail', {
      categoryId: categoryId,
      categoryName: categoryName,
      categoryImage: categoryImage
    });
    console.log(`Navegando a: ${categoryName} (${categoryId})`);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3d1609" />
        <Text style={styles.loadingText}>Cargando nuestros diseños...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (categorias.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.noDataText}>No hay productos disponibles</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      horizontal
      showsVerticalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.gridContainer}
    >
    {categorias.map((cat) => (
        <TouchableOpacity 
          key={cat._id || cat.id} 
          style={styles.gridItem}
          onPress={() => handleItemPress(cat._id || cat.id, cat.name, cat.image)}
        >
          {/* Container de la imagen con aspect ratio fijo */}
          <View style={styles.imageWrapper}>
            {cat.image ? (
              <Image 
                source={{ uri: cat.image }} 
                style={styles.backgroundImage}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>Sin imagen</Text>
              </View>
            )}
            {/* Overlay oscuro para legibilidad */}
            <View style={styles.overlay} />
          </View>
          {/* Container del texto con altura mínima */}
          <View style={styles.contentContainer}>
            <Text style={styles.categoryTitle} ellipsizeMode="tail" numberOfLines={2}>
              {cat.name}
            </Text>
            {cat.price && (
              <Text style={styles.categoryPrice}>Desde ${cat.price}</Text>
            )}
          </View>
        </TouchableOpacity>
    ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  gridItem: {
    width: 200,
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#3d1609',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
    backgroundColor: '#f8f4f1',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0ebe8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 12,
    color: '#999',
    fontFamily: "Quicksand",
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    backgroundColor: 'rgba(61, 22, 9, 0.75)',
    background: 'linear-gradient(to top, rgba(61, 22, 9, 0.9), transparent)',
  },
  contentContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  categoryTitle: {
    fontSize: 18,
    fontFamily: "Quicksand-Bold",
    color: '#FFFFFF',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  categoryDescription: {
    fontSize: 13,
    fontFamily: "Quicksand",
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 6,
    lineHeight: 18,
  },
  categoryPrice: {
    fontSize: 16,
    fontFamily: "Quicksand-Bold",
    color: '#FFD700',
    marginTop: 4,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 14,
    color: '#3d1609',
    fontFamily: "Quicksand",
    marginTop: 10,
  },
  errorText: {
    fontSize: 14,
    color: '#FF4757',
    fontFamily: "Quicksand-Bold",
    textAlign: 'center',
  },
  noDataText: {
    fontSize: 14,
    color: '#3d1609',
    fontFamily: "Quicksand",
    textAlign: 'center',
  },
});

export default NuestrosDiseños;