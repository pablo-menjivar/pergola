// src/screens/catalog/PiecesFilterScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const piezas = [
  "Anillos",
  "Pulseras",
  "Cadenas",
  "Collar",
  "Gargantilla",
  "Aretes",
  "Pendientes",
  "Ear Cuff",
  "Tobillera (rosa)",
  "Tobillera (blanco)",
];

export default function PiecesFilterScreen({ route }) {
  const navigation = useNavigation();
  const [selected, setSelected] = useState(null);

  const handleSelect = (item) => {
    setSelected(item);
    // aquí puedes guardar en estado global o pasar el valor
    navigation.goBack();
  };

  const renderItem = ({ item, index }) => {
    const isSelected = selected === item;
    const isPink = index % 2 === 0; // alterna rosa/blanco

    return (
      <TouchableOpacity
        style={[
          styles.option,
          {
            backgroundColor: isSelected
              ? "#A73249" // activo
              : isPink
              ? "#F8C4CC" // rosa
              : "#fff", // blanco
          },
        ]}
        onPress={() => handleSelect(item)}
      >
        <Text
          style={[
            styles.optionText,
            isSelected && { color: "#fff", fontWeight: "600" },
          ]}
        >
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Elige una pieza</Text>
      </View>

      {/* Lista */}
      <FlatList
        data={piezas}
        renderItem={renderItem}
        keyExtractor={(item, idx) => idx.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#3D1609",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  backText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#3D1609",
  },
  option: {
    height: 64,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
});
