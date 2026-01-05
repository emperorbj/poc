// hooks/use-transcription-webview.ts

import React, { useCallback, useRef, useState } from 'react';
import { TranscriptionWebView, TranscriptionWebViewCallbacks, TranscriptionWebViewRef } from '../components/TranscriptionWebView';

export interface TranscriptionResult {
  id: string;
  text: string;
  isFinal: boolean;
  confidence?: number;
  speakerTag?: number;
  timestamp: Date;
}

export interface UseTranscriptionWebViewResult {
  isConnected: boolean;
  isRecording: boolean;
  transcriptions: TranscriptionResult[];
  currentInterim: string;
  error: string | null;
  startTranscription: () => void;
  stopTranscription: () => void;
  clearTranscriptions: () => void;
  WebViewComponent: React.ReactElement;
}

/**
 * Hook that uses WebView with Web Audio API for real-time transcription
 * This works in both Expo Go and production builds because it uses
 * the browser's Web Audio API inside a WebView
 */
export function useTranscriptionWebView(): UseTranscriptionWebViewResult {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcriptions, setTranscriptions] = useState<TranscriptionResult[]>([]);
  const [currentInterim, setCurrentInterim] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const webViewRef = useRef<TranscriptionWebViewRef>(null);
  const pendingStartRef = useRef(false); // Track if user wants to start but connection isn't ready

  const handleTranscription = useCallback((data: {
    transcript: string;
    is_final: boolean;
    confidence?: number;
    speaker_tag?: number;
  }) => {
    console.log('📥 Hook received transcription:', data.transcript, 'is_final:', data.is_final);
    
    if (!data.transcript) {
      console.warn('⚠️ Empty transcript received');
      return;
    }

    if (data.is_final) {
      // Final transcription - add to list
      const newTranscription: TranscriptionResult = {
        id: Date.now().toString() + Math.random(),
        text: data.transcript,
        isFinal: true,
        confidence: data.confidence,
        speakerTag: data.speaker_tag,
        timestamp: new Date(),
      };

      setTranscriptions(prev => {
        console.log('📝 Adding final transcription, total count:', prev.length + 1);
        return [...prev, newTranscription];
      });
      setCurrentInterim(''); // Clear interim
      console.log('✅ Final transcription added:', data.transcript);
    } else {
      // Interim transcription - update current
      console.log('💬 Updating interim transcription');
      setCurrentInterim(data.transcript);
    }
  }, []);

  const callbacks: TranscriptionWebViewCallbacks = {
    onConnected: () => {
      console.log('✅ WebView WebSocket connected');
      setIsConnected(true);
      setError(null);
      
      // If user clicked start before connection was ready, start now
      if (pendingStartRef.current && webViewRef.current) {
        console.log('🎙️ Auto-starting recording now that connection is ready');
        pendingStartRef.current = false;
        try {
          webViewRef.current.startRecording();
        } catch (err) {
          console.error('❌ Error auto-starting recording:', err);
          setError('Failed to start recording after connection');
        }
      }
    },
    onDisconnected: () => {
      console.log('🔌 WebView WebSocket disconnected');
      setIsConnected(false);
    },
    onTranscription: handleTranscription,
    onError: (errorMsg: string) => {
      console.error('❌ WebView error:', errorMsg);
      setError(errorMsg);
      // Auto-clear error after 5 seconds for non-critical errors
      if (!errorMsg.includes('microphone') && !errorMsg.includes('permission')) {
        setTimeout(() => {
          setError(null);
        }, 5000);
      }
    },
    onRecordingStarted: () => {
      console.log('✅ Recording started via WebView - state updated');
      setIsRecording(true);
      setError(null);
    },
    onRecordingStopped: () => {
      console.log('⏹️ Recording stopped via WebView');
      setIsRecording(false);
      pendingStartRef.current = false; // Clear pending flag
    },
  };

  const startTranscription = useCallback(() => {
    // If not connected yet, set pending flag and wait for connection
    if (!isConnected) {
      console.log('⏳ Connection not ready, will start when connected...');
      pendingStartRef.current = true;
      setError(null); // Clear any previous errors
      return;
    }
    
    if (webViewRef.current) {
      try {
        pendingStartRef.current = false; // Clear pending flag
        webViewRef.current.startRecording();
        console.log('🎙️ Starting recording...');
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to start recording';
        setError(errorMsg);
        console.error('❌ Error starting recording:', err);
      }
    } else {
      setError('WebView not initialized. Please try again.');
      console.error('❌ WebView ref not available');
    }
  }, [isConnected]);

  const stopTranscription = useCallback(() => {
    if (webViewRef.current) {
      try {
        webViewRef.current.stopRecording();
      } catch (err) {
        console.error('❌ Error stopping recording:', err);
        // Don't set error here - stopping should always succeed
      }
    }
  }, []);

  const clearTranscriptions = useCallback(() => {
    setTranscriptions([]);
    setCurrentInterim('');
  }, []);

  const WebViewComponent = React.createElement(TranscriptionWebView, {
    ref: webViewRef,
    callbacks: callbacks,
    autoConnect: true,
  });

  return {
    isConnected,
    isRecording,
    transcriptions,
    currentInterim,
    error,
    startTranscription,
    stopTranscription,
    clearTranscriptions,
    WebViewComponent,
  };
}

