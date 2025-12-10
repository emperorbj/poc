// app/consultation/review-prescription.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../../store/useStore';
import { colors, commonStyles } from '../../styles/commonStyles';

export default function ReviewPrescriptionScreen() {
  const router = useRouter();
  const [prescription, setPrescription] = useState(
    `Rx\n\n1. Folic Acid 400 mcg\n   - 1 tablet daily\n   - Duration: Throughout pregnancy\n\n2. Prenatal Vitamins\n   - 1 tablet daily\n   - Duration: Throughout pregnancy\n\nAdvice:\n- Schedule ultrasound scan within 1 week\n- Return for follow-up in 2 weeks\n- Report any bleeding or severe pain immediately`
  );
  const [isReviewed, setIsReviewed] = useState(false);
  const currentConsultation = useStore((state) => state.currentConsultation);
  const updateConsultation = useStore((state) => state.updateConsultation);
  const setCurrentConsultation = useStore((state) => state.setCurrentConsultation);

  if (!currentConsultation) {
    router.back();
    return null;
  }

  const handleMarkReviewed = () => {
    setIsReviewed(true);
    updateConsultation(currentConsultation.id, { prescription, reviewed: true });
  };

  const handleSendWhatsApp = () => {
    updateConsultation(currentConsultation.id, { status: 'Completed' });
    // TODO: Implement WhatsApp sharing
    Alert.alert('Success', 'Prescription sent to patient via WhatsApp');
    setCurrentConsultation(null);
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.header}>
        <Text style={commonStyles.headerTitle}>Review Prescription</Text>
        {!isReviewed && (
          <Text style={styles.statusPending}>Review Pending</Text>
        )}
      </View>

      <ScrollView contentContainerStyle={commonStyles.scrollContent}>
        <Text style={styles.instructions}>
          {isReviewed
            ? 'Prescription reviewed and ready to send'
            : 'Review and edit the prescription below:'}
        </Text>

        <TextInput
          style={styles.prescriptionEditInput}
          value={prescription}
          onChangeText={setPrescription}
          multiline
          numberOfLines={15}
          editable={!isReviewed}
        />

        {!isReviewed ? (
          <TouchableOpacity style={commonStyles.button} onPress={handleMarkReviewed}>
            <Text style={commonStyles.buttonText}>Mark as Reviewed</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[commonStyles.button, { backgroundColor: colors.secondary }]}
            onPress={handleSendWhatsApp}
          >
            <Text style={commonStyles.buttonText}>📱 Send on WhatsApp</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  statusPending: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: '600',
  },
  instructions: {
    fontSize: 14,
    color: colors.gray[600],
    marginBottom: 16,
  },
  prescriptionEditInput: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    minHeight: 350,
    textAlignVertical: 'top',
    lineHeight: 22,
    fontFamily: 'monospace',
  },
});