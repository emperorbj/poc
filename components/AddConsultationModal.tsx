

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../store/useStore';
import { commonStyles } from '../styles/commonStyles';
import { Patient } from '../types';
import { DropdownPicker } from './DropdownPicker';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';


interface AddConsultationModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AddConsultationModal: React.FC<AddConsultationModalProps> = ({
  visible,
  onClose,
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    sex: 'Female' as 'Male' | 'Female' | 'Other',
    presentingComplaint: '',
    patientType: 'Existing' as 'New' | 'Existing',
    urgency: 'Medium' as 'High' | 'Medium' | 'Low',
    whatsappNumber: '+91',
    aadharId: '',
    country:'',
    state:'',
    city:''
  });
  const addConsultation = useStore((state) => state.addConsultation);
  const setCurrentConsultation = useStore((state) => state.setCurrentConsultation);

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
      presentingComplaint: formData.presentingComplaint || 'General consultation',
      urgency: formData.urgency,
      whatsappNumber: formData.whatsappNumber,
      aadharId: formData.aadharId,
      country:formData.country,
      state:formData.state,
      city:formData.city,
      time: new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      }),
    };
    
    const newConsultation = {
      id: Date.now().toString(),
      patient,
      status: 'Pending' as const,
      reviewed: false,
    };
    
    addConsultation(patient);
    setCurrentConsultation(newConsultation);
    
    // Reset form
    setFormData({
      name: '',
      age: '',
      sex: 'Female',
      presentingComplaint: '',
      patientType: 'Existing',
      urgency: 'Medium',
      whatsappNumber: '+91',
      aadharId: '',
      country:'',
      state:'',
      city:''
    });
    
    onClose();
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

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={commonStyles.label}>Name *</Text>
            <TextInput
              style={[commonStyles.input,styles.borderInput]}
              placeholder="Patient name"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />

            <View style={commonStyles.row}>
              <View style={commonStyles.halfWidth}>
                <Text style={commonStyles.label}>Age *</Text>
                <TextInput
                  style={[commonStyles.input,styles.borderInput]}
                  placeholder="Age"
                  keyboardType="numeric"
                  value={formData.age}
                  onChangeText={(text) => setFormData({ ...formData, age: text })}
                />
              </View>
              <View style={commonStyles.halfWidth}>
                <DropdownPicker
                  label="Sex"
                  value={formData.sex}
                  options={['Male', 'Female', 'Other']}
                  onValueChange={(value) =>
                    setFormData({ ...formData, sex: value as 'Male' | 'Female' | 'Other' })
                  }
                />
              </View>
            </View>

             <DropdownPicker
                        label="Complaint *"
                        value={formData.presentingComplaint}
                        options={[
                          'bleeding', 'missed periods', 'discharge','headache', 'fever', 'cold'
                        ]}
                        onValueChange={(value) => setFormData({ ...formData, presentingComplaint: value })}
                        placeholder="Select your specialty"
                      />

            {/* <Text style={commonStyles.label}>Presenting Complaint</Text>
            <TextInput
              style={[commonStyles.input,styles.borderInput]}
              placeholder="e.g., Headache, Fever, Follow-up"
              value={formData.presentingComplaint}
              onChangeText={(text) =>
                setFormData({ ...formData, presentingComplaint: text })
              }
            /> */}

            <DropdownPicker
              label="Patient Type"
              value={formData.patientType}
              options={['New', 'Existing']}
              onValueChange={(value) =>
                setFormData({ ...formData, patientType: value as 'New' | 'Existing' })
              }
            />

            <DropdownPicker
              label="Urgency"
              value={formData.urgency}
              options={['High', 'Medium', 'Low']}
              onValueChange={(value) =>
                setFormData({ ...formData, urgency: value as 'High' | 'Medium' | 'Low' })
              }
            />

            <Text style={commonStyles.label}>WhatsApp Number</Text>
            <TextInput
              style={[commonStyles.input,styles.borderInput]}
              placeholder="+91 XXXXX XXXXX"
              value={formData.whatsappNumber}
              onChangeText={(text) =>
                setFormData({ ...formData, whatsappNumber: text })
              }
              keyboardType="phone-pad"
            />

            <Text style={commonStyles.label}>Aadhar ID</Text>
            <TextInput
              style={[commonStyles.input,styles.borderInput]}
              placeholder="XXXX-XXXX-XXXX"
              value={formData.aadharId}
              onChangeText={(text) =>
                setFormData({ ...formData, aadharId: text })
              }
              keyboardType="numeric"
            />

            <Text style={commonStyles.label}>Country</Text>
            <TextInput
              style={[commonStyles.input,styles.borderInput]}
              placeholder=""
              value={formData.country}
              onChangeText={(text) =>
                setFormData({ ...formData, country: text })
              }
            />

             <Text style={commonStyles.label}>State</Text>
            <TextInput
              style={[commonStyles.input,styles.borderInput]}
              placeholder=""
              value={formData.state}
              onChangeText={(text) =>
                setFormData({ ...formData, state: text })
              }
            />

             <Text style={commonStyles.label}>City</Text>
            <TextInput
              style={[commonStyles.input,styles.borderInput]}
              placeholder=""
              value={formData.city}
              onChangeText={(text) =>
                setFormData({ ...formData, city: text })
              }
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

const styles = StyleSheet.create({
    borderInput:{
    borderColor:'grey'
  },
})