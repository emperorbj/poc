// app/index.tsx

import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet,Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../store/useStore';
import { colors, commonStyles } from '../styles/commonStyles';

export default function WelcomeScreen() {
  const router = useRouter();
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const tenantDetails = useStore((state) => state.tenantDetails);

  useEffect(() => {
    // Auto-navigate if already authenticated
    if (isAuthenticated && tenantDetails) {
      router.replace('/(tabs)');
    } else if (isAuthenticated && !tenantDetails) {
      router.replace('/auth/tenant-setup');
    }
  }, [isAuthenticated, tenantDetails]);

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={styles.welcomeContainer}>
        <View style={styles.logoPlaceholder}>
          <Image style={styles.logo} source={require('../assets/images/logo.png')} />
        </View>
        <Text style={styles.appName}>Humaein</Text>
        <Text style={styles.tagline}>Patients before Paperwork</Text>
        <TouchableOpacity 
          style={commonStyles.button} 
          onPress={() => router.push('/auth/login')}
        >
          <Text style={commonStyles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow:'hidden'
  },
   logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.gray[800],
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: colors.gray[500],
    marginBottom: 40,
  },
});