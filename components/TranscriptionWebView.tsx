// components/TranscriptionWebView.tsx

import React, { useRef, useEffect, useCallback } from 'react';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { Platform } from 'react-native';

// Import HTML as string - we'll embed it directly
const TRANSCRIPTION_HTML = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Transcription WebView</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: transparent;
        }
    </style>
</head>
<body>
    <script>
        // Polyfill for navigator.mediaDevices if not available
        if (!navigator.mediaDevices) {
            navigator.mediaDevices = {};
        }
        if (!navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia = function(constraints) {
                const getUserMedia = navigator.getUserMedia || 
                                    navigator.webkitGetUserMedia || 
                                    navigator.mozGetUserMedia || 
                                    navigator.msGetUserMedia;
                
                if (!getUserMedia) {
                    return Promise.reject(new Error('getUserMedia is not supported'));
                }
                
                return new Promise(function(resolve, reject) {
                    getUserMedia.call(navigator, constraints, resolve, reject);
                });
            };
        }
        
        // This HTML runs in a WebView and uses Web Audio API to capture PCM audio
        // It sends transcriptions back to React Native via postMessage
        
        let ws = null;
        let audioContext = null;
        let processorNode = null;
        let streamSource = null;
        let mediaStream = null;
        let isRecording = false;

        // Function to send messages to React Native
        function sendToReactNative(type, data) {
            if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: type,
                    data: data
                }));
            }
        }

        // Connect to WebSocket
        function connectWebSocket() {
            if (ws && ws.readyState === WebSocket.OPEN) {
                return;
            }

            const url = 'wss://meera-bot-v2.onrender.com/api/v1/transcription/ws/transcribe';
            ws = new WebSocket(url);

            ws.onopen = () => {
                console.log('WebSocket connected');
                sendToReactNative('connected', {});
            };

            ws.onclose = () => {
                console.log('WebSocket disconnected');
                sendToReactNative('disconnected', {});
            };

            ws.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    console.log('📥 WebView received message:', message.type);
                    
                    if (message.type === 'transcription') {
                        console.log('📝 WebView transcription:', message.transcript, 'is_final:', message.is_final);
                        // Send transcription to React Native
                        sendToReactNative('transcription', {
                            transcript: message.transcript,
                            is_final: message.is_final,
                            confidence: message.confidence,
                            speaker_tag: message.speaker_tag
                        });
                    } else if (message.type === 'error') {
                        console.error('❌ WebView server error:', message.message);
                        sendToReactNative('error', {
                            message: message.message
                        });
                    }
                } catch (err) {
                    console.error('Error parsing message:', err);
                }
            };

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                sendToReactNative('error', {
                    message: 'WebSocket connection error'
                });
            };
        }

        // Start recording
        async function startRecording() {
            if (isRecording) {
                console.log('⚠️ Already recording');
                return;
            }

            try {
                // Check if getUserMedia is available
                let getUserMedia;
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    getUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
                    console.log('✅ Using navigator.mediaDevices.getUserMedia');
                } else if (navigator.getUserMedia) {
                    // Fallback for older browsers
                    getUserMedia = (constraints) => {
                        return new Promise((resolve, reject) => {
                            navigator.getUserMedia(constraints, resolve, reject);
                        });
                    };
                    console.log('✅ Using navigator.getUserMedia (fallback)');
                } else {
                    console.error('❌ getUserMedia not available. navigator.mediaDevices:', navigator.mediaDevices);
                    throw new Error('getUserMedia is not supported in this WebView. Please ensure microphone permissions are granted.');
                }

                console.log('🎤 Requesting microphone access...');
                
                // Request microphone access
                const stream = await getUserMedia({ 
                    audio: {
                        channelCount: 1,
                        sampleRate: 16000,
                        echoCancellation: true,
                        noiseSuppression: true
                    } 
                });
                
                console.log('✅ Microphone access granted, stream:', stream);

                mediaStream = stream;
                audioContext = new AudioContext({ sampleRate: 16000 });
                streamSource = audioContext.createMediaStreamSource(stream);

                // Create audio processor using AudioWorklet
                const audioWorkletCode = 'class AudioProcessor extends AudioWorkletProcessor {' +
                    'process(inputs, outputs, parameters) {' +
                    'const input = inputs[0];' +
                    'if (input.length > 0) {' +
                    'const channelData = input[0];' +
                    'const int16Data = new Int16Array(channelData.length);' +
                    'for (let i = 0; i < channelData.length; i++) {' +
                    'int16Data[i] = Math.max(-32768, Math.min(32767, channelData[i] * 32768));' +
                    '}' +
                    'this.port.postMessage(int16Data.buffer);' +
                    '}' +
                    'return true;' +
                    '}' +
                    '}' +
                    'registerProcessor("audio-processor", AudioProcessor);';
                
                await audioContext.audioWorklet.addModule(
                    URL.createObjectURL(new Blob([audioWorkletCode], { type: 'application/javascript' }))
                );

                processorNode = new AudioWorkletNode(audioContext, 'audio-processor');

                processorNode.port.onmessage = (event) => {
                    if (ws && ws.readyState === WebSocket.OPEN) {
                        ws.send(event.data);
                        // Log occasionally to verify audio is being sent
                        if (Math.random() < 0.01) { // Log ~1% of the time
                            console.log('🎤 Sending audio chunk:', event.data.byteLength, 'bytes');
                        }
                    } else {
                        console.warn('⚠️ WebSocket not open, cannot send audio');
                    }
                };

                streamSource.connect(processorNode);
                processorNode.connect(audioContext.destination);

                isRecording = true;
                console.log('✅ Recording started in WebView, microphone active');
                sendToReactNative('recordingStarted', {});
            } catch (err) {
                console.error('❌ Error starting recording:', err);
                isRecording = false;
                sendToReactNative('error', {
                    message: 'Could not access microphone: ' + err.message
                });
            }
        }

        // Stop recording
        function stopRecording() {
            if (!isRecording) {
                return;
            }

            try {
                if (processorNode) {
                    processorNode.disconnect();
                }
                if (streamSource) {
                    streamSource.disconnect();
                }
                if (audioContext) {
                    audioContext.close();
                }
                if (mediaStream) {
                    mediaStream.getTracks().forEach(track => track.stop());
                }

                processorNode = null;
                streamSource = null;
                audioContext = null;
                mediaStream = null;
                isRecording = false;

                sendToReactNative('recordingStopped', {});
                console.log('Recording stopped');
            } catch (err) {
                console.error('Error stopping recording:', err);
            }
        }

        // Disconnect WebSocket
        function disconnectWebSocket() {
            if (ws) {
                ws.close();
                ws = null;
            }
        }

        // Diagnostic: Log what's available
        console.log('🔍 Navigator check:', {
            hasNavigator: typeof navigator !== 'undefined',
            hasMediaDevices: typeof navigator.mediaDevices !== 'undefined',
            hasGetUserMedia: typeof navigator.getUserMedia !== 'undefined',
            hasWebkitGetUserMedia: typeof navigator.webkitGetUserMedia !== 'undefined',
            userAgent: navigator.userAgent
        });

        // Expose functions globally so injectJavaScript can call them
        window.connectWebSocket = connectWebSocket;
        window.disconnectWebSocket = disconnectWebSocket;
        window.startRecording = startRecording;
        window.stopRecording = stopRecording;

        // Initialize - connect WebSocket automatically
        connectWebSocket();
    </script>
</body>
</html>`;

export interface TranscriptionWebViewMessage {
  type: 'connected' | 'disconnected' | 'transcription' | 'error' | 'recordingStarted' | 'recordingStopped';
  data: any;
}

export interface TranscriptionWebViewCallbacks {
  onConnected?: () => void;
  onDisconnected?: () => void;
  onTranscription?: (data: {
    transcript: string;
    is_final: boolean;
    confidence?: number;
    speaker_tag?: number;
  }) => void;
  onError?: (error: string) => void;
  onRecordingStarted?: () => void;
  onRecordingStopped?: () => void;
}

interface TranscriptionWebViewProps {
  callbacks: TranscriptionWebViewCallbacks;
  autoConnect?: boolean;
}

export interface TranscriptionWebViewRef {
  connect: () => void;
  disconnect: () => void;
  startRecording: () => void;
  stopRecording: () => void;
}

export const TranscriptionWebView = React.forwardRef<TranscriptionWebViewRef, TranscriptionWebViewProps>(
  ({ callbacks, autoConnect = true }, ref) => {
    const webViewRef = useRef<WebView>(null);

    // Send command to WebView using injectJavaScript
    const sendCommand = useCallback((action: string) => {
      if (webViewRef.current) {
        const script = `
          (function() {
            try {
              console.log('📨 WebView received command: ${action}');
              
              if (typeof window.connectWebSocket === 'function' && '${action}' === 'connect') {
                window.connectWebSocket();
              } else if (typeof window.disconnectWebSocket === 'function' && '${action}' === 'disconnect') {
                window.disconnectWebSocket();
              } else if (typeof window.startRecording === 'function' && '${action}' === 'startRecording') {
                console.log('🎙️ WebView: startRecording command received');
                window.startRecording();
              } else if (typeof window.stopRecording === 'function' && '${action}' === 'stopRecording') {
                console.log('⏹️ WebView: stopRecording command received');
                window.stopRecording();
              } else {
                console.warn('⚠️ Function not available for action:', '${action}');
              }
            } catch (err) {
              console.error('Error handling command:', err);
            }
          })();
          true; // Required for injectJavaScript
        `;
        console.log('📤 Sending command to WebView:', action);
        webViewRef.current.injectJavaScript(script);
      } else {
        console.warn('⚠️ WebView ref not available for command:', action);
      }
    }, []);

    // Handle messages from WebView
    const handleMessage = useCallback((event: WebViewMessageEvent) => {
      try {
        const message: TranscriptionWebViewMessage = JSON.parse(event.nativeEvent.data);
        
      switch (message.type) {
        case 'connected':
          console.log('📨 React Native: received connected event');
          callbacks.onConnected?.();
          break;
        case 'disconnected':
          console.log('📨 React Native: received disconnected event');
          callbacks.onDisconnected?.();
          break;
        case 'transcription':
          console.log('📨 React Native: received transcription event');
          callbacks.onTranscription?.(message.data);
          break;
        case 'error':
          console.log('📨 React Native: received error event');
          callbacks.onError?.(message.data?.message || 'Unknown error');
          break;
        case 'recordingStarted':
          console.log('📨 React Native: received recordingStarted event');
          callbacks.onRecordingStarted?.();
          break;
        case 'recordingStopped':
          console.log('📨 React Native: received recordingStopped event');
          callbacks.onRecordingStopped?.();
          break;
        default:
          console.warn('⚠️ React Native: unknown message type:', message.type);
      }
      } catch (error) {
        console.error('Error parsing WebView message:', error);
      }
    }, [callbacks]);

    // Auto-connect on mount
    useEffect(() => {
      if (autoConnect) {
        // Small delay to ensure WebView is ready
        const timer = setTimeout(() => {
          sendCommand('connect');
        }, 500);
        return () => clearTimeout(timer);
      }
    }, [autoConnect, sendCommand]);

    // Expose methods via ref (optional, for external control)
    React.useImperativeHandle(ref, () => ({
      connect: () => sendCommand('connect'),
      disconnect: () => sendCommand('disconnect'),
      startRecording: () => sendCommand('startRecording'),
      stopRecording: () => sendCommand('stopRecording'),
    }));

    // Render WebView with embedded HTML
    return (
      <WebView
        ref={webViewRef}
        source={{ html: TRANSCRIPTION_HTML }}
        onMessage={handleMessage}
        style={{ width: 0, height: 0, opacity: 0 }}
        javaScriptEnabled={true}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
        originWhitelist={['*']}
        allowsProtectedMedia={true}
        androidLayerType="hardware"
        androidHardwareAccelerationDisabled={false}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView error:', nativeEvent);
          callbacks.onError?.(`WebView error: ${nativeEvent.description || 'Unknown error'}`);
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView HTTP error:', nativeEvent);
          callbacks.onError?.(`Network error: ${nativeEvent.statusCode || 'Unknown'}`);
        }}
        onLoadEnd={() => {
          console.log('✅ WebView loaded successfully');
        }}
        onLoadStart={() => {
          console.log('🔄 WebView loading...');
        }}
        // Add timeout for connection
        startInLoadingState={false}
        // Enable debugging in development
        webviewDebuggingEnabled={__DEV__}
      />
    );
  }
);

