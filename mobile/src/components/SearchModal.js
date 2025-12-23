import { Ionicons } from '@expo/vector-icons';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import { SearchSlash } from 'lucide-react-native';
import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 

const { width, height } = Dimensions.get('window');

const SearchModal = ({ visible, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([
    'Anillos de plata',
    'Pulseras bohemias',
    'Collares vintage',
    'Aretes dorados',
  ]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const slideAnim = useRef(new Animated.Value(height)).current;
  const searchInputRef = useRef(null);

  const [fontsLoaded] = useFonts({
      'CormorantGaramond-Bold': require('../../assets/fonts/CormorantGaramond-Bold.ttf'),
      'Nunito-Black': require('../../assets/fonts/Nunito-Black.ttf'),
      'Nunito-Bold': require('../../assets/fonts/Nunito-Bold.ttf'),
      'Nunito-Regular': require('../../assets/fonts/Nunito-Regular.ttf'),
      'Quicksand-Medium': require('../../assets/fonts/Quicksand-Medium.ttf'),
      'Quicksand-Bold': require('../../assets/fonts/Quicksand-Bold.ttf'),
    });
  // Datos de productos de ejemplo
  const allProducts = [
    { id: 1, name: 'Anillo de Plata Bohemio', category: 'Anillos', price: '$45.00', emoji: '💍' },
    { id: 2, name: 'Pulsera Turquesa Natural', category: 'Pulseras', price: '$35.00', emoji: '🔵' },
    { id: 3, name: 'Collar Corazón Vintage', category: 'Collares', price: '$65.00', emoji: '💖' },
    { id: 4, name: 'Aretes Dorados Elegantes', category: 'Aretes', price: '$28.00', emoji: '✨' },
    { id: 5, name: 'Pulsera Perlas Marinas', category: 'Pulseras', price: '$50.00', emoji: '🌊' },
    { id: 6, name: 'Anillo Floral Delicado', category: 'Anillos', price: '$42.00', emoji: '🌸' },
    { id: 7, name: 'Collar Mariposa Única', category: 'Collares', price: '$58.00', emoji: '🦋' },
    { id: 8, name: 'Pulsera Miel Dorada', category: 'Pulseras', price: '$38.00', emoji: '🍯' },
  ];

  const popularCategories = [
    { name: 'Anillos', emoji: '💍', color: '#FFE4E1' },
    { name: 'Pulseras', emoji: '🔵', color: '#E6F3FF' },
    { name: 'Collares', emoji: '💖', color: '#FCE4EC' },
    { name: 'Aretes', emoji: '✨', color: '#FFF9C4' },
  ];

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 300);
    } else {
      Animated.spring(slideAnim, {
        toValue: height,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    }
  }, [visible]);

  // Mostrar un indicador de carga hasta que las fuentes estén disponibles
  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim().length > 0) {
      setIsSearching(true);
      // Simular búsqueda
      setTimeout(() => {
        const results = allProducts.filter(product =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(results);
        setIsSearching(false);
      }, 500);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  const addToRecentSearches = (query) => {
    if (query.trim() && !recentSearches.includes(query.trim())) {
      setRecentSearches(prev => [query.trim(), ...prev.slice(0, 4)]);
    }
  };

  const handleSubmitSearch = () => {
    if (searchQuery.trim()) {
      addToRecentSearches(searchQuery);
      handleSearch(searchQuery);
    }
  };

  const handleCategoryPress = (category) => {
    setSearchQuery(category);
    handleSearch(category);
    addToRecentSearches(category);
  };

  const handleRecentSearchPress = (search) => {
    setSearchQuery(search);
    handleSearch(search);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  const renderSearchResult = ({ item }) => (
    <TouchableOpacity style={styles.resultItem}>
      <View style={styles.resultEmoji}>
        <Text style={styles.resultEmojiText}>{item.emoji}</Text>
      </View>
      <View style={styles.resultInfo}>
        <Text style={styles.resultName}>{item.name}</Text>
        <Text style={styles.resultCategory}>{item.category}</Text>
      </View>
      <Text style={styles.resultPrice}>{item.price}</Text>
    </TouchableOpacity>
  );

  const renderRecentSearch = ({ item }) => (
    <TouchableOpacity 
      style={styles.recentItem}
      onPress={() => handleRecentSearchPress(item)}
    >
      <Text style={styles.recentIcon}>🕐</Text>
      <Text style={styles.recentText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderCategory = ({ item }) => (
    <TouchableOpacity 
      style={[styles.categoryItem, { backgroundColor: item.color }]}
      onPress={() => handleCategoryPress(item.name)}
    >
      <Text style={styles.categoryEmoji}>{item.emoji}</Text>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={true}
      statusBarTranslucent={true}
    >
      <View style={styles.overlay}>
        <Animated.View 
          style={[
            styles.searchContainer,
            {
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {/* Header */}
          <View style={styles.searchHeader}>
            <TouchableOpacity style={styles.backButton} onPress={onClose}>
               <Ionicons name="chevron-back" size={26} color="#000" />
            </TouchableOpacity>
            <View style={styles.searchInputContainer}>
              <Icon name="search" size={20} style={styles.searchIcon}/>
              <TextInput
                ref={searchInputRef}
                style={styles.searchInput}
                placeholder="Buscar..."
                value={searchQuery}
                onChangeText={handleSearch}
                onSubmitEditing={handleSubmitSearch}
                returnKeyType="search"
                placeholderTextColor="#999"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity 
                  style={styles.clearButton}
                  onPress={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                    setIsSearching(false);
                  }}
                >
                  <Text style={styles.clearIcon}>×</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Content */}
          <View style={styles.searchContent}>
            {isSearching ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Buscando...</Text>
              </View>
            ) : searchResults.length > 0 ? (
              <FlatList
                data={searchResults}
                renderItem={renderSearchResult}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.resultsContainer}
              />
            ) : searchQuery.length > 0 ? (
              <View style={styles.noResultsContainer}>
                <SearchSlash style={styles.noResultsIcon} size={60}/>
                <Text style={styles.noResultsText}>No se encontraron resultados</Text>
                <Text style={styles.noResultsSubtext}>
                  Intenta con otros términos de búsqueda
                </Text>
              </View>
            ) : (
              <View>
                {/* Categorías Populares */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Categorías Populares</Text>
                  <FlatList
                    data={popularCategories}
                    renderItem={renderCategory}
                    numColumns={2}
                    keyExtractor={(item) => item.name}
                    contentContainerStyle={styles.categoriesContainer}
                    scrollEnabled={false}
                  />
                </View>

                {/* Búsquedas Recientes */}
                {recentSearches.length > 0 && (
                  <View style={styles.section}>
                    <View style={styles.recentHeader}>
                      <Text style={styles.sectionTitle}>Búsquedas Recientes</Text>
                      <TouchableOpacity onPress={clearRecentSearches}>
                        <Text style={styles.clearRecentText}>Limpiar</Text>
                      </TouchableOpacity>
                    </View>
                    <FlatList
                      data={recentSearches}
                      renderItem={renderRecentSearch}
                      keyExtractor={(item, index) => index.toString()}
                      showsVerticalScrollIndicator={false}
                    />
                  </View>
                )}
              </View>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  searchContainer: {
    flex: 1,
    backgroundColor: '#F8F3F0',
    marginTop: 40,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
    backgroundColor: '#E8E1d8',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  backButton: {
    marginRight: 15,
  },
  backIcon: {
    fontSize: 24,
    color: '#333',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    paddingHorizontal: 15,
  },
  searchIcon: {
    marginRight: 10,
    color: '#3d1609',
  },
  searchInput: {
    flex: 1,
    height: 45,
    fontFamily: "Quicksand-Medium",
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 5,
  },
  clearIcon: {
    fontSize: 20,
    color: '#999',
  },
  searchContent: {
    flex: 1,
    backgroundColor: '#F8F3F0',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'Quicksand-Medium',
    fontSize: 16,
    color: '#333',
  },
  resultsContainer: {
    padding: 20,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  resultEmoji: {
    width: 50,
    height: 50,
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  resultEmojiText: {
    fontSize: 20,
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
    fontSize: 16,
    fontFamily: 'Quicksand-Bold',
    color: '#333',
    marginBottom: 2,
  },
  resultCategory: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#666',
  },
  resultPrice: {
    fontSize: 16,
    fontFamily: 'Quicksand-Bold',
    color: '#FF4757',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  noResultsIcon: {
    marginBottom: 20,
  },
  noResultsText: {
    fontSize: 18,
    fontFamily: "Quicksand-Bold",
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#666',
    fontFamily: "Nunito-Regular",
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    color: '#000',
    marginBottom: 15,
  },
  categoriesContainer: {
    justifyContent: 'space-between',
  },
  categoryItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    margin: 5,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  categoryEmoji: {
    fontSize: 24,
    marginRight: 10,
  },
  categoryName: {
    fontSize: 16,
    fontFamily: 'Quicksand-Medium',
    color: '#333',
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  clearRecentText: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#FF4757',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  recentIcon: {
    fontSize: 16,
    marginRight: 12,
    color: '#666',
  },
  recentText: {
    fontSize: 16,
    fontFamily: 'Quicksand-Medium',
    color: '#333',
  },
});

export default SearchModal;