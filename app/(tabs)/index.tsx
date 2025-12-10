// app/(tabs)/index.tsx

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
import { FilterType, Consultation } from '../../types/index';
import { AddConsultationModal } from '../../components/AddConsultationModal';
import { ConsultationCard } from '../../components/ConsultationCard';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';


export default function ConsultationsScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterType>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const consultations = useStore((state) => state.consultations);
  const setCurrentConsultation = useStore((state) => state.setCurrentConsultation);

  const filteredConsultations = consultations.filter((c) => {
    if (filter === 'All') return true;
    return c.status === filter;
  });

  // const handleStartNext = () => {
  //   const nextPending = consultations.find((c) => c.status === 'Pending');
  //   if (nextPending) {
  //     handleSelectConsultation(nextPending);
  //   }
  // };

  const handleSelectConsultation = (consultation: Consultation) => {
    setCurrentConsultation(consultation);
    router.push('/consultation/consent');
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.header}>
        <View>
          <Text style={commonStyles.headerTitle}>My Consultations</Text>
          <Text style={styles.headerDate}>Today, 9 Dec 2025</Text>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filterContainer}>
        {(['All', 'Pending', 'Completed'] as FilterType[]).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterButton, filter === f && styles.filterButtonActive]}
            onPress={() => setFilter(f)}
          >
            <Text
              style={[
                styles.filterButtonText,
                filter === f && styles.filterButtonTextActive,
              ]}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      
      {/* <TouchableOpacity style={styles.startNextButton} onPress={handleStartNext}>
        <Ionicons name="play" size={24} color="white" />
        <Text style={styles.startNextButtonText}></Text>
      </TouchableOpacity> */}

      {/* Consultations List */}
      <ScrollView style={styles.consultationsList}>
        {filteredConsultations.map((consultation) => (
          <ConsultationCard
            key={consultation.id}
            consultation={consultation}
            onPress={() => handleSelectConsultation(consultation)}
          />
        ))}
      </ScrollView>

      {/* Add Consultation Button */}
      <TouchableOpacity style={styles.fab} onPress={() => setShowAddModal(true)}>
        <Ionicons name="add-sharp" size={24} color="white" />
        <Text style={styles.fabText}>Start Consultation</Text>
      </TouchableOpacity>

      {/* Add Consultation Modal */}
      <AddConsultationModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerDate: {
    fontSize: 14,
    color: colors.white,
    marginTop: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    color: colors.gray[500],
  },
  filterButtonTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
  startNextButton: {
    backgroundColor: colors.secondary,
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection:'row',
    justifyContent:'center',
    gap:4
  },
  startNextButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  consultationsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: colors.primary,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    gap:2,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});