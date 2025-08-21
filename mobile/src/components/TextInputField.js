import React from "react";
import { TextInput, StyleSheet, View } from "react-native";

export default function TextInputField({ placeholder, value, onChangeText }) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#8B5E5E"
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#9C2D38",
    borderRadius: 6,
    padding: 12,
    backgroundColor: "#F5F3F2",
    fontSize: 16,
    color: "#333",
  },
});
