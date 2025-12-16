

// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   ActivityIndicator,
//   Alert,
// } from 'react-native';
// import { useRouter } from 'expo-router';
// import { useStore } from '../../store/useStore';
// import { colors, commonStyles } from '../../styles/commonStyles';

// export default function ProfileScreen() {
//   const router = useRouter();
//   const [isLoggingOut, setIsLoggingOut] = useState(false);
//   const tenantDetails = useStore((state) => state.tenantDetails);
//   const doctorInfo = useStore((state) => state.doctorInfo);
//   const logout = useStore((state) => state.logout);

//   const handleLogout = async () => {
//     Alert.alert(
//       'Logout',
//       'Are you sure you want to logout?',
//       [
//         {
//           text: 'Cancel',
//           style: 'cancel',
//         },
//         {
//           text: 'Logout',
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               setIsLoggingOut(true);
//               console.log('🚪 Logging out...');
//               await logout();
//               console.log('✅ Logout complete');
              
//               // Navigate to welcome screen and let it handle the state
//               setTimeout(() => {
//                 router.replace('/');
//               }, 100);
//             } catch (error) {
//               console.error('❌ Logout failed:', error);
//               // Still navigate away even if logout API fails
//               setTimeout(() => {
//                 router.replace('/');
//               }, 100);
//             } finally {
//               setIsLoggingOut(false);
//             }
//           },
//         },
//       ]
//     );
//   };

//   return (
//     <SafeAreaView style={commonStyles.container}>
//       <View style={commonStyles.header}>
//         <Text style={commonStyles.headerTitle}>Profile</Text>
//       </View>

//       <ScrollView contentContainerStyle={commonStyles.scrollContent}>
//         <View style={styles.logoPlaceholder}>
//           <Text style={styles.logoText}>
//             {doctorInfo?.name?.[0] || tenantDetails?.doctorName?.[0] || 'H'}
//           </Text>
//         </View>

//         <Text style={styles.doctorName}>
//           {doctorInfo?.name || tenantDetails?.doctorName || 'Doctor'}
//         </Text>
//         <Text style={styles.specialty}>
//           {doctorInfo?.specialty || tenantDetails?.specialty || 'Specialty'}
//         </Text>

//         <View style={styles.infoCard}>
//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>Email</Text>
//             <Text style={styles.infoValue}>{doctorInfo?.email || 'N/A'}</Text>
//           </View>
//           <View style={styles.divider} />
//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>Clinic</Text>
//             <Text style={styles.infoValue}>{tenantDetails?.clinicName || 'N/A'}</Text>
//           </View>
//           <View style={styles.divider} />
//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>Location</Text>
//             <Text style={styles.infoValue}>{tenantDetails?.locationName || 'N/A'}</Text>
//           </View>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Settings</Text>
          
//           <TouchableOpacity style={styles.menuItem}>
//             <Text style={styles.menuItemText}>Edit Profile</Text>
//             <Text style={styles.menuItemArrow}>›</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.menuItem}>
//             <Text style={styles.menuItemText}>Notifications</Text>
//             <Text style={styles.menuItemArrow}>›</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.menuItem}>
//             <Text style={styles.menuItemText}>Privacy & Security</Text>
//             <Text style={styles.menuItemArrow}>›</Text>
//           </TouchableOpacity>

//           <TouchableOpacity style={styles.menuItem}>
//             <Text style={styles.menuItemText}>Help & Support</Text>
//             <Text style={styles.menuItemArrow}>›</Text>
//           </TouchableOpacity>
//         </View>

//         <TouchableOpacity 
//           style={[
//             commonStyles.button, 
//             { backgroundColor: colors.danger },
//             isLoggingOut && styles.buttonDisabled
//           ]} 
//           onPress={handleLogout}
//           disabled={isLoggingOut}
//         >
//           {isLoggingOut ? (
//             <ActivityIndicator color={colors.white} />
//           ) : (
//             <Text style={commonStyles.buttonText}>Logout</Text>
//           )}
//         </TouchableOpacity>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   logoPlaceholder: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: colors.primary,
//     justifyContent: 'center',
//     alignItems: 'center',
//     alignSelf: 'center',
//     marginBottom: 16,
//   },
//   logoText: {
//     fontSize: 36,
//     color: colors.white,
//     fontWeight: 'bold',
//   },
//   doctorName: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: colors.gray[800],
//     textAlign: 'center',
//     marginBottom: 4,
//   },
//   specialty: {
//     fontSize: 16,
//     color: colors.gray[500],
//     textAlign: 'center',
//     marginBottom: 24,
//   },
//   infoCard: {
//     backgroundColor: colors.white,
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 24,
//   },
//   infoRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 12,
//   },
//   infoLabel: {
//     fontSize: 14,
//     color: colors.gray[500],
//     fontWeight: '500',
//   },
//   infoValue: {
//     fontSize: 14,
//     color: colors.gray[800],
//     fontWeight: '600',
//   },
//   divider: {
//     height: 1,
//     backgroundColor: colors.gray[200],
//   },
//   section: {
//     marginBottom: 24,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: colors.gray[800],
//     marginBottom: 12,
//   },
//   menuItem: {
//     backgroundColor: colors.white,
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 8,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   menuItemText: {
//     fontSize: 16,
//     color: colors.gray[800],
//   },
//   menuItemArrow: {
//     fontSize: 24,
//     color: colors.gray[400],
//   },
//   buttonDisabled: {
//     opacity: 0.6,
//   },
// });



// app/(tabs)/profile.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../../store/useStore';
import { colors, commonStyles } from '../../styles/commonStyles';

export default function ProfileScreen() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const tenantDetails = useStore((state) => state.tenantDetails);
  const doctorInfo = useStore((state) => state.doctorInfo);
  const logout = useStore((state) => state.logout);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoggingOut(true);
              console.log('🚪 Logging out...');
              
              // Clear state first
              await logout();
              console.log('✅ Logout complete');
              
              // Navigation happens automatically via the welcome screen's useEffect
              // No need to manually navigate here
            } catch (error) {
              console.error('❌ Logout failed:', error);
              // Even on error, state is cleared in the logout function
            } finally {
              setIsLoggingOut(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.header}>
        <Text style={commonStyles.headerTitle}>Profile</Text>
      </View>

      <ScrollView contentContainerStyle={commonStyles.scrollContent}>
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>
            {doctorInfo?.name?.[0] || tenantDetails?.doctorName?.[0] || 'H'}
          </Text>
        </View>

        <Text style={styles.doctorName}>
          {doctorInfo?.name || tenantDetails?.doctorName || 'Doctor'}
        </Text>
        <Text style={styles.specialty}>
          {doctorInfo?.specialty || tenantDetails?.specialty || 'Specialty'}
        </Text>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{doctorInfo?.email || 'N/A'}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Clinic</Text>
            <Text style={styles.infoValue}>
              {doctorInfo?.clinic_name || tenantDetails?.clinicName || 'N/A'}
            </Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Registration Number</Text>
            <Text style={styles.infoValue}>
              {doctorInfo?.medical_registration_number || tenantDetails?.medicalRegistrationNumber || 'N/A'}
            </Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Experience</Text>
            <Text style={styles.infoValue}>
              {doctorInfo?.experience ? `${doctorInfo.experience} years` : tenantDetails?.yearsOfExperience || 'N/A'}
            </Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Location</Text>
            <Text style={styles.infoValue}>
              {doctorInfo?.location || tenantDetails?.locationName || 'N/A'}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Edit Profile</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Notifications</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Privacy & Security</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Help & Support</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[
            commonStyles.button, 
            { backgroundColor: colors.danger },
            isLoggingOut && styles.buttonDisabled
          ]} 
          onPress={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={commonStyles.buttonText}>Logout</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 36,
    color: colors.white,
    fontWeight: 'bold',
  },
  doctorName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.gray[800],
    textAlign: 'center',
    marginBottom: 4,
  },
  specialty: {
    fontSize: 16,
    color: colors.gray[500],
    textAlign: 'center',
    marginBottom: 24,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.gray[500],
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: colors.gray[800],
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray[200],
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[800],
    marginBottom: 12,
  },
  menuItem: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: colors.gray[800],
  },
  menuItemArrow: {
    fontSize: 24,
    color: colors.gray[400],
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});