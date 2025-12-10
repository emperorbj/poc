// app/consultation/consent.tsx

import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles } from '../../styles/commonStyles';

export default function ConsentScreen() {
  const router = useRouter();

  const handleConsent = () => {
    router.push('/consultation/transcription');
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.centerContent}>
        <View style={styles.consentBox}>
          <Text style={styles.consentText}>
            I confirm that I have obtained the patient's verbal consent to record
            and transcribe this interaction for medical documentation.
          </Text>
        </View>

        <TouchableOpacity style={commonStyles.button} onPress={handleConsent}>
          <Text style={commonStyles.buttonText}>Consent Obtained</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  consentBox: {
    backgroundColor: colors.white,
    padding: 24,
    borderRadius: 12,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  consentText: {
    fontSize: 16,
    color: colors.gray[700],
    lineHeight: 24,
    textAlign: 'center',
  },
});