// app/auth/tenant-setup.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../../store/useStore';
import { commonStyles } from '../../styles/commonStyles';
import { TenantDetails } from '../../types/index';

export default function TenantSetupScreen() {
  const router = useRouter();
  const [details, setDetails] = useState<TenantDetails>({
    doctorName: '',
    clinicName: '',
    specialty: '',
    locationName: '',
  });
  const setTenantDetails = useStore((state) => state.setTenantDetails);

  const handleSubmit = () => {
    setTenantDetails(details);
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView contentContainerStyle={commonStyles.scrollContent}>
        <Text style={commonStyles.headerTitle}>Setup Your Profile</Text>

        <View style={{ marginTop: 20 }}>
          <Text style={commonStyles.label}>Doctor Name</Text>
          <TextInput
            style={commonStyles.input}
            placeholder="Dr. John Doe"
            value={details.doctorName}
            onChangeText={(text) => setDetails({ ...details, doctorName: text })}
          />

          <Text style={commonStyles.label}>Clinic Name</Text>
          <TextInput
            style={commonStyles.input}
            placeholder="Health Center"
            value={details.clinicName}
            onChangeText={(text) => setDetails({ ...details, clinicName: text })}
          />

          <Text style={commonStyles.label}>Specialty</Text>
          <TextInput
            style={commonStyles.input}
            placeholder="Gynecology"
            value={details.specialty}
            onChangeText={(text) => setDetails({ ...details, specialty: text })}
          />

          <Text style={commonStyles.label}>Location</Text>
          <TextInput
            style={commonStyles.input}
            placeholder="Mumbai, Maharashtra"
            value={details.locationName}
            onChangeText={(text) =>
              setDetails({ ...details, locationName: text })
            }
          />

          <TouchableOpacity style={commonStyles.button} onPress={handleSubmit}>
            <Text style={commonStyles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}