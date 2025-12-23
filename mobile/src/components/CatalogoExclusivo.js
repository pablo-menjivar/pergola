import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';

const CatalogoExclusivo = () => {
  const [colecciones, setColecciones] = useState([]);
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
    const fetchColecciones = async () => {
      try {
        const response = await fetch('https://pergola.onrender.com/api/public/subcategories');
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        setColecciones(data);
      } catch (error) {
        setError(error.message);
        console.error('Error fetching collections:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchColecciones();
  }, []);

  // 3. Función de manejo de la pulsación para navegar
  const handleItemPress = (itemId, itemName, itemImage) => {
    // Redirige a la pantalla 'SubcategoryDetail' (ajusta el nombre de la ruta si es necesario)
    // y pasa el ID y el nombre del ítem como parámetros.
    navigation.navigate('SubcategoryDetail', {
      itemId: itemId,
      itemName: itemName,
      itemImage: itemImage
    });
    console.log(`Navegando a: ${itemName} (${itemId})`);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3d1609" />
        <Text style={styles.loadingText}>Cargando catálogo...</Text>
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

  if (colecciones.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.noDataText}>No hay productos disponibles</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.horizontalScroll}
      contentContainerStyle={styles.scrollContent}
    >
      {colecciones.map((col) => (
        // 4. Uso de TouchableOpacity para hacer el elemento pulsable
        <TouchableOpacity 
          key={col._id || col.id} 
          style={styles.exclusivaItem}
          onPress={() => handleItemPress(col._id || col.id, col.name, col.image)}
          activeOpacity={0.7}
        >
          {/* Container de la imagen con aspect ratio fijo */}
          <View style={styles.imageContainer}>
            {col.image ? (
              <Image 
                source={{ uri: col.image }} 
                style={styles.exclusivaImage}
                resizeMode="contain" 
              />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>Sin imagen</Text>
              </View>
            )}
          </View>
          
          {/* Container del texto con altura mínima */}
          <View style={styles.textContainer}>
            <Text 
              style={styles.exclusivaTitle}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {col.name}
            </Text>
            {col.price && (
              <Text style={styles.exclusivaPrice}>${col.price}</Text>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  horizontalScroll: {
    marginHorizontal: -5,
  },
  scrollContent: {
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  exclusivaItem: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 12,
    marginHorizontal: 8,
    width: 160,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    // Mejora para iOS
    shadowColor: '#3d1609',
  },
  // Contenedor de imagen con aspect ratio consistente
  imageContainer: {
    width: '100%',
    aspectRatio: 1, 
    borderRadius: 15,
    marginBottom: 12,
    backgroundColor: '#f8f4f1', // Color de fondo suave
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  exclusivaImage: {
    height: 80,
    width: '100%',
    borderRadius: 10,
    marginBottom: 10,
  },
  placeholderImage: {
    height: 80,
    width: '100%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0ebe8',
  },
  placeholderText: {
    fontSize: 11,
    color: '#999',
    fontFamily: "Quicksand",
  },
  // Contenedor de texto con altura consistente
  textContainer: {
    justifyContent: 'flex-start',
  },
  exclusivaTitle: {
    fontSize: 13,
    fontFamily: "Quicksand-Bold",
    color: '#3d1609',
    marginBottom: 4,
    lineHeight: 18,
    // Altura máxima para 2 líneas
    maxHeight: 36,
  },
  exclusivaPrice: {
    fontSize: 15,
    fontFamily: "Quicksand-Bold",
    color: '#a73249',
    marginTop: 2,
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

export default CatalogoExclusivo;