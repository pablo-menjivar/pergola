// AuthGuardProfile.js (Nuevo Componente)
import React, { useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import ProfileScreen from '../screen/ProfileScreen'; // Tu pantalla de perfil
import LoginScreen from '../screen/LoginScreen';     // Tu pantalla de inicio de sesión
import { AuthContext } from '../context/AuthContext';

export default function AuthGuardProfile({ navigation }) {
  const { user, isLoading } = useContext(AuthContext);
  
  // 1. Manejo del estado de carga inicial
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#A73249" />
        <Text>Cargando usuario...</Text>
      </View>
    );
  }

  // 2. Lógica condicional:
  return user ? (
    // Si el usuario está autenticado, muestra el Perfil
    <ProfileScreen />
  ) : (
    // Si NO está autenticado, muestra la pantalla de Login
    // Nota: Es mejor usar un stack navigator para Login, pero esto es un ejemplo de renderizado directo
    <LoginScreen navigation={navigation} /> 
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});