import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';

function InProgressScreen({ title }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20 }}>{title} - En progreso</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Inicio"
        children={() => <InProgressScreen title="Inicio" />}
      />
      <Tab.Screen
        name="Pedidos"
        children={() => <InProgressScreen title="Pedidos" />}
      />
      <Tab.Screen
        name="Perfil"
        children={() => <InProgressScreen title="Perfil" />}
      />
      <Tab.Screen
        name="Notificaciones"
        children={() => <InProgressScreen title="Notificaciones" />}
      />
    </Tab.Navigator>
  );
}