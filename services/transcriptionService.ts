// services/transcriptionService.ts

// WebSocket is available globally in React Native
// No need to import it explicitly

/**
 * IMPORTANT: The transcription server expects raw PCM Int16 audio data,
 * but we're currently sending M4A encoded files due to Expo AV limitations.
 * This mismatch causes the server to close connections (code 1006).
 * 
 * Solutions:
 * 1. Use a library that can record PCM directly (e.g., react-native-audio-recorder-player)
 * 2. Convert M4A to PCM on client side (requires audio decoding library)
 * 3. Update server to accept M4A format
 * 4. Use a different transcription service that accepts M4A
 */

export interface TranscriptionMessage {
  type: 'transcription' | 'error';
  transcript?: string;
  is_final?: boolean;
  confidence?: number;
  speaker_tag?: number;
  message?: string;
}

export interface TranscriptionCallbacks {
  onTranscription: (message: TranscriptionMessage) => void;
  onConnected: () => void;
  onDisconnected: () => void;
  onError: (error: string) => void;
}

class TranscriptionService {
  private ws: WebSocket | null = null;
  private callbacks: TranscriptionCallbacks | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private isIntentionalDisconnect = false;
  private firstChunkLogged = false;

  connect(callbacks: TranscriptionCallbacks): void {
    this.callbacks = callbacks;
    this.isIntentionalDisconnect = false;
    this.connectWebSocket();
  }

  private connectWebSocket(): void {
    try {
      // Check if WebSocket is available
      if (typeof WebSocket === 'undefined') {
        const errorMsg = 'WebSocket is not available in this environment';
        console.error('❌', errorMsg);
        this.callbacks?.onError(errorMsg);
        return;
      }

      // Use WSS for secure connection
      const wsUrl = 'wss://meera-bot-v2.onrender.com/api/v1/transcription/ws/transcribe';
      
      console.log('🔌 Connecting to WebSocket:', wsUrl);
      
      // Create WebSocket connection
      this.ws = new WebSocket(wsUrl);

      // Set up event handlers
      this.ws.onopen = () => {
        console.log('✅ WebSocket connected successfully');
        this.reconnectAttempts = 0;
        this.firstChunkLogged = false; // Reset for new connection
        this.callbacks?.onConnected();
      };

      this.ws.onmessage = (event: MessageEvent) => {
        try {
          console.log('📥 Received WebSocket message, type:', typeof event.data);
          
          // Handle both string and binary messages
          let data: string;
          if (typeof event.data === 'string') {
            data = event.data;
            console.log('📝 String message length:', data.length);
          } else if (event.data instanceof ArrayBuffer) {
            // Convert ArrayBuffer to string if needed
            const decoder = new TextDecoder();
            data = decoder.decode(event.data);
            console.log('📝 ArrayBuffer message decoded, length:', data.length);
          } else if (event.data instanceof Blob) {
            // Handle Blob if needed
            console.log('📝 Blob message, size:', event.data.size);
            const reader = new FileReader();
            reader.onload = () => {
              if (typeof reader.result === 'string') {
                this.handleMessage(reader.result);
              }
            };
            reader.onerror = (err) => {
              console.error('❌ Error reading Blob:', err);
            };
            reader.readAsText(event.data);
            return;
          } else {
            console.warn('⚠️ Unknown message type:', typeof event.data, event.data);
            return;
          }

          this.handleMessage(data);
        } catch (error) {
          console.error('❌ Error processing message:', error);
          this.callbacks?.onError('Failed to process transcription message');
        }
      };

      this.ws.onerror = (error: Event) => {
        // Only log detailed error in development, reduce noise
        const readyState = this.ws?.readyState;
        if (readyState === WebSocket.CONNECTING) {
          console.error('❌ WebSocket connection failed');
          this.callbacks?.onError('Failed to connect to transcription service');
        } else {
          // Connection error after being open - will be handled by onclose
          console.warn('⚠️ WebSocket error (state:', readyState, ')');
          // Don't call onError here - let onclose handle it with proper error code
        }
      };

      this.ws.onclose = (event: CloseEvent) => {
        const closeInfo = {
          code: event.code,
          reason: event.reason || 'No reason provided',
          wasClean: event.wasClean,
        };
        
        // Code 1006 = abnormal closure (server closed unexpectedly)
        // Code 1000 = normal closure
        if (event.code === 1006) {
          console.warn('⚠️ WebSocket closed abnormally (1006):', closeInfo.reason);
        } else {
          console.log('🔌 WebSocket closed:', closeInfo);
        }
        
        this.callbacks?.onDisconnected();

        // Only attempt to reconnect if not intentional disconnect and not a normal closure
        if (!this.isIntentionalDisconnect && event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          const delay = 2000 * this.reconnectAttempts; // Exponential backoff
          console.log(`🔄 Reconnecting in ${delay}ms... Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
          
          this.reconnectTimeout = setTimeout(() => {
            this.connectWebSocket();
          }, delay);
        } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          const errorMsg = `Failed to reconnect after ${this.maxReconnectAttempts} attempts`;
          console.error('❌', errorMsg);
          this.callbacks?.onError(errorMsg);
        } else if (event.code === 1000) {
          console.log('✅ WebSocket closed normally');
        }
      };
    } catch (error) {
      console.error('❌ Error creating WebSocket:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create WebSocket connection';
      this.callbacks?.onError(errorMessage);
    }
  }

  private handleMessage(data: string): void {
    try {
      const message: TranscriptionMessage = JSON.parse(data);
      console.log('📨 Received transcription message:', {
        type: message.type,
        transcript: message.transcript?.substring(0, 50) + (message.transcript && message.transcript.length > 50 ? '...' : ''),
        is_final: message.is_final,
        confidence: message.confidence,
      });
      
      if (message.type === 'transcription') {
        this.callbacks?.onTranscription(message);
      } else if (message.type === 'error') {
        console.error('❌ Server error:', message.message);
        this.callbacks?.onError(message.message || 'Unknown server error');
      } else {
        console.warn('⚠️ Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('❌ Error parsing message:', error);
      console.error('Raw message data (first 200 chars):', data.substring(0, 200));
      this.callbacks?.onError('Failed to parse transcription message');
    }
  }

  sendAudio(audioBuffer: ArrayBuffer): void {
    if (!this.ws) {
      console.warn('⚠️ WebSocket not initialized, cannot send audio');
      return;
    }

    if (this.ws.readyState !== WebSocket.OPEN) {
      // Silently skip if not open (reduces log spam during reconnection)
      return;
    }

    try {
      // Send binary data directly as raw PCM Int16 audio
      // With expo-audio-studio, we receive base64-encoded PCM16 (native) or Float32Array (web)
      // and convert to ArrayBuffer - exactly what the server expects!
      
      // Log first chunk in detail to debug format issues
      if (!this.firstChunkLogged) {
        this.firstChunkLogged = true;
        const int16View = new Int16Array(audioBuffer);
        console.log('📤 Sending FIRST audio chunk (detailed):', {
          size: audioBuffer.byteLength,
          sampleCount: int16View.length,
          firstSamples: Array.from(int16View.slice(0, 5)),
          readyState: this.ws.readyState,
        });
      }
      
      // Reduce logging frequency for subsequent chunks
      if (Math.random() < 0.01) { // Log ~1% of chunks
        console.log('📤 Sending audio chunk:', {
          size: audioBuffer.byteLength,
        });
      }
      
      // React Native WebSocket requires Uint8Array, not ArrayBuffer
      // Convert ArrayBuffer to Uint8Array for compatibility
      const uint8Array = new Uint8Array(audioBuffer);
      this.ws.send(uint8Array);
    } catch (error) {
      console.error('❌ Error sending audio:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to send audio data';
      this.callbacks?.onError(errorMessage);
    }
  }

  disconnect(): void {
    this.isIntentionalDisconnect = true;
    
    // Clear any pending reconnection attempts
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    // Close WebSocket connection if it exists
    if (this.ws) {
      try {
        // Check if connection is open or connecting before closing
        if (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING) {
          this.ws.close(1000, 'Client disconnecting'); // Normal closure
        }
      } catch (error) {
        console.warn('⚠️ Error closing WebSocket:', error);
      }
      this.ws = null;
    }

    this.callbacks = null;
    this.reconnectAttempts = 0;
    console.log('🔌 Disconnected from WebSocket');
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  getReadyState(): number | null {
    return this.ws?.readyState ?? null;
  }
}

export const transcriptionService = new TranscriptionService();