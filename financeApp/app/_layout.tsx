import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
SplashScreen.preventAutoHideAsync();

// Inner component that uses auth - only rendered after ClerkProvider is initialized
function AuthenticatedLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);
  const [hasSignedUpBefore, setHasSignedUpBefore] = useState<boolean | null>(null);

  useEffect(() => {
    // Remove the onboarding reset for production
    // Instead, check if user has gone through onboarding
    AsyncStorage.getItem('hasSeenOnboarding').then((value) => {
      setHasSeenOnboarding(value === 'true');
    });

    // Check if the user has signed up before
    AsyncStorage.getItem('hasSignedUpBefore').then((value) => {
      setHasSignedUpBefore(value === 'true');
    });
  }, []);

  // Save flag when user successfully signs in
  useEffect(() => {
    if (isSignedIn) {
      AsyncStorage.setItem('hasSignedUpBefore', 'true');
      setHasSignedUpBefore(true);
    }
  }, [isSignedIn]);

  if (!isLoaded || hasSeenOnboarding === null || hasSignedUpBefore === null) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* For new users, show onboarding first */}
      {!hasSeenOnboarding && !hasSignedUpBefore ? (
        <Stack.Screen 
          name="onboarding" 
          options={{
            gestureEnabled: false,
          }}
        />
      ) : !isSignedIn ? (
        // For returning users or after onboarding, show auth screens
        <Stack.Screen 
          name="auth" 
          options={{
            gestureEnabled: false,
          }}
        />
      ) : (
        // After signing in, show main app
        <Stack.Screen 
          name="(tabs)" 
          options={{
            gestureEnabled: false,
          }}
        />
      )}
    </Stack>
  );
}

// Root layout that doesn't use auth directly
export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      tokenCache={tokenCache}
    >
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AuthenticatedLayout />
        <StatusBar style="auto" />
      </ThemeProvider>
    </ClerkProvider>
  );
}
