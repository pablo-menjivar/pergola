import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const stylesList = ["Esencias ligeras", "Perlas roccocó", "Cristal bohemio"];

export default function StyleSelector({ onSelect }) {
  const [selected, setSelected] = useState(null);

  const selectStyle = (style) => {
    setSelected(style);
    onSelect(style);
  };

  return (
    <View style={styles.container}>
      {stylesList.map((style) => (
        <TouchableOpacity
          key={style}
          style={styles.row}
          onPress={() => selectStyle(style)}
        >
          <View
            style={[
              styles.radio,
              selected === style && styles.radioSelected,
            ]}
          />
          <Text style={styles.label}>{style}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
    marginVertical: 6,
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#5C2C1C",
    marginRight: 8,
  },
  radioSelected: {
    backgroundColor: "#5C2C1C",
  },
  label: {
    fontSize: 16,
    color: "#3B2C2C",
  },
});
