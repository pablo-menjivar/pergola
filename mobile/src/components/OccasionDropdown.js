import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const occasions = [
  "Regalo para alguien especial",
  "Uso personal",
  "Evento formal",
  "Cumpleaños",
  "Aniversario",
];

export default function OccasionDropdown({ onSelect }) {
  const [selected, setSelected] = useState(occasions[0]);
  const [open, setOpen] = useState(false);

  const handleSelect = (occasion) => {
    setSelected(occasion);
    setOpen(false);
    onSelect(occasion);
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
          {occasions.map((occasion) => (
            <TouchableOpacity
              key={occasion}
              style={styles.option}
              onPress={() => handleSelect(occasion)}
            >
              <Text style={styles.optionText}>{occasion}</Text>
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
