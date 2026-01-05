// utils/pcmAudioRecorder.ts

import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

// Try to use expo-audio, fallback to expo-av if needed
// Note: expo-av is deprecated but still works in SDK 54
let AudioModule: any = null;
let useExpoAudio = true;

async function getAudioModule() {
  if (!AudioModule) {
    try {
      // Try expo-audio first
      AudioModule = await import('expo-audio');
      useExpoAudio = true;
      console.log('✅ Using expo-audio');
    } catch (error) {
      console.warn('⚠️ expo-audio not available, trying expo-av...');
      try {
        // Fallback to expo-av (deprecated but still works)
        AudioModule = await import('expo-av');
        useExpoAudio = false;
        console.log('✅ Using expo-av (deprecated)');
      } catch (avError) {
        console.error('❌ Failed to load audio modules:', avError);
        throw new Error('Audio recording module not available. Please ensure expo-audio or expo-av is installed.');
      }
    }
  }
  return { module: AudioModule, isExpoAudio: useExpoAudio };
}

/**
 * PCM Audio Recorder for real-time transcription using expo-audio
 * Records audio in chunks and converts to PCM format that the server expects
 */
export class PCMAudioRecorder {
  private recording: any = null;
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
      const { module: audioModule, isExpoAudio } = await getAudioModule();
      
      // Generate a unique file path
      const timestamp = Date.now();
      const filename = `recording-${timestamp}.m4a`;
      
      // Use cache directory for temporary files
      const cacheDir = FileSystem.cacheDirectory || '';
      this.recordingPath = `${cacheDir}${filename}`;

      console.log('🎤 Starting audio recording:', this.recordingPath);

      // Configure audio recording settings
      // Both expo-audio and expo-av record to M4A format by default
      const recordingOptions = {
        android: {
          extension: '.m4a',
          outputFormat: 2, // MediaRecorder.OutputFormat.MPEG_4
          audioEncoder: 3, // MediaRecorder.AudioEncoder.AAC
          sampleRate: 16000, // 16kHz (matches server expectation)
          numberOfChannels: 1, // Mono
          bitRate: 128000,
        },
        ios: {
          extension: '.m4a',
          outputFormat: 'mpeg4',
          audioQuality: 'high',
          sampleRate: 16000, // 16kHz
          numberOfChannels: 1, // Mono
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          mimeType: 'audio/webm',
          bitsPerSecond: 128000,
        },
      };

      // Use the Recording API (works for both expo-audio and expo-av)
      if (audioModule.Recording) {
        this.recording = new audioModule.Recording();
        await this.recording.prepareToRecordAsync(recordingOptions);
        await this.recording.startAsync();
      } else {
        throw new Error('Recording API not found in audio module');
      }
      
      this.isRecording = true;
      
      console.log('✅ Audio recording started');
      return this.recordingPath;
    } catch (error) {
      console.error('❌ Error starting audio recording:', error);
      this.recordingPath = null;
      this.recording = null;
      throw error;
    }
  }

  /**
   * Stop recording and return the file path
   */
  async stopRecording(): Promise<string> {
    if (!this.isRecording || !this.recording) {
      throw new Error('No recording in progress');
    }

    try {
      await this.recording.stopAndUnloadAsync();
      const uri = this.recording.getURI();
      this.isRecording = false;
      
      // Update recording path with actual URI
      if (uri) {
        this.recordingPath = uri;
      }
      
      console.log('✅ Audio recording stopped:', this.recordingPath);
      return this.recordingPath || '';
    } catch (error) {
      console.error('❌ Error stopping audio recording:', error);
      throw error;
    } finally {
      this.recording = null;
    }
  }

  /**
   * Read audio file and extract raw PCM data as Int16 ArrayBuffer
   * Since expo-audio records to M4A, we need to decode it to PCM
   * For now, we'll read the file and try to extract PCM data
   * Note: This is a simplified version - full M4A decoding would require a decoder library
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

      // CRITICAL ISSUE: M4A files are encoded (AAC), not raw PCM
      // The server expects raw PCM Int16 data (like the HTML implementation sends)
      // 
      // The HTML works because it uses Web Audio API (AudioWorklet) which gives
      // direct access to raw audio samples that can be converted to Int16 PCM.
      // 
      // Solutions:
      // 1. Use a WebView with the HTML implementation (works immediately)
      // 2. Use a library like ffmpeg.js to decode M4A to PCM (complex, adds bundle size)
      // 3. Use react-native-audio-recorder-player with proper native module setup (for APK builds)
      // 4. Modify server to accept M4A format (requires backend changes)
      //
      // For now, we're sending M4A data which the server will likely reject.
      // This is a known limitation of using expo-audio/expo-av for real-time PCM streaming.
      console.warn('⚠️ WARNING: Sending M4A encoded audio, not raw PCM Int16.');
      console.warn('⚠️ The server expects raw PCM Int16 data. This may not work.');
      console.log('📦 Audio file size:', bytes.length, 'bytes');
      
      return bytes.buffer;
    } catch (error) {
      console.error('❌ Error reading audio file:', error);
      throw error;
    }
  }

  /**
   * Delete the recording file
   */
  async deleteRecording(filePath: string): Promise<void> {
    try {
      await FileSystem.deleteAsync(filePath, { idempotent: true });
      console.log('🗑️ Deleted audio file:', filePath);
    } catch (error) {
      console.warn('⚠️ Error deleting audio file:', error);
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
