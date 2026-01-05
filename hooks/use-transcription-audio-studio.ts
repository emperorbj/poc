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
  const firstChunkSentRef = useRef(false);

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
      // Check WebSocket connection first - wait a bit if not connected yet
      if (!isConnected) {
        console.log('⏳ Waiting for WebSocket connection...');
        // Wait up to 3 seconds for connection
        let waited = 0;
        while (!isConnected && waited < 3000) {
          await new Promise(resolve => setTimeout(resolve, 100));
          waited += 100;
        }
        
        if (!isConnected && !transcriptionService.isConnected()) {
          setError('Not connected to transcription service. Please wait and try again.');
          console.error('❌ WebSocket not connected after waiting');
          return;
        }
        console.log('✅ WebSocket connection ready');
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
              // Log first few chunks to verify format
              if (Math.random() < 0.01) { // Log ~1% of chunks
                console.log('🎤 Web audio chunk:', {
                  float32Length: event.data.length,
                  pcm16Length: pcm16.length,
                  bufferSize: audioBuffer.byteLength,
                  sampleRate: 16000,
                });
              }
            } else {
              console.warn('⚠️ Unexpected data type on web:', typeof event.data);
              return;
            }
          } else {
            // Native platforms (iOS/Android) provide base64-encoded PCM data
            if (typeof event.data === 'string') {
              // The base64 data should be raw PCM Int16 (no WAV headers when output.primary.enabled = false)
              // But we need to verify it's actually Int16 and in the correct byte order
              const uint8Buffer = base64ToArrayBuffer(event.data);
              
              // Verify the buffer size matches eventDataSize (should be raw PCM)
              audioBuffer = uint8Buffer;
              if (event.eventDataSize && audioBuffer.byteLength !== event.eventDataSize) {
                console.warn('⚠️ Buffer size mismatch:', {
                  bufferSize: audioBuffer.byteLength,
                  eventDataSize: event.eventDataSize,
                  difference: audioBuffer.byteLength - event.eventDataSize,
                });
                
                // If there's a mismatch, use only the expected size (might have padding)
                if (audioBuffer.byteLength > event.eventDataSize) {
                  audioBuffer = audioBuffer.slice(0, event.eventDataSize);
                }
              }
              
              // CRITICAL: Verify the data is actually Int16 PCM
              // The base64 data from expo-audio-studio should be raw PCM Int16 in little-endian format
              // We need to ensure it's sent as-is (already in correct format)
              
              // Log first chunk in detail to verify format
              if (!firstChunkSentRef.current) {
                const int16View = new Int16Array(audioBuffer);
                console.log('🎤 First native audio chunk (detailed):', {
                  base64Length: event.data.length,
                  bufferSize: audioBuffer.byteLength,
                  eventDataSize: event.eventDataSize,
                  sampleCount: int16View.length,
                  firstSample: int16View[0],
                  lastSample: int16View[int16View.length - 1],
                  minSample: Math.min(...Array.from(int16View.slice(0, 100))),
                  maxSample: Math.max(...Array.from(int16View.slice(0, 100))),
                  sampleRate: 16000,
                  isEven: audioBuffer.byteLength % 2 === 0,
                });
                
                // Verify sample range is reasonable for audio (-32768 to 32767)
                const sampleRange = { min: Math.min(...Array.from(int16View.slice(0, 100))), max: Math.max(...Array.from(int16View.slice(0, 100))) };
                if (sampleRange.min < -32768 || sampleRange.max > 32767) {
                  console.warn('⚠️ Sample values out of Int16 range:', sampleRange);
                }
              }
              
              // Verify it's raw PCM (should be divisible by 2 for Int16)
              if (audioBuffer.byteLength % 2 !== 0) {
                console.warn('⚠️ Audio buffer size is not even - might include headers:', audioBuffer.byteLength);
                // Trim to even size
                audioBuffer = audioBuffer.slice(0, audioBuffer.byteLength - 1);
              }
            } else {
              console.warn('⚠️ Unexpected data type on native:', typeof event.data);
              return;
            }
          }

          // Send PCM16 audio directly to WebSocket
          // Safety check: ensure audioBuffer is defined
          if (!audioBuffer) {
            console.warn('⚠️ Audio buffer is undefined, skipping chunk');
            return;
          }

          const wsConnected = transcriptionService.isConnected();
          const wsReadyState = transcriptionService.getReadyState();
          
          if (wsConnected) {
            // Wait a bit before sending first chunk to ensure WebSocket is fully ready
            if (!firstChunkSentRef.current) {
              firstChunkSentRef.current = true;
              console.log('📤 Sending first audio chunk (delayed 100ms for WebSocket stability)');
              // Small delay to ensure WebSocket handshake is complete
              // Capture audioBuffer in closure to ensure it's available
              const bufferToSend = audioBuffer;
              setTimeout(() => {
                transcriptionService.sendAudio(bufferToSend);
              }, 100);
            } else {
              transcriptionService.sendAudio(audioBuffer);
            }
          } else {
            // Log occasionally if not connected (helps debug)
            if (Math.random() < 0.01) {
              console.warn('⚠️ WebSocket not connected, skipping audio chunk. ReadyState:', wsReadyState, 'isConnected state:', isConnected);
            }
          }
        } catch (err) {
          console.error('❌ Error processing audio stream:', err);
        }
      };

      // Verify WebSocket is connected before starting
      if (!transcriptionService.isConnected()) {
        const errorMsg = 'WebSocket is not connected. Please wait for connection before starting recording.';
        console.error('❌', errorMsg, 'ReadyState:', transcriptionService.getReadyState());
        setError(errorMsg);
        Alert.alert('Connection Error', errorMsg);
        return;
      }

      // Reset first chunk flag
      firstChunkSentRef.current = false;

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
      console.log('✅ Started audio streaming, WebSocket ready:', transcriptionService.isConnected());
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

