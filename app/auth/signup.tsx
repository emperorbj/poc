
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
  Platform,
  ScrollView,
  Image,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../../store/useStore';
import { colors, commonStyles } from '../../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DropdownPicker } from '../../components/DropdownPicker';
import { Ionicons } from '@expo/vector-icons';

export default function SignupScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    doctorName: '',
    specialty: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const register = useStore((state) => state.register);

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'Password must contain at least one digit';
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      return 'Password must contain at least one special character (@$!%*?&)';
    }
    return null;
  };

  const handleSignup = async () => {
    // Validation
    if (!formData.doctorName || !formData.specialty || !formData.email || !formData.password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      Alert.alert('Password Error', passwordError);
      return;
    }

    try {
      setIsLoading(true);
      await register({
        doctorName: formData.doctorName,
        specialty: formData.specialty,
        email: formData.email,
        password: formData.password,
      });

      // Navigate to tenant setup after successful registration
      router.replace('/auth/tenant-setup');
    } catch (error: any) {
      Alert.alert('Signup Failed', error.message || 'An error occurred during signup');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={commonStyles.scrollContent}>
          <View style={styles.logoPlaceholder}>
            <Image style={styles.logo} source={require('../../assets/images/new-logo.png')} />
          </View>
          <Text style={styles.appName}>Create Account</Text>
          <Text style={styles.tagline}>Join Humaein to get started</Text>

          <View style={styles.formContainer}>
            <Text style={commonStyles.label}>Doctor Name *</Text>
            <TextInput
              style={[commonStyles.input, styles.borderInput]}
              placeholder="Dr. John Doe"
              value={formData.doctorName}
              onChangeText={(text) => setFormData({ ...formData, doctorName: text })}
              editable={!isLoading}

            />


            <DropdownPicker
              label="Specialty *"
              value={formData.specialty}
              options={[
                'Gynecology',
                'Cardiology',
                'Dermatology',
                'Pediatrics',
                'Orthopedics',
                'General Medicine',
                'Neurology',
                'Psychiatry',
                'Ophthalmology',
                'ENT',
                'Other',
              ]}
              onValueChange={(value) => setFormData({ ...formData, specialty: value })}
              placeholder="Select your specialty"
            />


            <Text style={commonStyles.label}>Email</Text>
            <TextInput
              style={[commonStyles.input, styles.borderInput]}
              placeholder="Enter your email"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}

            />

            <Text style={commonStyles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={commonStyles.input}
                placeholder="At least 6 characters"
                value={formData.password}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
                secureTextEntry={!showPassword}
                editable={!isLoading}


              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={24}
                  color={colors.gray[500]}
                />
              </TouchableOpacity>

            </View>

            <Text style={commonStyles.label}>Confirm Password</Text>
            <View style={styles.passwordContainer}>

              <TextInput
                style={commonStyles.input}
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                secureTextEntry={!showPassword}
                editable={!isLoading}


              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={24}
                  color={colors.gray[500]}
                />
              </TouchableOpacity>

            </View>
            <TouchableOpacity style={commonStyles.button} onPress={handleSignup} disabled={isLoading}>
              <Text style={commonStyles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => router.push('/auth/login')}
            >
              <Text style={styles.loginLinkText}>
                Already have an account? <Text style={styles.loginLinkBold}>Login</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    overflow: 'hidden'
  },
  borderInput: {
    borderColor: 'grey'
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    paddingRight: 12,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: colors.gray[800],
  },
  eyeIcon: {
    padding: 4,
  },
  formContainer: {
    width: '100%',
    marginTop: 20,
  },
  loginLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginLinkText: {
    fontSize: 14,
    color: colors.gray[600],
  },
  loginLinkBold: {
    color: colors.primary,
    fontWeight: '600',
  },
});