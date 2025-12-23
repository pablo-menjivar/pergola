import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';

export default function WelcomeScreen() {
  // Load fonts from the local assets directory
  const [fontsLoaded] = useFonts({
    'CormorantGaramond-Bold': require('../../assets/fonts/CormorantGaramond-Bold.ttf'),
    'Quicksand-Bold': require('../../assets/fonts/Quicksand-Bold.ttf'),
    'Quicksand-BoldItalic': require('../../assets/fonts/Quicksand-BoldItalic.ttf'),
  });

  const navigation = useNavigation();

  // Mostrar un indicador de carga hasta que las fuentes estén disponibles
  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <SafeAreaView style={styles.container}>
  <StatusBar backgroundColor="#E3C6B8" barStyle="dark-content" />

      {/* Top content container */}
      <View style={styles.content}>
        <Text style={styles.title}>¡Bienvenido a {'\n'} Pérgola Joyería!</Text>

        <Text style={styles.bodyText}>
          Cada joya que creamos está diseñada{'\n'}para resaltar tu esencia y elegancia.
        </Text>
        <Text style={styles.sloganText}>
          <Text style={styles.italic}>Porque tu belleza merece cada pieza.</Text>
        </Text>

        <Image
          source={require('../../assets/splash-icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Bottom button */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3C6B8',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingBottom: 40,
    paddingTop: 60,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-start',
    width: '100%',
  },
  title: {
    fontFamily: 'CormorantGaramond-Bold',
    fontSize: 42,
    color: '#3D1609',
    textAlign: 'center',
    lineHeight: 50,
    marginBottom: 10,
  },
  starContainer: {
    marginBottom: 30,
  },
  star: {
    fontSize: 24,
    textAlign: 'center',
  },
  bodyText: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 16,
    color: '#3D1609',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 12,
    fontWeight: '600',
  },
  sloganText: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 16,
    color: '#3D1609',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
  italic: {
    fontFamily: 'Quicksand-BoldItalic',
  },
  logo: {
    width: 280,
    height: 280,
    marginTop: 20,
  },
  button: {
    backgroundColor: '#A73249',
    paddingVertical: 18,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginTop: 'auto',
  },
  buttonText: {
    fontFamily: 'Quicksand-Bold',
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});