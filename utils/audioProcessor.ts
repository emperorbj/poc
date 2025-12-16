// utils/audioProcessor.ts

// Use legacy API for compatibility with Expo SDK 54
import * as FileSystem from 'expo-file-system/legacy';
import { Buffer } from 'buffer';

/**
 * Convert recorded audio file to Int16 PCM format for WebSocket transmission
 * This handles the conversion from M4A/AAC to raw PCM audio
 */
export class AudioProcessor {
  /**
   * Read audio file and convert to ArrayBuffer
   * Note: Since we're recording in M4A, we need to send the entire file
   * The backend should handle the conversion from M4A to PCM
   */
  static async convertToArrayBuffer(audioUri: string): Promise<ArrayBuffer> {
    try {
      console.log('🔄 Reading audio file:', audioUri);
      
      // Read the file as base64
      const base64Audio = await FileSystem.readAsStringAsync(audioUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      console.log('📦 Audio file size (base64):', base64Audio.length);

      // Convert base64 to ArrayBuffer
      const buffer = Buffer.from(base64Audio, 'base64');
      const arrayBuffer = this.bufferToArrayBuffer(buffer);

      console.log('✅ Converted to ArrayBuffer:', arrayBuffer.byteLength, 'bytes');
      return arrayBuffer;
    } catch (error) {
      console.error('❌ Error converting audio:', error);
      throw new Error('Failed to convert audio file');
    }
  }

  /**
   * Convert Node Buffer to ArrayBuffer
   */
  private static bufferToArrayBuffer(buffer: Buffer): ArrayBuffer {
    const arrayBuffer = new ArrayBuffer(buffer.length);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < buffer.length; i++) {
      view[i] = buffer[i];
    }
    return arrayBuffer;
  }

  /**
   * Validate audio file exists and has content
   */
  static async validateAudioFile(audioUri: string): Promise<boolean> {
    try {
      const fileInfo = await FileSystem.getInfoAsync(audioUri);
      
      if (!fileInfo.exists) {
        console.error('❌ Audio file does not exist:', audioUri);
        return false;
      }

      if (fileInfo.size === 0) {
        console.error('❌ Audio file is empty:', audioUri);
        return false;
      }

      console.log('✅ Audio file valid:', fileInfo.size, 'bytes');
      return true;
    } catch (error) {
      console.error('❌ Error validating audio file:', error);
      return false;
    }
  }

  /**
   * Clean up temporary audio file
   */
  static async deleteAudioFile(audioUri: string): Promise<void> {
    try {
      await FileSystem.deleteAsync(audioUri, { idempotent: true });
      console.log('🗑️ Deleted audio file:', audioUri);
    } catch (error) {
      console.error('⚠️ Error deleting audio file:', error);
      // Don't throw - this is a cleanup operation
    }
  }
}

/**
 * Audio recording configuration for optimal quality
 */
export const AUDIO_RECORDING_OPTIONS = {
  android: {
    extension: '.m4a',
    outputFormat: 2, // MPEG_4
    audioEncoder: 3, // AAC
    sampleRate: 16000,
    numberOfChannels: 1,
    bitRate: 128000,
  },
  ios: {
    extension: '.m4a',
    outputFormat: 'kAudioFormatMPEG4AAC',
    audioQuality: 127, // MAX
    sampleRate: 16000,
    numberOfChannels: 1,
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