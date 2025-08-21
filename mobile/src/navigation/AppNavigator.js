import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import LoginScreen from '../screen/LoginScreen';
import RegisterScreen from '../screen/RegisterScreen';
import RecoverPasswordScreen from '../screen/RecoverPasswordScreen';
import VerifyEmailScreen from '../screen/VerifyEmailScreen';
import HomeScreen from '../screen/HomeScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">{/* empieza en Login */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'Iniciar Sesión' }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: 'Registro' }}
        />
        <Stack.Screen
          name="RecoverPassword"
          component={RecoverPasswordScreen}
          options={{ title: 'Recuperar Contraseña' }}
        />
        <Stack.Screen
          name="VerifyEmail"
          component={VerifyEmailScreen}
          options={{ title: 'Verificar Correo' }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Menú Principal' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
