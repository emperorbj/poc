// components/ConsultationCard.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Consultation } from '../types';
import { colors } from '../styles/commonStyles';

interface ConsultationCardProps {
  consultation: Consultation;
  onPress: () => void;
}

export const ConsultationCard: React.FC<ConsultationCardProps> = ({
  consultation,
  onPress,
}) => {
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'High':
        return colors.danger;
      case 'Medium':
        return colors.warning;
      case 'Low':
        return colors.secondary;
      default:
        return colors.gray[500];
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View>
          <Text style={styles.time}>{consultation.patient.time}</Text>
          <Text style={styles.name}>{consultation.patient.name}</Text>
        </View>
        <View style={styles.dragHandle}>
          <Text style={styles.dragIcon}>☰</Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {consultation.patient.age}/{consultation.patient.sex[0]}
          </Text>
        </View>
        <View
          style={[
            styles.badge,
            {
              backgroundColor:
                consultation.patient.patientType === 'New'
                  ? colors.blue[100]
                  : colors.indigo[100],
            },
          ]}
        >
          <Text style={styles.badgeText}>
            {consultation.patient.patientType}
          </Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {consultation.patient.presentingComplaint}
          </Text>
        </View>
        <View
          style={[
            styles.badge,
            {
              backgroundColor: getUrgencyColor(consultation.patient.urgency),
            },
          ]}
        >
          <Text style={[styles.badgeText, { color: colors.white }]}>
            {consultation.patient.urgency}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  time: {
    fontSize: 14,
    color: colors.gray[500],
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray[800],
  },
  dragHandle: {
    justifyContent: 'center',
  },
  dragIcon: {
    fontSize: 24,
    color: colors.gray[400],
  },
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    backgroundColor: colors.gray[100],
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    color: colors.gray[700],
    fontWeight: '500',
  },
});