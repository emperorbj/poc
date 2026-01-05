// hooks/use-transcription-audio-studio.ts

import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, PermissionsAndroid, Alert } from 'react-native';
import { transcriptionService } from '../services/transcriptionService';
import { useAudioRecorder, type AudioDataEvent } from '@siteed/expo-audio-studio';

export interface TranscriptionResult {
  id: string;
  text: string;
  isFinal: boolean;
  confidence?: number;
  speakerTag?: number;
  timestamp: Date;
}

export interface UseTranscriptionAudioStudioResult {
  isConnected: boolean;
  isRecording: boolean;
  transcriptions: TranscriptionResult[];
  currentInterim: string;
  error: string | null;
  startTranscription: () => Promise<void>;
  stopTranscription: () => Promise<void>;
  clearTranscriptions: () => void;
}

/**
 * Utility function to convert Float32Array to PCM Int16
 * Web platform provides Float32Array, we need to convert to Int16
 */
function float32ToPCM16(float32: Float32Array): Int16Array {
  const pcm16 = new Int16Array(float32.length);
  for (let i = 0; i < float32.length; i++) {
    // Clamp to [-1, 1] range and convert to Int16
    const clamped = Math.max(-1, Math.min(1, float32[i]));
    pcm16[i] = Math.round(clamped * 0x7fff);
  }
  return pcm16;
}

/**
 * Utility function to convert base64 string to ArrayBuffer
 * Native platforms (iOS/Android) provide base64-encoded PCM data
 */
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Hook that uses @siteed/expo-audio-studio for real-time PCM16 audio streaming
 * This provides audio data via onAudioStream callback that can be sent to WebSocket
 */
export function useTranscriptionAudioStudio(): UseTranscriptionAudioStudioResult {
  const [isConnected, setIsConnected] = useState(false);
  const [transcriptions, setTranscriptions] = useState<TranscriptionResult[]>([]);
  const [currentInterim, setCurrentInterim] = useState('');
  const [error, setError] = useState<string | null>(null);
  const isInitializedRef = useRef(false);

  // Use the audio recorder hook from expo-audio-studio
  const {
    startRecording,
    stopRecording,
    isRecording,
  } = useAudioRecorder();

  // Initialize WebSocket connection
  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    console.log('🔌 Initializing transcription service...');

    transcriptionService.connect({
      onConnected: () => {
        console.log('✅ WebSocket connected');
        setIsConnected(true);
        setError(null);
      },
      onDisconnected: () => {
        console.log('🔌 WebSocket disconnected');
        setIsConnected(false);
      },
      onTranscription: (message) => {
        handleTranscription(message);
      },
      onError: (errorMsg) => {
        console.error('❌ Transcription service error:', errorMsg);
        setError(errorMsg);
      },
    });

    return () => {
      console.log('🧹 Cleaning up transcription service...');
      transcriptionService.disconnect();
    };
  }, []);

  const handleTranscription = useCallback((message: {
    transcript?: string;
    is_final?: boolean;
    confidence?: number;
    speaker_tag?: number;
  }) => {
    if (!message.transcript) {
      return;
    }

    console.log('📝 Transcription:', message.transcript, 'is_final:', message.is_final);

    if (message.is_final) {
      // Final transcription - add to list
      const newTranscription: TranscriptionResult = {
        id: Date.now().toString() + Math.random(),
        text: message.transcript,
        isFinal: true,
        confidence: message.confidence,
        speakerTag: message.speaker_tag,
        timestamp: new Date(),
      };

      setTranscriptions(prev => [...prev, newTranscription]);
      setCurrentInterim('');
    } else {
      // Interim transcription - update current
      setCurrentInterim(message.transcript);
    }
  }, []);

  const requestMicrophonePermission = useCallback(async (): Promise<boolean> => {
    try {
      // On Android, explicitly request permission
      if (Platform.OS === 'android') {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'This app needs access to your microphone for live transcription.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );

        if (result !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            'Microphone Permission Required',
            'Please grant microphone permission to use live transcription.',
            [{ text: 'OK' }]
          );
          return false;
        }
      }

      // iOS permissions are handled by the library automatically
      return true;
    } catch (err) {
      console.error('❌ Error requesting permission:', err);
      setError('Failed to request microphone permission');
      return false;
    }
  }, []);

  const startTranscription = useCallback(async () => {
    try {
      // Check WebSocket connection first
      if (!isConnected) {
        setError('Not connected to transcription service. Please wait...');
        return;
      }

      // Request microphone permission
      const hasPermission = await requestMicrophonePermission();
      if (!hasPermission) {
        return;
      }

      // Handle audio stream data - this is called continuously during recording
      const handleAudioStream = async (event: AudioDataEvent) => {
        try {
          let audioBuffer: ArrayBuffer;

          if (Platform.OS === 'web') {
            // Web provides Float32Array - convert to PCM Int16
            if (event.data instanceof Float32Array) {
              const pcm16 = float32ToPCM16(event.data);
              audioBuffer = pcm16.buffer;
            } else {
              console.warn('⚠️ Unexpected data type on web:', typeof event.data);
              return;
            }
          } else {
            // Native platforms (iOS/Android) provide base64-encoded PCM data
            if (typeof event.data === 'string') {
              // The base64 data is already PCM Int16, just decode it
              audioBuffer = base64ToArrayBuffer(event.data);
            } else {
              console.warn('⚠️ Unexpected data type on native:', typeof event.data);
              return;
            }
          }

          // Send PCM16 audio directly to WebSocket
          if (transcriptionService.isConnected()) {
            transcriptionService.sendAudio(audioBuffer);
          }
        } catch (err) {
          console.error('❌ Error processing audio stream:', err);
        }
      };

      // Start recording with streaming configuration
      await startRecording({
        sampleRate: 16000, // Server expects 16kHz
        channels: 1, // Mono
        encoding: 'pcm_16bit', // PCM Int16 format
        interval: 20, // Send buffer every 20ms for low latency
        onAudioStream: handleAudioStream, // Real-time audio data callback
        output: {
          primary: { enabled: false }, // Don't save to file, just stream
        },
      });

      setError(null);
      console.log('✅ Started audio streaming');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to start recording';
      console.error('❌ Error starting transcription:', err);
      setError(errorMsg);
      Alert.alert('Error', errorMsg);
    }
  }, [isConnected, requestMicrophonePermission, startRecording]);

  const stopTranscription = useCallback(async () => {
    try {
      await stopRecording();
      console.log('⏹️ Stopped audio streaming');
    } catch (err) {
      console.error('❌ Error stopping transcription:', err);
    }
  }, [stopRecording]);

  const clearTranscriptions = useCallback(() => {
    setTranscriptions([]);
    setCurrentInterim('');
  }, []);

  return {
    isConnected,
    isRecording,
    transcriptions,
    currentInterim,
    error,
    startTranscription,
    stopTranscription,
    clearTranscriptions,
  };
}

