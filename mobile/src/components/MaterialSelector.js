import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const materials = [
  "Piedras luna",
  "Perla roccocó",
  "Anillas bronce",
  "Broches plata",
  "Cristales azules",
  "Dije corazón",
];

export default function MaterialSelector({ onSelect }) {
  const [selected, setSelected] = useState([]);

  const toggleMaterial = (material) => {
    let newSelection = [...selected];
    if (newSelection.includes(material)) {
      newSelection = newSelection.filter((m) => m !== material);
    } else {
      newSelection.push(material);
    }
    setSelected(newSelection);
    onSelect(newSelection);
  };

  return (
    <View style={styles.container}>
      {materials.map((material) => (
        <TouchableOpacity
          key={material}
          style={styles.row}
          onPress={() => toggleMaterial(material)}
        >
          <View
            style={[
              styles.radio,
              selected.includes(material) && styles.radioSelected,
            ]}
          />
          <Text style={styles.label}>{material}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#555",
    marginRight: 10,
  },
  radioSelected: {
    backgroundColor: "#8B0000",
  },
  label: {
    fontSize: 16,
    color: "#333",
  },
});
