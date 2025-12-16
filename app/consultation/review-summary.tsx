
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../../store/useStore';
import { colors, commonStyles } from '../../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';


const EditableTextSection = ({ 
  label, 
  value, 
  onChange 
}: { 
  label: string; 
  value: string; 
  onChange: (text: string) => void;
}) => (
  <View style={styles.editSection}>
    <Text style={styles.sectionLabel}>{label}</Text>
    <TextInput
      style={styles.sectionInput}
      value={value}
      onChangeText={onChange}
      multiline
      numberOfLines={3}
    />
  </View>
);

const EditableListSection = ({ 
  label, 
  items, 
  onChange 
}: { 
  label: string; 
  items: string[]; 
  onChange: (items: string[]) => void;
}) => (
  <View style={styles.editSection}>
    <Text style={styles.sectionLabel}>{label}</Text>
    {items.map((item, index) => (
      <View key={index} style={styles.listItemEdit}>
        <Text style={styles.listNumber}>{index + 1}.</Text>
        <TextInput
          style={styles.listInputText}
          value={item}
          onChangeText={(text) => {
            const newItems = [...items];
            newItems[index] = text;
            onChange(newItems);
          }}
          multiline
        />
      </View>
    ))}
    <TouchableOpacity 
      style={styles.addButton}
      onPress={() => onChange([...items, ''])}
    >
      <Text style={styles.addButtonText}>+ Add Item</Text>
    </TouchableOpacity>
  </View>
);

export default function ReviewSummaryScreen() {
  const router = useRouter();
  const currentConsultation = useStore((state) => state.currentConsultation);

  if (!currentConsultation) {
    router.back();
    return null;
  }
  const [editedSummary, setEditedSummary] = useState({
    identifiers: `Name: ${currentConsultation.patient.name}\nAge/Sex: ${currentConsultation.patient.age}/${currentConsultation.patient.sex}\nAadhar: ${currentConsultation.patient.aadharId}`,
    history: [
      'Patient presents with missed menstrual cycles for the past 2 months',
      'No significant past medical history',
      'Last menstrual period was 8 weeks ago',
    ],
    examination: [
      'Vitals stable',
      'Abdominal examination unremarkable',
      'Per speculum examination normal',
    ],
    diagnosis: [
      'Possible early pregnancy - to be confirmed with ultrasound scan',
    ],
    treatment: [
      'Folic acid 400 mcg daily prescribed',
      'Early pregnancy scan scheduled',
    ],
    nextSteps: [
      'Follow-up appointment in 2 weeks with scan results',
      'Patient advised to maintain prenatal vitamins',
      'Report any concerning symptoms',
    ],
  });

  // const [editedSummary, setEditedSummary] = useState(
  //   `Identifiers:\nName: ${currentConsultation.patient.name}\nAge/Sex: ${currentConsultation.patient.age}/${currentConsultation.patient.sex}\n\nHistory:\nPatient presents with missed menstrual cycles for the past 2 months.\n\nExamination:\nVitals stable. Abdominal examination unremarkable.\n\nDiagnosis:\nPossible early pregnancy\n\nTreatment:\nFolic acid 400 mcg daily\n\nNext Steps:\nFollow-up in 2 weeks with ultrasound results.`
  // );

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.header}>
        <Text style={[commonStyles.headerTitle,styles.header]}>Review Session Summary</Text>
      </View>

      <ScrollView contentContainerStyle={commonStyles.scrollContent}>
        <Text style={styles.instructions}>
          Review and edit the session summary below:
        </Text>
        
        {/* Identifiers - Regular text input */}
        <EditableTextSection
          label="Identifiers"
          value={editedSummary.identifiers}
          onChange={(text) => setEditedSummary({ ...editedSummary, identifiers: text })}
        />

        {/* Numbered list sections */}
        <EditableListSection
          label="History"
          items={editedSummary.history}
          onChange={(items) => setEditedSummary({ ...editedSummary, history: items })}
        />

        <EditableListSection
          label="Examination"
          items={editedSummary.examination}
          onChange={(items) => setEditedSummary({ ...editedSummary, examination: items })}
        />

        <EditableListSection
          label="Diagnosis"
          items={editedSummary.diagnosis}
          onChange={(items) => setEditedSummary({ ...editedSummary, diagnosis: items })}
        />

        <EditableListSection
          label="Treatment"
          items={editedSummary.treatment}
          onChange={(items) => setEditedSummary({ ...editedSummary, treatment: items })}
        />

        <EditableListSection
          label="Next Steps"
          items={editedSummary.nextSteps}
          onChange={(items) => setEditedSummary({ ...editedSummary, nextSteps: items })}
        />

        <TouchableOpacity 
          style={commonStyles.button} 
          onPress={() => router.push('/consultation/review-prescription')}
        >
          <Text style={commonStyles.buttonText}>Finalize Summary</Text>
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
    header:{
    color:colors.white
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
  editSection: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 12,
  },
  sectionInput: {
    backgroundColor: colors.gray[50],
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
    lineHeight: 22,
  },
  listItemEdit: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  listNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginRight: 8,
    marginTop: 12,
    minWidth: 20,
  },
  listInputText: {
    flex: 1,
    backgroundColor: colors.gray[50],
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 50,
    textAlignVertical: 'top',
    lineHeight: 22,
  },
  addButton: {
    backgroundColor: colors.blue[50],
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  addButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});