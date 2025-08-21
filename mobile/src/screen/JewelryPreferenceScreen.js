import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import StyleSelector from "../components/StyleSelector";
import OccasionDropdown from "../components/OccasionDropdown";

export default function JewelryPreferenceScreen({ navigation }) {
  const handleStyleSelected = (style) => {
    console.log("Selected style:", style);
  };

  const handleOccasionSelected = (occasion) => {
    console.log("Selected occasion:", occasion);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.skip}>Saltar</Text>

      <Text style={styles.title}>Cuéntanos{"\n"}sobre ti</Text>

      <Text style={styles.sectionTitle}>Selecciona un estilo de joya preferido:</Text>
      <StyleSelector onSelect={handleStyleSelected} />

      <Text style={styles.sectionTitle}>Selecciona la ocasión más usual por la cual deseas comprar:</Text>
      <OccasionDropdown onSelect={handleOccasionSelected} />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#E4C3B7",
    padding: 20,
  },
  skip: {
    alignSelf: "flex-end",
    color: "#333",
    fontSize: 14,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 20,
    lineHeight: 34,
  },
  sectionTitle: {
    fontSize: 16,
    marginVertical: 10,
    color: "#333",
  },
  button: {
    backgroundColor: "#9C2D38",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
