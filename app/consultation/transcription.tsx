// app/consultation/transcription.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../../store/useStore';
import { colors, commonStyles } from '../../styles/commonStyles';
import { AudioVisualizer } from '../../components/AudioVisualizer';

export default function TranscriptionScreen() {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const currentConsultation = useStore((state) => state.currentConsultation);
  const updateConsultation = useStore((state) => state.updateConsultation);

  if (!currentConsultation) {
    router.back();
    return null;
  }

  const handleStartRecording = () => {
    setIsRecording(true);
    setShowNotes(true);
    
    // Simulate transcription (replace with actual API call)
    setTimeout(() => {
      setTranscription(
        'I will prescribe folic acid 400 mcg daily. It is important for early pregnancy development. I will also do a quick early pregnancy scan today to check the sac and rule out any complications.'
      );
    }, 2000);
  };

  const handleStop = () => {
    setIsRecording(false);
    updateConsultation(currentConsultation.id, { transcription });
    router.push('/consultation/session-summary');
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.header}>
        <Text style={commonStyles.headerTitle}>
          {currentConsultation.patient.name}
        </Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusBadgeText}>
            {isRecording ? '● Recording' : '✓ Paused'}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={commonStyles.scrollContent}>
        {!showNotes ? (
          <View style={commonStyles.centerContent}>
            <TouchableOpacity
              style={styles.recordButton}
              onPress={handleStartRecording}
            >
              <Text style={styles.recordButtonText}>
                🎙 Start Live Transcription
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Audio Visualizer */}
            <AudioVisualizer 
              isRecording={isRecording}
              onPause={() => setIsRecording(!isRecording)}
              onStop={handleStop}
            />

            {/* Live Transcription */}
            <View style={styles.transcriptionBox}>
              <Text style={commonStyles.sectionTitle}>Live Transcription</Text>
              <Text style={styles.transcriptionText}>
                {transcription || 'Listening...'}
              </Text>
            </View>

            {/* Notes */}
            <View style={styles.notesBox}>
              <Text style={commonStyles.sectionTitle}>Notes</Text>
              <TextInput
                style={styles.notesInput}
                placeholder="Take notes here"
                multiline
                numberOfLines={8}
              />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  statusBadge: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusBadgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  recordButton: {
    backgroundColor: colors.danger,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  recordButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  transcriptionBox: {
    backgroundColor: colors.gray[100],
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  transcriptionText: {
    fontSize: 14,
    color: colors.gray[700],
    lineHeight: 22,
    fontStyle: 'italic',
  },
  notesBox: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
  },
  notesInput: {
    backgroundColor: colors.gray[50],
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 8,
    padding: 12,
    minHeight: 120,
    textAlignVertical: 'top',
    fontSize: 14,
  },
});