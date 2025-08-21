import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, FlatList } from "react-native";

const colors = ["#FFFFFF", "#F56565", "#90CDF4", "#D6FF33", "#4A5568", "#ED64A6"];

export default function ColorPicker({ onSelect }) {
  const [selectedColors, setSelectedColors] = useState([]);

  const toggleColor = (color) => {
    let newSelection = [...selectedColors];
    if (newSelection.includes(color)) {
      newSelection = newSelection.filter((c) => c !== color);
    } else {
      newSelection.push(color);
    }
    setSelectedColors(newSelection);
    onSelect(newSelection);
  };

  return (
    <FlatList
      data={colors}
      horizontal
      keyExtractor={(item) => item}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[
            styles.circle,
            { backgroundColor: item },
            selectedColors.includes(item) && styles.selectedCircle,
          ]}
          onPress={() => toggleColor(item)}
        />
      )}
      showsHorizontalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  selectedCircle: {
    borderColor: "#8B0000",
    borderWidth: 3,
  },
});
