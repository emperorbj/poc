// app/_layout.tsx

import { Stack } from 'expo-router';
import { useStore } from '../store/useStore';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="auth/login" />
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