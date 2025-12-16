// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   KeyboardAvoidingView,
//   Alert,
//   Platform,
//   ScrollView,
//   StyleSheet
// } from 'react-native';
// import { useRouter } from 'expo-router';
// import { useStore } from '../../store/useStore';
// import { colors, commonStyles } from '../../styles/commonStyles';
// import { TenantDetails } from '../../types';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { DropdownPicker } from '@/components/DropdownPicker';

// export default function TenantSetupScreen() {
//   const router = useRouter();
//   const userRegistration = useStore((state) => state.userRegistration);
//   const doctorInfo = useStore((state) => state.doctorInfo);
//   const [isLoading, setIsLoading] = useState(false);
//   const [details, setDetails] = useState<TenantDetails>({
//     doctorName: userRegistration?.doctorName || doctorInfo?.name || '',
//     clinicName: '',
//     specialty: userRegistration?.specialty || doctorInfo?.specialty || '',
//     medicalRegistrationNumber: '',
//     yearsOfExperience: '',
//     locationName: '',
//   });
//   const setTenantDetails = useStore((state) => state.setTenantDetails);

//   const handleSubmit = async () => {
//     if (!details.medicalRegistrationNumber || !details.yearsOfExperience) {
//       Alert.alert('Error', 'Please fill in all required fields');
//       return;
//     }

//     try {
//       setIsLoading(true);
//       await setTenantDetails(details);
//       router.replace('/(tabs)');
//     } catch (error) {
//       Alert.alert('Error', 'Failed to save profile. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <SafeAreaView style={commonStyles.container}>
//         <KeyboardAvoidingView
//               behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//               style={{ flex: 1 }}
//             >
//       <ScrollView contentContainerStyle={commonStyles.scrollContent}>
//         <Text style={commonStyles.headerTitle}>Setup Your Profile</Text>

//         <View style={{ marginTop: 20 }}>
//           <Text style={[commonStyles.label]}>Doctor Name</Text>
//           <TextInput
//             style={[commonStyles.input,styles.borderInput]}
//             placeholder="Dr. John Doe"
//             value={details.doctorName}
//             onChangeText={(text) => setDetails({ ...details, doctorName: text })}
//           />

//           <Text style={commonStyles.label}>Clinic Name</Text>
//           <TextInput
//             style={[commonStyles.input,styles.borderInput]}
//             placeholder="Health Center"
//             value={details.clinicName}
//             onChangeText={(text) => setDetails({ ...details, clinicName: text })}
//           />

//           <Text style={commonStyles.label}>Specialty</Text>
//           <TextInput
//             style={[commonStyles.input,styles.borderInput]}
//             placeholder="Gynecology"
//             value={details.specialty}
//             onChangeText={(text) => setDetails({ ...details, specialty: text })}
//           />


//           <Text style={commonStyles.label}>Medical Registration Number *</Text>
//           <TextInput
//             style={[commonStyles.input, styles.borderInput]}
//             placeholder="e.g., MCI-12345"
//             value={details.medicalRegistrationNumber}
//             onChangeText={(text) =>
//               setDetails({ ...details, medicalRegistrationNumber: text })
//             }
//           />

//           <DropdownPicker
//             label="Years of Experience *"
//             value={details.yearsOfExperience}
//             options={[
//               'Less than 1 year',
//               '1-3 years',
//               '3-5 years',
//               '5-10 years',
//               '10-15 years',
//               '15-20 years',
//               '20+ years',
//             ]}
//             onValueChange={(value) =>
//               setDetails({ ...details, yearsOfExperience: value })
//             }
//             placeholder="Select experience"
//           />

//           <Text style={commonStyles.label}>Location</Text>
//           <TextInput
//             style={[commonStyles.input,styles.borderInput]}
//             placeholder="Mumbai, Maharashtra"
//             value={details.locationName}
//             onChangeText={(text) =>
//               setDetails({ ...details, locationName: text })
//             }
//           />

//           <TouchableOpacity style={commonStyles.button} onPress={handleSubmit}>
//             <Text style={commonStyles.buttonText}>Continue</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//     borderInput:{
//     borderColor:'grey'
//   },
//   nameText:{
//     color:colors.primary
//   }
// })

// app/auth/tenant-setup.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet
} from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../../store/useStore';
import { colors, commonStyles } from '../../styles/commonStyles';
import { TenantDetails } from '../../types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DropdownPicker } from '@/components/DropdownPicker';

export default function TenantSetupScreen() {
  const router = useRouter();
  const userRegistration = useStore((state) => state.userRegistration);
  const doctorInfo = useStore((state) => state.doctorInfo);
  const [isLoading, setIsLoading] = useState(false);
  const [details, setDetails] = useState<TenantDetails>({
    doctorName: userRegistration?.doctorName || doctorInfo?.name || '',
    clinicName: '',
    specialty: userRegistration?.specialty || doctorInfo?.specialty || '',
    medicalRegistrationNumber: '',
    yearsOfExperience: '',
    locationName: '',
  });
  const setTenantDetails = useStore((state) => state.setTenantDetails);

  const handleSubmit = async () => {
    // Validation
    if (!details.clinicName || !details.medicalRegistrationNumber || !details.yearsOfExperience) {
      Alert.alert('Error', 'Please fill in all required fields (Clinic Name, Registration Number, and Years of Experience)');
      return;
    }

    if (!details.locationName) {
      Alert.alert('Error', 'Please enter your location');
      return;
    }

    try {
      setIsLoading(true);
      console.log('📤 Submitting profile:', details);

      // This will call the API and save to storage
      await setTenantDetails(details);
      
      console.log('✅ Profile setup complete - navigation handled by root layout');
      // Navigation happens automatically in root layout when isProfileComplete becomes true
    } catch (error: any) {
      console.error('❌ Profile setup error:', error);
      Alert.alert(
        'Error', 
        error.message || 'Failed to save profile. Please try again.'
      );
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
          <Text style={commonStyles.headerTitle}>Setup Your Profile</Text>
          <Text style={styles.subtitle}>
            Complete your profile to start using Humaein
          </Text>

          <View style={{ marginTop: 20 }}>
            <Text style={[commonStyles.label]}>Doctor Name</Text>
            <TextInput
              style={[commonStyles.input, styles.borderInput]}
              placeholder="Dr. John Doe"
              value={details.doctorName}
              onChangeText={(text) => setDetails({ ...details, doctorName: text })}
              editable={!isLoading}
            />

            <Text style={commonStyles.label}>Clinic Name *</Text>
            <TextInput
              style={[commonStyles.input, styles.borderInput]}
              placeholder="e.g., City Health Center"
              value={details.clinicName}
              onChangeText={(text) => setDetails({ ...details, clinicName: text })}
              editable={!isLoading}
            />

            <Text style={commonStyles.label}>Specialty</Text>
            <TextInput
              style={[commonStyles.input, styles.borderInput]}
              placeholder="e.g., Gynecology"
              value={details.specialty}
              onChangeText={(text) => setDetails({ ...details, specialty: text })}
              editable={!isLoading}
            />

            <Text style={commonStyles.label}>Medical Registration Number *</Text>
            <TextInput
              style={[commonStyles.input, styles.borderInput]}
              placeholder="e.g., MCI-12345"
              value={details.medicalRegistrationNumber}
              onChangeText={(text) =>
                setDetails({ ...details, medicalRegistrationNumber: text })
              }
              editable={!isLoading}
            />

            <DropdownPicker
              label="Years of Experience *"
              value={details.yearsOfExperience}
              options={[
                'Less than 1 year',
                '1-3 years',
                '3-5 years',
                '5-10 years',
                '10-15 years',
                '15-20 years',
                '20+ years',
              ]}
              onValueChange={(value) =>
                setDetails({ ...details, yearsOfExperience: value })
              }
              placeholder="Select experience"
            />

            <Text style={commonStyles.label}>Location *</Text>
            <TextInput
              style={[commonStyles.input, styles.borderInput]}
              placeholder="e.g., Mumbai, Maharashtra"
              value={details.locationName}
              onChangeText={(text) =>
                setDetails({ ...details, locationName: text })
              }
              editable={!isLoading}
            />

            <TouchableOpacity 
              style={[commonStyles.button, isLoading && styles.buttonDisabled]} 
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={commonStyles.buttonText}>Complete Profile</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  borderInput: {
    borderColor: 'grey'
  },
  subtitle: {
    fontSize: 14,
    color: colors.gray[600],
    marginTop: 8,
    textAlign: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});