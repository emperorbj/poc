// app/consultation/session-summary.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../../store/useStore';
import { colors, commonStyles } from '../../styles/commonStyles';
import { SessionSummary } from '../../types/index';

export default function SessionSummaryScreen() {
  const router = useRouter();
  const currentConsultation = useStore((state) => state.currentConsultation);

  if (!currentConsultation) {
    router.back();
    return null;
  }

  const [summary] = useState<SessionSummary>({
    identifiers: `Name: ${currentConsultation.patient.name}\nAge/Sex: ${currentConsultation.patient.age}/${currentConsultation.patient.sex}\nAadhar: ${currentConsultation.patient.aadharId}`,
    history:
      'Patient presents with missed menstrual cycles for the past 2 months. No significant past medical history. Last menstrual period was 8 weeks ago.',
    examination:
      'Vitals stable. Abdominal examination unremarkable. Per speculum examination normal.',
    diagnosis: 'Possible early pregnancy - to be confirmed with ultrasound scan.',
    treatment: 'Folic acid 400 mcg daily prescribed. Early pregnancy scan scheduled.',
    nextSteps:
      'Follow-up appointment in 2 weeks with scan results. Patient advised to maintain prenatal vitamins and report any concerning symptoms.',
  });

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.header}>
        <Text style={commonStyles.headerTitle}>Session Summary</Text>
      </View>

      <ScrollView contentContainerStyle={commonStyles.scrollContent}>
        <View style={styles.summarySection}>
          <Text style={styles.summaryLabel}>Identifiers</Text>
          <Text style={styles.summaryText}>{summary.identifiers}</Text>
        </View>

        <View style={styles.summarySection}>
          <Text style={styles.summaryLabel}>History</Text>
          <Text style={styles.summaryText}>{summary.history}</Text>
        </View>

        <View style={styles.summarySection}>
          <Text style={styles.summaryLabel}>Examination</Text>
          <Text style={styles.summaryText}>{summary.examination}</Text>
        </View>

        <View style={styles.summarySection}>
          <Text style={styles.summaryLabel}>Diagnosis</Text>
          <Text style={styles.summaryText}>{summary.diagnosis}</Text>
        </View>

        <View style={styles.summarySection}>
          <Text style={styles.summaryLabel}>Treatment</Text>
          <Text style={styles.summaryText}>{summary.treatment}</Text>
        </View>

        <View style={styles.summarySection}>
          <Text style={styles.summaryLabel}>Next Steps</Text>
          <Text style={styles.summaryText}>{summary.nextSteps}</Text>
        </View>

        <TouchableOpacity 
          style={commonStyles.button} 
          onPress={() => router.push('/consultation/review-summary')}
        >
          <Text style={commonStyles.buttonText}>Review Session Summary</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  summarySection: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: colors.gray[700],
    lineHeight: 22,
  },
});