// app/_layout.tsx

import { Stack, useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { useStore } from '../store/useStore';
import { ActivityIndicator, View } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { useEffect } from 'react';

function useProtectedRoute() {
  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();
  const isInitialized = useStore((state) => state.isInitialized);
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const isProfileComplete = useStore((state) => state.isProfileComplete);

  useEffect(() => {
    // Wait for navigation to be ready
    if (!navigationState?.key || !isInitialized) {
      return;
    }

    const inAuthGroup = segments[0] === 'auth';
    const inTabsGroup = segments[0] === '(tabs)';

    console.log('🔐 Protected route check:', {
      isAuthenticated,
      isProfileComplete,
      segment: segments[0],
    });

    // Redirect logic with setTimeout to avoid navigation during render
    setTimeout(() => {
      if (!isAuthenticated && inTabsGroup) {
        // Not authenticated but trying to access tabs
        console.log('🔄 Redirecting to welcome (not authenticated)');
        router.replace('/');
      } else if (isAuthenticated && !isProfileComplete && inTabsGroup) {
        // Authenticated but profile incomplete, trying to access tabs
        console.log('🔄 Redirecting to tenant setup (profile incomplete)');
        router.replace('/auth/tenant-setup');
      } else if (isAuthenticated && isProfileComplete && (inAuthGroup || segments.length === 0)) {
        // Authenticated with complete profile, on auth screens or root
        console.log('🔄 Redirecting to tabs (authenticated & complete)');
        router.replace('/(tabs)');
      }
    }, 1);
  }, [isAuthenticated, isProfileComplete, isInitialized, segments, navigationState]);
}

export default function RootLayout() {
  const isInitialized = useStore((state) => state.isInitialized);
  
  useProtectedRoute();

  if (!isInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.white }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="auth/login" />
      <Stack.Screen name="auth/signup" />
      <Stack.Screen name="auth/tenant-setup" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen 
        name="consultation/consent" 
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen name="consultation/transcription" />
      <Stack.Screen name="consultation/session-summary" />
      <Stack.Screen name="consultation/review-summary" />
      <Stack.Screen name="consultation/review-prescription" />
    </Stack>
  );
}