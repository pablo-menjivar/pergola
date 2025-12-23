// components/product/ProductGrid.js
import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products }) {
  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <ProductCard product={item} />}
      numColumns={2} // 👈 grid de 2 columnas
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  row: {
    justifyContent: "space-between",
  },
});
