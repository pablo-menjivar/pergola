
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';

const statusBarHeight = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;

const OrderSuccessScreen = ({ route, navigation }) => {
  const { orderCode } = route.params;
  
  const [scaleAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));

  const [fontsLoaded] = useFonts({
    'Quicksand-Bold': require('../../../assets/fonts/Quicksand-Bold.ttf'),
    'Nunito-Bold': require('../../../assets/fonts/Nunito-Bold.ttf'),
    'Nunito-SemiBold': require('../../../assets/fonts/Nunito-SemiBold.ttf'),
    'Nunito-Regular': require('../../../assets/fonts/Nunito-Regular.ttf'),
  });

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Animated.View style={[
          styles.iconContainer,
          { transform: [{ scale: scaleAnim }] }
        ]}>
          <Ionicons name="checkmark-circle" size={120} color="#4CAF50" />
        </Animated.View>

        <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
          <Text style={styles.title}>Pedido Realizado</Text>
          <Text style={styles.subtitle}>Tu pedido ha sido creado exitosamente</Text>

          <View style={styles.orderCodeContainer}>
            <Text style={styles.orderCodeLabel}>Código de pedido:</Text>
            <Text style={styles.orderCode}>{orderCode}</Text>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={24} color="#A73249" />
              <Text style={styles.infoText}>
                Procesaremos tu pedido pronto
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="mail-outline" size={24} color="#A73249" />
              <Text style={styles.infoText}>
                Recibirás una confirmación por email
              </Text>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="location-outline" size={24} color="#A73249" />
              <Text style={styles.infoText}>
                Te notificaremos cuando esté en camino
              </Text>
            </View>
          </View>
        </Animated.View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Home', { screen: 'Profile' })}
        >
          <Text style={styles.primaryButtonText}>Ver mis pedidos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Home', { screen: 'Home' })}
        >
          <Text style={styles.secondaryButtonText}>Seguir comprando</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3C6B8',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    marginBottom: 30,
  },
  textContainer: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Quicksand-Bold',
    color: '#3D1609',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#666666',
    marginBottom: 30,
    textAlign: 'center',
  },
  orderCodeContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderCodeLabel: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#666666',
    marginBottom: 8,
  },
  orderCode: {
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
    color: '#A73249',
  },
  infoContainer: {
    width: '100%',
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#3D1609',
    marginLeft: 12,
    flex: 1,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#A73249',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Quicksand-Bold',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A73249',
  },
  secondaryButtonText: {
    color: '#A73249',
    fontSize: 16,
    fontFamily: 'Quicksand-Bold',
  },
});

export default OrderSuccessScreen;