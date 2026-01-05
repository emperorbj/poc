

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles } from '../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={styles.welcomeContainer}>
        <View style={styles.logoPlaceholder}>
          <Image style={styles.logo} source={require('../assets/images/logo.png')} />
        </View>
        <Text style={styles.appName}>Humaein</Text>
        <Text style={styles.tagline}>Patients before Paperwork</Text>

        <View style={styles.cta}>
          <TouchableOpacity
            style={commonStyles.button}
            onPress={() => router.push('/auth/login')}
          >
            <Text style={commonStyles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[commonStyles.button, styles.signupButton]}
            onPress={() => router.push('/auth/signup')}
          >
            <Text style={[commonStyles.buttonText, styles.signupButtonText]}>Sign Up</Text>
          </TouchableOpacity>
        </View>
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
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    justifyContent: 'space-between',
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
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
  signupButton: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  signupButtonText: {
    color: colors.primary,
  },
  tagline: {
    fontSize: 16,
    color: colors.gray[500],
    marginBottom: 40,
  },
});