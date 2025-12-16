
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../../store/useStore';
import { colors, commonStyles } from '../../styles/commonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';


const TreatmentSection = ({
  items,
  onChange,
  editable,
}: {
  items: Array<{ name: string; dosage: string; duration: string }>;
  onChange: (items: any[]) => void;
  editable: boolean;
}) => (
  <View style={styles.prescriptionSection}>
    <Text style={styles.prescriptionLabel}>Treatment</Text>
    {items.map((item, index) => (
      <View key={index} style={styles.medicationItem}>
        <Text style={styles.medicationNumber}>{index + 1}.</Text>
        <View style={styles.medicationDetails}>
          <TextInput
            style={[styles.medicationInput, styles.medicationName]}
            value={item.name}
            onChangeText={(text) => {
              const newItems = [...items];
              newItems[index].name = text;
              onChange(newItems);
            }}
            placeholder="Medication name"
            editable={editable}
          />
          <TextInput
            style={styles.medicationInput}
            value={item.dosage}
            onChangeText={(text) => {
              const newItems = [...items];
              newItems[index].dosage = text;
              onChange(newItems);
            }}
            placeholder="Dosage"
            editable={editable}
          />
          <TextInput
            style={styles.medicationInput}
            value={item.duration}
            onChangeText={(text) => {
              const newItems = [...items];
              newItems[index].duration = text;
              onChange(newItems);
            }}
            placeholder="Duration"
            editable={editable}
          />
        </View>
      </View>
    ))}
    {editable && (
      <TouchableOpacity
        style={styles.addButton}
        onPress={() =>
          onChange([...items, { name: '', dosage: '', duration: '' }])
        }
      >
        <Text style={styles.addButtonText}>+ Add Medication</Text>
      </TouchableOpacity>
    )}
  </View>
);

const ListSection = ({
  label,
  items,
  onChange,
  editable,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  editable: boolean;
}) => (
  <View style={styles.prescriptionSection}>
    <Text style={styles.prescriptionLabel}>{label}</Text>
    {items.map((item, index) => (
      <View key={index} style={styles.listItemPrescription}>
        <Text style={styles.bulletPoint}>•</Text>
        <TextInput
          style={styles.listItemInput}
          value={item}
          onChangeText={(text) => {
            const newItems = [...items];
            newItems[index] = text;
            onChange(newItems);
          }}
          multiline
          editable={editable}
        />
      </View>
    ))}
    {editable && (
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => onChange([...items, ''])}
      >
        <Text style={styles.addButtonText}>+ Add Item</Text>
      </TouchableOpacity>
    )}
  </View>
);

export default function ReviewPrescriptionScreen() {
  const router = useRouter();
  const [prescription, setPrescription] = useState({
    treatment: [
      {
        name: 'Folic Acid 400 mcg',
        dosage: '1 tablet daily',
        duration: 'Throughout pregnancy',
      },
      {
        name: 'Prenatal Vitamins',
        dosage: '1 tablet daily',
        duration: 'Throughout pregnancy',
      },
    ],
    advice: [
      'Schedule ultrasound scan within 1 week',
      'Return for follow-up in 2 weeks',
    ],
    nextSteps: [
      'Report any bleeding or severe pain immediately',
      'Maintain adequate rest and hydration',
    ],
  });
  // const [prescription, setPrescription] = useState(
  //   `Rx\n\n1. Folic Acid 400 mcg\n   - 1 tablet daily\n   - Duration: Throughout pregnancy\n\n2. Prenatal Vitamins\n   - 1 tablet daily\n   - Duration: Throughout pregnancy\n\nAdvice:\n- Schedule ultrasound scan within 1 week\n- Return for follow-up in 2 weeks\n- Report any bleeding or severe pain immediately`
  // );
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
        <Text style={[commonStyles.headerTitle,styles.header]}>Prescription Draft</Text>
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


         {/* Treatment Section */}
        <TreatmentSection
          items={prescription.treatment}
          onChange={(items) => setPrescription({ ...prescription, treatment: items })}
          editable={!isReviewed}
        />

        {/* Advice Section */}
        <ListSection
          label="Advice"
          items={prescription.advice}
          onChange={(items) => setPrescription({ ...prescription, advice: items })}
          editable={!isReviewed}
        />

        {/* Next Steps Section */}
        <ListSection
          label="Next Steps"
          items={prescription.nextSteps}
          onChange={(items) => setPrescription({ ...prescription, nextSteps: items })}
          editable={!isReviewed}
        />


        {/* <TextInput
          style={styles.prescriptionEditInput}
          value={prescription}
          onChangeText={setPrescription}
          multiline
          numberOfLines={15}
          editable={!isReviewed}
        /> */}

        {!isReviewed ? (
          <TouchableOpacity style={commonStyles.button} onPress={handleMarkReviewed}>
            <Text style={commonStyles.buttonText}>Mark as Reviewed</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[commonStyles.button, styles.whatsappButton]}
            onPress={handleSendWhatsApp}
          >
            <Image style={styles.whatsappIcon} source={require('../../assets/images/whatsapp.png')} />
            <Text style={[commonStyles.buttonText,styles.whatsappButtonText]}>Send on WhatsApp</Text>
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
  prescriptionSection: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  prescriptionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 12,
  },
  medicationItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  medicationNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginRight: 8,
    marginTop: 12,
    minWidth: 20,
  },
  medicationDetails: {
    flex: 1,
  },
  medicationInput: {
    backgroundColor: colors.gray[50],
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    marginBottom: 8,
  },
  medicationName: {
    fontWeight: '600',
  },
  listItemPrescription: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  bulletPoint: {
    fontSize: 16,
    color: colors.primary,
    marginRight: 8,
    marginTop: 8,
    fontWeight: 'bold',
  },
  listItemInput: {
    flex: 1,
    backgroundColor: colors.gray[50],
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 50,
    textAlignVertical: 'top',
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
    header:{
    color:colors.white
  },
    whatsappButton: {
    borderColor: colors.secondary,
    backgroundColor:'transparent',
    borderWidth:1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,  
  },
   whatsappButtonText: {
    color: colors.secondary,
  },
  whatsappIcon: {
    width: 24,
    height: 24,
    marginRight: 8, 
    resizeMode: 'contain',
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