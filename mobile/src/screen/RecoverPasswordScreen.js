import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';

export default function RecoverPasswordScreen({ navigation }) {
  const [userInput, setUserInput] = useState("");

  const handleContinue = () => {
    if (!userInput) {
      Alert.alert("Error", "Por favor ingresa tu correo, teléfono o usuario");
      return;
    }

    // Aquí irá la lógica para enviar la solicitud de recuperación al backend
    Alert.alert("Éxito", "Se ha enviado un enlace de recuperación a tu correo");
  };

  return (
    <View style={styles.container}>
      {/* Icono de volver */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back-circle-outline" size={24} color="black" />
      </TouchableOpacity>

      {/* Título */}
      <Text style={styles.title}>Recuperar Contraseña</Text>

      {/* Input */}
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico / Teléfono / Usuario"
        value={userInput}
        onChangeText={setUserInput}
      />

      {/* Botón continuar */}
      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E3C6B8",
    padding: 20,
  },
  backButton: {
    width: 48,
    height: 48,
    marginBottom: 10,
  },
  backIcon: {
    width: 48,
    height: 48,
    tintColor: "#3D1609",
  },
  title: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#000",
  },
  input: {
    width: 398,
    height: 62,
    backgroundColor: "#E8E1D8",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    width: 398,
    height: 56,
    backgroundColor: "#A73249",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
