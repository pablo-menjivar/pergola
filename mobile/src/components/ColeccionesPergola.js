import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';


const ColeccionesPergola = () => {
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
        const response = await fetch('https://pergola.onrender.com/api/public/collections');
        
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

  // Función de manejo de la pulsación para navegar
  const handleCollectionPress = (collectionId, collectionName, collectionImage) => {
+   navigation.navigate('CollectionDetail', {
      collectionId: collectionId,
      collectionName: collectionName,
      collectionImage: collectionImage
    });
    console.log(`Navegando a: ${collectionName} (${collectionId})`);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3d1609" />
        <Text style={styles.loadingText}>Cargando colecciones...</Text>
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
        <Text style={styles.noDataText}>No hay colecciones disponibles</Text>
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
        // Uso de TouchableOpacity para hacer el elemento pulsable
        <TouchableOpacity 
          key={col._id || col.id} 
          style={styles.creacionItem}
          onPress={() => handleCollectionPress(col._id || col.id, col.name, col.image)}
        >
          <View style={styles.creacionImage}>
            {col.image ? (
              <Image 
                source={{ uri: col.image }} 
                style={styles.circleImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>Sin imagen</Text>
              </View>
            )}
          </View>
          <Text style={styles.creacionText}>{col.name}</Text>
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
  },
  creacionItem: {
    alignItems: 'center',
    marginHorizontal: 15,
    width: 80,
  },
  creacionImage: {
    width: 70,
    height: 70,
    backgroundColor: 'white',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    overflow: 'hidden',
  },
  circleImage: {
    width: '100%',
    height: '100%',
    borderRadius: 35,
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    borderRadius: 35,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 10,
    color: '#666',
    fontFamily: "Quicksand",
  },
  creacionText: {
    fontSize: 12,
    color: '#3d1609',
    textAlign: 'center',
    lineHeight: 16,
    fontFamily: "Quicksand-Bold",
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

export default ColeccionesPergola;