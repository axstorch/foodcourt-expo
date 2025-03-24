import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { CartProvider } from './Context/CartContext';
import { AuthProvider } from './Context/AuthContext';


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const colorScheme = useColorScheme();
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    DancingScript: require('../assets/fonts/DancingScript-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <CartProvider>
        {/* <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}> */}
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
          <Stack.Screen name="CourtDetails/CourtDetails" options={{ headerShown: false }} />
          <Stack.Screen name="VendorPage" options={{ headerShown: false, title: 'Vendors' }} />
          <Stack.Screen name="(Foodcourt_menu)/Menu" options={{ headerShown: false }} />
          <Stack.Screen name="(payment_screen)/payment" options={{ headerShown: false, title: 'Crave' }} />
        </Stack>

        {/* </ThemeProvider> */}
      </CartProvider>
    </AuthProvider>
  );
}
