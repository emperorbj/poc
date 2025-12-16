

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useStore } from '../../store/useStore';
import { colors, commonStyles } from '../../styles/commonStyles';
import { Ionicons } from '@expo/vector-icons';
import { useTranscription } from '../../hooks/use-transcription';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { ViewStyle, TextStyle } from 'react-native';

export default function TranscriptionScreen() {
  const router = useRouter();
  const [notes, setNotes] = useState('');
  const currentConsultation = useStore((state) => state.currentConsultation);
  const updateConsultation = useStore((state) => state.updateConsultation);

  // Hooks must be called unconditionally
  const {
    isConnected,
    isRecording,
    transcriptions,
    currentInterim,
    error: transcriptionError,
    startTranscription,
    stopTranscription,
    clearTranscriptions,
  } = useTranscription();

  if (!currentConsultation) {
    router.back();
    return null;
  }

  // Show error if module initialization failed
  if (transcriptionError && transcriptionError.includes('not available')) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={commonStyles.centerContent}>
          <Text style={[commonStyles.headerTitle, { color: colors.danger, marginBottom: 16 }]}>
            Initialization Error
          </Text>
          <Text style={[commonStyles.label, { textAlign: 'center', marginBottom: 24 }]}>
            {transcriptionError}
          </Text>
          <Text style={[commonStyles.label, { textAlign: 'center', marginBottom: 24, fontSize: 12, color: colors.gray[600] }]}>
            Please ensure the app was built with native modules properly linked. Run 'npx expo prebuild --clean' before building.
          </Text>
          <TouchableOpacity style={commonStyles.button} onPress={() => router.back()}>
            <Text style={commonStyles.buttonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleStartRecording = async () => {
    try {
      await startTranscription();
    } catch (err) {
      Alert.alert('Error', 'Failed to start recording. Please try again.');
    }
  };

  const handleStopRecording = async () => {
    try {
      await stopTranscription();
    } catch (err) {
      console.error('Error stopping:', err);
    }
  };

  const handleFinish = () => {
    if (isRecording) {
      Alert.alert(
        'Recording in Progress',
        'Please stop the recording before finishing.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Compile full transcription
    const fullTranscription = transcriptions
      .map(t => t.text)
      .join(' ');

    const transcriptionWithNotes = fullTranscription + (notes ? `\n\nNotes: ${notes}` : '');

    updateConsultation(currentConsultation.id, {
      transcription: transcriptionWithNotes,
    });

    router.push('/consultation/session-summary');
  };

  const getStatusText = () => {
    if (transcriptionError) return '⚠️ Error';
    if (isRecording) return '🔴 Recording & Transcribing...';
    if (isConnected) return '🟢 Connected';
    return '⚪ Ready';
  };

  const getStatusColor = () => {
    if (transcriptionError) return colors.danger;
    if (isRecording) return colors.warning;
    if (isConnected) return colors.secondary;
    return colors.gray[500];
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={commonStyles.header}>
        <Text style={commonStyles.headerTitle}>
          {currentConsultation.patient.name}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusBadgeText}>{getStatusText()}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={commonStyles.scrollContent}>
        {/* Connection Status */}
        {!isConnected && !isRecording && (
          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={24} color={colors.primary} />
            <Text style={styles.infoText}>
              Tap "Start Live Transcription" to begin recording.{'\n'}
              Make sure you're in a quiet environment for best results.
            </Text>
          </View>
        )}

        {/* Error Display */}
        {transcriptionError && (
          <View style={[styles.infoBox, styles.errorBox]}>
            <Ionicons name="alert-circle" size={24} color={colors.danger} />
            <Text style={[styles.infoText, { color: colors.danger }]}>
              {transcriptionError}
            </Text>
          </View>
        )}

        {/* Recording Controls */}
        <View style={styles.controlsContainer}>
          {!isRecording ? (
            <TouchableOpacity
              style={[styles.recordButton, styles.startButton]}
              onPress={handleStartRecording}
              disabled={isRecording}
            >
              <Ionicons name="mic" size={24} color="white" />
              <Text style={styles.recordButtonText}>
                Start Live Transcription
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.recordingControls}>
              <TouchableOpacity
                style={[styles.recordButton, styles.stopButton]}
                onPress={handleStopRecording}
              >
                <Ionicons name="stop" size={24} color="white" />
                <Text style={styles.recordButtonText}>Stop Recording</Text>
              </TouchableOpacity>

              <View style={styles.recordingIndicator}>
                <View style={styles.recordingDot} />
                <Text style={styles.recordingText}>Recording...</Text>
              </View>
            </View>
          )}
        </View>

        {/* Live Transcription Display */}
        {(transcriptions.length > 0 || currentInterim) && (
          <View style={styles.transcriptionBox}>
            <View style={styles.transcriptionHeader}>
              <Text style={commonStyles.sectionTitle}>Live Transcription</Text>
              {transcriptions.length > 0 && (
                <TouchableOpacity onPress={clearTranscriptions}>
                  <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
              )}
            </View>

            <ScrollView 
              style={styles.transcriptionScroll}
              nestedScrollEnabled
            >
              {/* Final Transcriptions */}
              {transcriptions.map((t) => (
                <View key={t.id} style={styles.transcriptionItem}>
                  {t.speakerTag && (
                    <Text style={styles.speakerTag}>
                      Speaker {t.speakerTag}:
                    </Text>
                  )}
                  <Text style={styles.transcriptionText}>{t.text}</Text>
                  {t.confidence && (
                    <Text style={styles.confidenceText}>
                      {(t.confidence * 100).toFixed(0)}% confidence
                    </Text>
                  )}
                </View>
              ))}

              {/* Interim Transcription */}
              {currentInterim && (
                <View style={[styles.transcriptionItem, styles.interimItem]}>
                  <Text style={styles.interimText}>{currentInterim}</Text>
                </View>
              )}

              {isRecording && !currentInterim && transcriptions.length === 0 && (
                <View style={styles.listeningContainer}>
                  <ActivityIndicator size="small" color={colors.primary} />
                  <Text style={styles.listeningText}>Listening...</Text>
                </View>
              )}
            </ScrollView>
          </View>
        )}

        {/* Notes Section */}
        <View style={styles.notesBox}>
          <Text style={commonStyles.sectionTitle}>Additional Notes</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Add any additional notes here..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={8}
            editable={!isRecording}
          />
        </View>

        {/* Finish Button */}
        <TouchableOpacity
          style={[
            commonStyles.button,
            isRecording && styles.buttonDisabled,
          ]}
          onPress={handleFinish}
          disabled={isRecording}
        >
          <Text style={commonStyles.buttonText}>
            {isRecording ? 'Stop Recording First' : 'Continue to Summary'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusBadgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: colors.blue[50],
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  errorBox: {
    backgroundColor: '#fee',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.gray[700],
    lineHeight: 20,
  },
  controlsContainer: {
    marginBottom: 20,
  },
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  startButton: {
    backgroundColor: colors.secondary,
  },
  stopButton: {
    backgroundColor: colors.danger,
  },
  recordButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  recordingControls: {
    gap: 16,
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.danger,
  },
  recordingText: {
    fontSize: 16,
    color: colors.gray[700],
    fontWeight: '500',
  },
  transcriptionBox: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    minHeight: 200,
    maxHeight: 400,
  },
  transcriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  clearText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  transcriptionScroll: {
    flex: 1,
  },
  transcriptionItem: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: colors.green[50],
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.secondary,
  },
  interimItem: {
    backgroundColor: colors.gray[100],
    borderLeftColor: colors.gray[400],
  },
  speakerTag: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 4,
  },
  transcriptionText: {
    fontSize: 14,
    color: colors.gray[800],
    lineHeight: 20,
  },
  interimText: {
    fontSize: 14,
    color: colors.gray[600],
    fontStyle: 'italic',
    lineHeight: 20,
  },
  confidenceText: {
    fontSize: 11,
    color: colors.gray[500],
    marginTop: 4,
  },
  listeningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 20,
  },
  listeningText: {
    fontSize: 14,
    color: colors.gray[600],
    fontStyle: 'italic',
  },
  notesBox: {
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
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
  buttonDisabled: {
    opacity: 0.5,
  },
});