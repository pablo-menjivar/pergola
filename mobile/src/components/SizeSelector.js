import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const sizes = ["Pequeñas", "Medianas", "Grandes"];

export default function SizeSelector({ onSelect }) {
  const [selected, setSelected] = useState(sizes[1]); // "Medianas" por defecto
  const [open, setOpen] = useState(false);

  const handleSelect = (size) => {
    setSelected(size);
    setOpen(false);
    onSelect(size);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setOpen(!open)}
      >
        <Text style={styles.text}>{selected}</Text>
        <Text style={styles.arrow}>{open ? "▲" : "▼"}</Text>
      </TouchableOpacity>

      {open && (
        <View style={styles.options}>
          {sizes.map((size) => (
            <TouchableOpacity
              key={size}
              style={styles.option}
              onPress={() => handleSelect(size)}
            >
              <Text style={styles.optionText}>{size}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
  },
  dropdown: {
    backgroundColor: "#4B1E0E",
    padding: 14,
    borderRadius: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 16,
  },
  arrow: {
    color: "#fff",
    fontSize: 14,
  },
  options: {
    backgroundColor: "#fff",
    marginTop: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  option: {
    padding: 12,
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
});
