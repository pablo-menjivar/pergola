import { useEffect } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const CustomSplashScreen = ({ onFinish }) => {
  useEffect(() => {
    // Duración más larga para que sea visible en la app de Expo
    const timer = setTimeout(() => {
      if (onFinish) {
        onFinish();
      }
    }, 4000); // 4 segundos para mejor visibilidad

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <LinearGradient
      colors={['#E8E1D8', '#F0E9E0', '#E8E1D8']}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/splash-icon.png')} // Ajusta la ruta
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logo: {
    width: width * 0.8, // 80% del ancho de pantalla
    height: height * 0.4, // 40% del alto de pantalla
    maxWidth: 300,
    maxHeight: 200,
  },
});
export default CustomSplashScreen;