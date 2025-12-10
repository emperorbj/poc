// app/consultation/review-summary.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../../store/useStore';
import { colors, commonStyles } from '../../styles/commonStyles';

export default function ReviewSummaryScreen() {
  const router = useRouter();
  const currentConsultation = useStore((state) => state.currentConsultation);

  if (!currentConsultation) {
    router.back();
    return null;
  }

  const [editedSummary, setEditedSummary] = useState(
    `Identifiers:\nName: ${currentConsultation.patient.name}\nAge/Sex: ${currentConsultation.patient.age}/${currentConsultation.patient.sex}\n\nHistory:\nPatient presents with missed menstrual cycles for the past 2 months.\n\nExamination:\nVitals stable. Abdominal examination unremarkable.\n\nDiagnosis:\nPossible early pregnancy\n\nTreatment:\nFolic acid 400 mcg daily\n\nNext Steps:\nFollow-up in 2 weeks with ultrasound results.`
  );

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.header}>
        <Text style={commonStyles.headerTitle}>Review Session Summary</Text>
      </View>

      <ScrollView contentContainerStyle={commonStyles.scrollContent}>
        <Text style={styles.instructions}>
          Review and edit the session summary below:
        </Text>
        
        <TextInput
          style={styles.summaryEditInput}
          value={editedSummary}
          onChangeText={setEditedSummary}
          multiline
          numberOfLines={20}
        />

        <TouchableOpacity 
          style={commonStyles.button} 
          onPress={() => router.push('/consultation/review-prescription')}
        >
          <Text style={commonStyles.buttonText}>Mark as Reviewed</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  instructions: {
    fontSize: 14,
    color: colors.gray[600],
    marginBottom: 16,
  },
  summaryEditInput: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    minHeight: 400,
    textAlignVertical: 'top',
    lineHeight: 22,
  },
});