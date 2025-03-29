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

// Auth protection component that handles navigation
function InitialRoute() {
  // Always default to the sign-in page for maximum security
  return <Redirect href="/auth/sign-in" />;
}

function AuthProtection() {
  const { isSignedIn, isLoaded } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);
  const [hasSignedUpBefore, setHasSignedUpBefore] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if user has gone through onboarding
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

  useEffect(() => {
    if (!isLoaded || hasSeenOnboarding === null || hasSignedUpBefore === null) {
      return;
    }

    const inAuthGroup = segments[0] === 'auth';
    const inOnboardingGroup = segments[0] === 'onboarding';
    const inTabsGroup = segments[0] === '(tabs)';

    // Only navigate if not already in the correct group
    if (!isSignedIn) {
      // For new users, show onboarding first
      if (!hasSeenOnboarding && !hasSignedUpBefore && !inOnboardingGroup) {
        router.replace('/onboarding');
      } 
      // For returning users or after onboarding, show auth screens
      else if ((hasSeenOnboarding || hasSignedUpBefore) && !inAuthGroup && !inOnboardingGroup) {
        router.replace('/auth/sign-in');
      }
    } else if (isSignedIn && !inTabsGroup) {
      // If signed in but not in tabs, go to home
      router.replace('/(tabs)');
    }
  }, [isLoaded, isSignedIn, hasSeenOnboarding, hasSignedUpBefore, segments, router]);

  return null;
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
        <Slot />
        <AuthProtection />
        <StatusBar style="auto" />
      </ThemeProvider>
    </ClerkProvider>
  );
}
