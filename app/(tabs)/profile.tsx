// app/(tabs)/profile.tsx

import React from 'react';
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

export default function ProfileScreen() {
  const router = useRouter();
  const tenantDetails = useStore((state) => state.tenantDetails);
  const logout = useStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.header}>
        <Text style={commonStyles.headerTitle}>Profile</Text>
      </View>

      <ScrollView contentContainerStyle={commonStyles.scrollContent}>
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>
            {tenantDetails?.doctorName?.[0] || 'H'}
          </Text>
        </View>

        <Text style={styles.doctorName}>{tenantDetails?.doctorName}</Text>
        <Text style={styles.specialty}>{tenantDetails?.specialty}</Text>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Clinic</Text>
            <Text style={styles.infoValue}>{tenantDetails?.clinicName}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Location</Text>
            <Text style={styles.infoValue}>{tenantDetails?.locationName}</Text>
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
          style={[commonStyles.button, { backgroundColor: colors.danger }]} 
          onPress={handleLogout}
        >
          <Text style={commonStyles.buttonText}>Logout</Text>
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
});