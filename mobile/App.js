import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import CustomSplashScreen from './src/screen/SplashScreen';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        // Simula carga de recursos
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      }
    }
    prepare();
  }, []);

  const handleSplashFinish = async () => {
    setIsLoading(false);
    await SplashScreen.hideAsync(); // Oculta el splash nativo
  };

  if (isLoading) return <CustomSplashScreen onFinish={handleSplashFinish} />;

  return (
    <>
      <StatusBar style="auto" />
      <AppNavigator />
    </>
  );
}
