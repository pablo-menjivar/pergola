import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import TextInputField from "../components/TextInputField";
import SizeSelector from "../components/SizeSelector";

export default function SurveyScreen({ navigation }) {
  const [allergy, setAllergy] = useState("");
  const [budget, setBudget] = useState("");

  const handleFinish = () => {
    console.log("Material alérgico:", allergy);
    console.log("Presupuesto:", budget);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.skip}>Saltar</Text>

      <Text style={styles.title}>Cuéntanos{"\n"}sobre ti</Text>

      <Text style={styles.sectionTitle}>Escribe a los materiales que eres alérgico:</Text>
      <TextInputField
        placeholder="Ej: Nickel..."
        value={allergy}
        onChangeText={setAllergy}
      />

      <Text style={styles.sectionTitle}>Selecciona el tamaño preferido de joyas:</Text>
      <SizeSelector onSelect={(size) => console.log("Tamaño seleccionado:", size)} />

      <Text style={styles.sectionTitle}>Escribe tu presupuesto estimado (en USD):</Text>
      <TextInputField
        placeholder="Ej: $130..."
        value={budget}
        onChangeText={setBudget}
      />

      <TouchableOpacity style={styles.button} onPress={handleFinish}>
        <Text style={styles.buttonText}>Finalizar encuesta</Text>
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
