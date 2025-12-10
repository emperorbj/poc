// app/auth/login.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../../store/useStore';
import { colors, commonStyles } from '../../styles/commonStyles';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useStore((state) => state.login);

  const handleLogin = () => {
    login(email, password);
    router.replace('/auth/tenant-setup');
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView contentContainerStyle={commonStyles.scrollContent}>
        <View style={styles.logoPlaceholder}>
          <Image style={styles.logo} source={require('../../assets/images/logo.png')} />
        </View>
        <Text style={styles.appName}>Humaein</Text>
        <Text style={styles.tagline}>Patients before Paperwork</Text>

        <View style={styles.formContainer}>
          <Text style={commonStyles.label}>Email</Text>
          <TextInput
            style={commonStyles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={commonStyles.label}>Password</Text>
          <TextInput
            style={commonStyles.input}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={commonStyles.button} onPress={handleLogin}>
            <Text style={commonStyles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'center',
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
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    color: colors.gray[500],
    marginBottom: 40,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    marginTop: 20,
  },
});