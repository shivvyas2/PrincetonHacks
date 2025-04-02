import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Slot, useRouter, useSegments, Redirect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform, View, StyleSheet, Text } from 'react-native';
import Constants from 'expo-constants';

import { useColorScheme } from '@/hooks/useColorScheme';

// Token cache
const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync().catch(() => {
  console.warn('Failed to prevent splash screen auto hide');
  // Continue app initialization even if splash screen handling fails
});

// Auth protection component that handles navigation
function InitialRoute() {
  // Always default to the sign-in page for maximum security
  return <Redirect href="/auth/sign-in" />;
}

function AuthProtection() {
  const { isSignedIn, isLoaded } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    const inAuthGroup = segments[0] === 'auth';
    const inOnboardingGroup = segments[0] === 'onboarding';
    const inTabsGroup = segments[0] === '(tabs)';

    // Simple navigation logic
    if (isSignedIn && !inTabsGroup) {
      // If signed in but not in tabs, go to home
      router.replace('/(tabs)');
    } else if (!isSignedIn && !inAuthGroup && !inOnboardingGroup) {
      // If not signed in and not in auth or onboarding, redirect to auth
      router.replace('/auth/sign-in');
    }
  }, [isLoaded, isSignedIn, segments, router]);

  return null;
}

// Create a custom SafeArea component that handles Android status bar
function CustomStatusBar() {
  const statusBarHeight = Platform.OS === 'android' ? Constants.statusBarHeight : 0;
  
  return (
    <View style={{ height: statusBarHeight, backgroundColor: '#1E3A5F' }} />
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  
  const [isReady, setIsReady] = useState(false);
  const colorScheme = useColorScheme();

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (fontError) {
      console.error('Font loading error:', fontError);
      // Continue without the font rather than freezing
      setIsReady(true);
      SplashScreen.hideAsync().catch(console.error);
    }
  }, [fontError]);

  useEffect(() => {
    // Set a timeout to ensure the splash screen eventually hides even if other processes fail
    const splashTimeout = setTimeout(() => {
      if (!isReady) {
        console.warn('Forcing splash screen hide after timeout');
        setIsReady(true);
        SplashScreen.hideAsync().catch(console.error);
      }
    }, 3000); // 3 second safety timeout
    
    return () => clearTimeout(splashTimeout);
  }, [isReady]);

  useEffect(() => {
    if (fontsLoaded) {
      // Wrap in a small timeout to ensure UI is ready
      setTimeout(() => {
        setIsReady(true);
        SplashScreen.hideAsync().catch((err) => {
          console.error('Error hiding splash screen:', err);
        });
      }, 100);
    }
  }, [fontsLoaded]);

  if (!isReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ClerkProvider
        publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
        tokenCache={tokenCache}
      >
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <CustomStatusBar />
          <Slot />
          <AuthProtection />
          <StatusBar style="light" />
        </ThemeProvider>
      </ClerkProvider>
    </SafeAreaProvider>
  );
}
