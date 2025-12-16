// utils/pcmAudioRecorder.ts

import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';

// Lazy import to prevent crashes if native module isn't available
let AudioRecorderPlayer: any = null;
let audioRecorderPlayer: any = null;

// Initialize the native module lazily
function getAudioRecorderPlayer() {
  if (!AudioRecorderPlayer) {
    try {
      AudioRecorderPlayer = require('react-native-audio-recorder-player').default;
      if (!audioRecorderPlayer) {
        audioRecorderPlayer = new AudioRecorderPlayer();
      }
    } catch (error) {
      console.error('❌ Failed to load react-native-audio-recorder-player:', error);
      throw new Error('Audio recorder module not available. Please ensure the native module is properly linked.');
    }
  }
  return audioRecorderPlayer;
}

/**
 * PCM Audio Recorder for real-time transcription
 * Records audio in PCM format (Int16) that the server expects
 */
export class PCMAudioRecorder {
  private recordingPath: string | null = null;
  private isRecording: boolean = false;

  /**
   * Start recording PCM audio
   * @returns Path to the recording file
   */
  async startRecording(): Promise<string> {
    if (this.isRecording) {
      throw new Error('Recording already in progress');
    }

    try {
      // Generate a unique file path
      // Note: Library may save as .wav or .m4a depending on platform
      // We'll handle format conversion in readPCMFile
      const timestamp = Date.now();
      const filename = `recording-${timestamp}.wav`;
      
      // Use cache directory for temporary files
      const cacheDir = FileSystem.cacheDirectory || '';
      this.recordingPath = `${cacheDir}${filename}`;

      console.log('🎤 Starting PCM recording:', this.recordingPath);

      // Configure audio recording settings
      // Android: Use MediaRecorder with PCM_16BIT encoder (value 1)
      // iOS: Use Linear PCM format
      const audioSet = {
        AudioEncoderAndroid: 1, // MediaRecorder.AudioEncoder.PCM_16BIT
        AudioSourceAndroid: 1, // MediaRecorder.AudioSource.MIC
        AVEncoderAudioQualityKeyIOS: 'high',
        AVNumberOfChannelsKeyIOS: 1, // Mono
        AVFormatIDKeyIOS: 'lpcm', // Linear PCM
        AVSampleRateKeyIOS: 16000, // 16kHz (matches server expectation)
        AVLinearPCMBitDepthKeyIOS: 16, // 16-bit
        AVLinearPCMIsBigEndianKeyIOS: false, // Little-endian
        AVLinearPCMIsFloatKeyIOS: false, // Integer PCM
      };

      const recorder = getAudioRecorderPlayer();
      const uri = await recorder.startRecorder(this.recordingPath, audioSet);
      this.isRecording = true;
      
      console.log('✅ PCM recording started:', uri);
      return uri;
    } catch (error) {
      console.error('❌ Error starting PCM recording:', error);
      this.recordingPath = null;
      throw error;
    }
  }

  /**
   * Stop recording and return the file path
   */
  async stopRecording(): Promise<string> {
    if (!this.isRecording || !this.recordingPath) {
      throw new Error('No recording in progress');
    }

    try {
      const recorder = getAudioRecorderPlayer();
      const result = await recorder.stopRecorder();
      this.isRecording = false;
      
      console.log('✅ PCM recording stopped:', result);
      return this.recordingPath;
    } catch (error) {
      console.error('❌ Error stopping PCM recording:', error);
      throw error;
    }
  }

  /**
   * Read audio file and extract raw PCM data as Int16 ArrayBuffer
   * Handles both raw PCM and WAV files (WAV has a 44-byte header)
   */
  async readPCMFile(filePath: string): Promise<ArrayBuffer> {
    try {
      console.log('🔄 Reading audio file:', filePath);
      
      // Read file as base64
      const base64Data = await FileSystem.readAsStringAsync(filePath, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Convert base64 to ArrayBuffer
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Check if file is WAV format (starts with "RIFF")
      const isWAV = bytes.length >= 4 && 
                   String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]) === 'RIFF';

      if (isWAV) {
        console.log('📦 Detected WAV format, extracting PCM data...');
        // WAV file structure:
        // - Bytes 0-3: "RIFF"
        // - Bytes 4-7: File size
        // - Bytes 8-11: "WAVE"
        // - Bytes 12-15: "fmt "
        // - Bytes 16-19: Format chunk size
        // - Bytes 20-43: Format data (sample rate, channels, etc.)
        // - Bytes 44+: Raw PCM data
        
        // Find "data" chunk (contains PCM samples)
        let dataStart = 44; // Default WAV header size
        for (let i = 12; i < bytes.length - 8; i++) {
          if (String.fromCharCode(bytes[i], bytes[i+1], bytes[i+2], bytes[i+3]) === 'data') {
            dataStart = i + 8; // Skip "data" (4 bytes) + chunk size (4 bytes)
            break;
          }
        }
        
        // Extract PCM data (skip WAV header)
        const pcmData = bytes.slice(dataStart);
        console.log('✅ Extracted PCM from WAV:', pcmData.length, 'bytes (skipped', dataStart, 'byte header)');
        return pcmData.buffer;
      } else {
        // Assume raw PCM file
        console.log('✅ Raw PCM file read:', bytes.length, 'bytes');
        return bytes.buffer;
      }
    } catch (error) {
      console.error('❌ Error reading PCM file:', error);
      throw error;
    }
  }

  /**
   * Delete the recording file
   */
  async deleteRecording(filePath: string): Promise<void> {
    try {
      await FileSystem.deleteAsync(filePath, { idempotent: true });
      console.log('🗑️ Deleted PCM file:', filePath);
    } catch (error) {
      console.warn('⚠️ Error deleting PCM file:', error);
    }
  }

  /**
   * Check if currently recording
   */
  getRecordingState(): boolean {
    return this.isRecording;
  }

  /**
   * Get current recording path
   */
  getRecordingPath(): string | null {
    return this.recordingPath;
  }
}

export const pcmAudioRecorder = new PCMAudioRecorder();

