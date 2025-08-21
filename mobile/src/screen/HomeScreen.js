import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  FlatList,
  Dimensions
} from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';


const { width } = Dimensions.get("window");

export default function HomeScreen({ navigation }) {

  // Placeholder data para colecciones y productos
  const collections = [null, null, null]; // 3 colecciones vacías
  const products = [
    { id: 1, title: "Producto 1" },
    { id: 2, title: "Producto 2" },
    { id: 3, title: "Producto 3" },
  ];

  const renderCollection = (item, index) => (
    <View key={index} style={styles.collectionCircle}>
      {item ? <Image source={{uri: item.image}} style={styles.collectionImage}/> : null}
    </View>
  );

  const renderProduct = ({ item }) => (
    <View style={styles.productContainer}>
      <Image
        source={{ uri: "https://via.placeholder.com/159x220" }}
        style={styles.productImage}
      />
      <TouchableOpacity style={styles.favoriteIcon}>
        <AntDesign name="heart" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.productTitle}>{item.title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {}}>
          <Image
            source={{ uri: "https://via.placeholder.com/40" }}
            style={styles.profileIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.exploreButton} onPress={() => {}}>
          <Text style={styles.exploreButtonText}>Explorar productos</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {}}>
          <MaterialIcons name="notifications-none" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <TextInput
        placeholder="Buscar..."
        style={styles.searchInput}
      />

      {/* Sección Diseños Pergola */}
      <View style={styles.sectionHeader}>
        <Text style={styles.linkText}>Ver todo</Text>
        <Text style={styles.sectionTitle}>Diseños Pergola</Text>
      </View>

      <View style={styles.collectionsContainer}>
        {collections.map(renderCollection)}
      </View>

      {/* Sección Selección Exclusiva */}
      <View style={styles.sectionHeader}>
        <Text style={styles.linkText}>Ver todo</Text>
        <Text style={styles.sectionTitle}>Selección Exclusiva</Text>
      </View>

      <FlatList
        data={products}
        horizontal
        keyExtractor={item => item.id.toString()}
        renderItem={renderProduct}
        showsHorizontalScrollIndicator={false}
        style={styles.carousel}
      />

      {/* Sección Diseños Únicos */}
      <View style={styles.sectionHeader}>
        <Text style={styles.linkText}>Ver todo</Text>
        <Text style={styles.sectionTitle}>Diseños Únicos</Text>
      </View>

      <FlatList
        data={products}
        horizontal
        keyExtractor={item => item.id.toString()}
        renderItem={renderProduct}
        showsHorizontalScrollIndicator={false}
        style={styles.carousel}
      />

      {/* Footer flotante */}
      <View style={styles.footer}>
        <TouchableOpacity>
          <AntDesign name="home" size={24} color="black" style={styles.footerIcon}/>
        </TouchableOpacity>
        <TouchableOpacity>
          <AntDesign name="shoppingcart" size={24} color="black"  style={styles.footerIcon}/>
        </TouchableOpacity>
        <TouchableOpacity>
          <Entypo name="flow-line" size={24} color="black"  style={styles.footerIcon}/>
        </TouchableOpacity>
        <TouchableOpacity>
          <AntDesign name="profile" size={24} color="black" style={styles.footerIcon}/>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E3C6B8",
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  profileIcon: { width: 40, height: 40, borderRadius: 20 },
  exploreButton: {
    width: 178,
    height: 42,
    backgroundColor: "#fff",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  exploreButtonText: { color: "#000", fontWeight: "bold" },
  notificationIcon: { width: 40, height: 40, tintColor: "#A73249" },

  searchInput: {
    width: 342,
    height: 40,
    backgroundColor: "#E8E1D8",
    borderRadius: 8,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    marginBottom: 10,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  sectionTitle: { fontWeight: "bold", fontSize: 16 },
  linkText: { color: "#3D1609", fontSize: 14 },

  collectionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  collectionCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#E8E1D8",
    alignItems: "center",
    justifyContent: "center",
  },
  collectionImage: { width: 56, height: 56, borderRadius: 28 },

  carousel: {
    marginBottom: 20,
    paddingLeft: 20,
  },
  productContainer: {
    width: 159,
    marginRight: 15,
  },
  productImage: {
    width: "100%",
    height: 220,
    borderRadius: 8,
  },
  favoriteIcon: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 24,
    height: 24,
  },
  heartIcon: {
    width: 24,
    height: 24,
    tintColor: "#3D1609",
  },
  productTitle: {
    textAlign: "center",
    marginTop: 5,
  },

  footer: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: "#E8E1D8",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderRadius: 20,
  },
  footerIcon: { width: 40, height: 40 },
});
