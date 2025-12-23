// src/components/product/ProductFilters.js
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
} from "react-native";

export default function ProductFilters({ visible, onClose, onSelect }) {
  const [activeFilter, setActiveFilter] = useState(null);

  const filters = ["Piezas", "Material", "Forma"];

  const handlePress = (filter) => {
    setActiveFilter(filter);
    onSelect(filter); // notifica al padre qué filtro se eligió
  };

  const handleClear = () => {
    setActiveFilter(null);
    onSelect(null); // notifica al padre que se limpió el filtro
  };

  const handleClose = () => {
    setActiveFilter(null); // reinicia estado al cerrar
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.panel}>
          {/* Encabezado */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClear}>
              <Text style={styles.clearText}>Limpiar</Text>
            </TouchableOpacity>
          </View>

          {/* Opciones de filtro */}
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.option,
                activeFilter === filter && styles.optionActive,
              ]}
              onPress={() => handlePress(filter)}
            >
              <Text
                style={[
                  styles.optionText,
                  activeFilter === filter && styles.optionTextActive,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}

          {/* Cerrar panel */}
          <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
            <Text style={styles.closeText}>Cerrar</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  panel: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 16,
  },
  clearText: {
    fontSize: 16,
    color: "#3D1609",
    fontWeight: "600",
  },
  option: {
    width: 396, // tamaño fijo como en tu diseño
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 12,
    alignSelf: "center", // centra las opciones
  },
  optionActive: {
    backgroundColor: "#A73249",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  optionTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  closeBtn: {
    marginTop: 12,
    alignSelf: "center",
  },
  closeText: {
    color: "#3D1609",
    fontSize: 16,
    fontWeight: "500",
  },
});
