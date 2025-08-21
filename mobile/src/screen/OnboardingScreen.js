import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import ColorPicker from "../components/ColorPicker";
import MaterialSelector from "../components/MaterialSelector";

export default function OnboardingScreen({ navigation }) {
  const handleColorsSelected = (colors) => {
    console.log("Selected colors:", colors);
  };

  const handleMaterialsSelected = (materials) => {
    console.log("Selected materials:", materials);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.skip}>Saltar</Text>

      <Text style={styles.title}>Cuéntanos{"\n"}sobre ti</Text>
      <Text style={styles.subtitle}>A continuación...</Text>

      <Text style={styles.sectionTitle}>Selecciona tus colores favoritos:</Text>
      <ColorPicker onSelect={handleColorsSelected} />

      <Text style={styles.sectionTitle}>Selecciona tu materiales preferidos:</Text>
      <MaterialSelector onSelect={handleMaterialsSelected} />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#EAC7B7",
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
    marginBottom: 10,
    textDecorationLine: "underline",
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 20,
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
