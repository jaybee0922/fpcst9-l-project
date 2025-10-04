import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // For now, we'll always show Welcome screen
      // Later we can check AsyncStorage for auth token
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Auth check error:', error);
      setIsLoggedIn(false);
    }
  };

  // Show loading indicator while checking auth status
  if (isLoggedIn === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1e40af" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* Show Welcome screen if not logged in */}
        {!isLoggedIn && (
          <Stack.Screen
            name="Welcome"
            options={{ headerShown: false }}
          />
        )}
        {/* Show tabs if logged in */}
        {isLoggedIn && (
          <>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </>
        )}
        {/* Always allow access to register */}
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="cluster-dashboard" options={{ headerShown: false }} />
        <Stack.Screen name="create-post" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}