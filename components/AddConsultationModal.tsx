// components/AddConsultationModal.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { useStore } from '../store/useStore';
import { commonStyles } from '../styles/commonStyles';
import { Patient } from '../types';
import { router } from 'expo-router';

interface AddConsultationModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AddConsultationModal: React.FC<AddConsultationModalProps> = ({
  visible,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    sex: 'Female' as 'Male' | 'Female' | 'Other',
    presentingComplaint: 'Follow-up',
    patientType: 'Existing' as 'New' | 'Existing',
    urgency: 'Medium' as 'High' | 'Medium' | 'Low',
    whatsappNumber: '+91',
    aadharId: '',
  });
  const addConsultation = useStore((state) => state.addConsultation);

  const handleSubmit = () => {
    if (!formData.name || !formData.age) {
      alert('Please fill in all required fields');
      return;
    }

    const patient: Patient = {
      id: Date.now().toString(),
      name: formData.name,
      age: parseInt(formData.age),
      sex: formData.sex,
      patientType: formData.patientType,
      presentingComplaint: formData.presentingComplaint,
      urgency: formData.urgency,
      whatsappNumber: formData.whatsappNumber,
      aadharId: formData.aadharId,
      time: new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      }),
    };
    addConsultation(patient);
    
    // Reset form
    setFormData({
      name: '',
      age: '',
      sex: 'Female',
      presentingComplaint: 'Follow-up',
      patientType: 'Existing',
      urgency: 'Medium',
      whatsappNumber: '+91',
      aadharId: '',
    });
    
        router.push('/consultation/consent');

  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={commonStyles.modalOverlay}>
        <View style={commonStyles.modalContent}>
          <View style={commonStyles.modalHeader}>
            <Text style={commonStyles.modalTitle}>Consultation Details</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={commonStyles.modalClose}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView>
            <Text style={commonStyles.label}>Name *</Text>
            <TextInput
              style={commonStyles.input}
              placeholder="Patient name"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />

            <View style={commonStyles.row}>
              <View style={commonStyles.halfWidth}>
                <Text style={commonStyles.label}>Age *</Text>
                <TextInput
                  style={commonStyles.input}
                  placeholder="Age"
                  keyboardType="numeric"
                  value={formData.age}
                  onChangeText={(text) => setFormData({ ...formData, age: text })}
                />
              </View>
              <View style={commonStyles.halfWidth}>
                <Text style={commonStyles.label}>Sex</Text>
                <View style={commonStyles.input}>
                  <Text>{formData.sex}</Text>
                </View>
              </View>
            </View>

            <Text style={commonStyles.label}>Presenting Complaint</Text>
            <View style={commonStyles.input}>
              <Text>{formData.presentingComplaint}</Text>
            </View>

            <Text style={commonStyles.label}>Patient Type</Text>
            <View style={commonStyles.input}>
              <Text>{formData.patientType}</Text>
            </View>

            <Text style={commonStyles.label}>Urgency</Text>
            <View style={commonStyles.input}>
              <Text>{formData.urgency}</Text>
            </View>

            <Text style={commonStyles.label}>WhatsApp Number</Text>
            <TextInput
              style={commonStyles.input}
              placeholder="+91 XXXXX XXXXX"
              value={formData.whatsappNumber}
              onChangeText={(text) =>
                setFormData({ ...formData, whatsappNumber: text })
              }
              keyboardType="phone-pad"
            />

            <Text style={commonStyles.label}>Aadhar ID</Text>
            <TextInput
              style={commonStyles.input}
              placeholder="XXXX-XXXX-XXXX"
              value={formData.aadharId}
              onChangeText={(text) =>
                setFormData({ ...formData, aadharId: text })
              }
              keyboardType="numeric"
            />

            <TouchableOpacity style={commonStyles.button} onPress={handleSubmit}>
              <Text style={commonStyles.buttonText}>Add Consultation</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};