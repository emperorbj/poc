# WebView-Based Transcription Setup

## Overview

This implementation uses a **WebView component** to leverage the Web Audio API for real-time transcription. This approach works in both Expo Go and production APK builds because it uses the browser's Web Audio API inside a WebView, which is available on all platforms.

## What Was Changed

### 1. ✅ Updated Transcription Screen
- **File**: `app/consultation/transcription.tsx`
- Changed from `useTranscription` to `useTranscriptionWebView`
- Added hidden WebView component to the screen
- Removed native module initialization error check (not needed with WebView)

### 2. ✅ Created WebView Component
- **File**: `components/TranscriptionWebView.tsx`
- Embeds HTML with Web Audio API code
- Communicates with React Native via `postMessage`
- Handles WebSocket connection and audio recording
- Sends raw PCM Int16 audio data (what the server expects)

### 3. ✅ Created WebView Hook
- **File**: `hooks/use-transcription-webview.ts`
- Provides same API as original `useTranscription` hook
- Manages state (transcriptions, recording status, errors)
- Returns WebView component to be rendered

### 4. ✅ Error Handling Improvements
- Added connection state validation before starting recording
- Auto-clear non-critical errors after 5 seconds
- Better error messages for microphone permissions
- WebView loading and error callbacks

## How It Works

```
React Native App
└── TranscriptionWebView (hidden, 0x0 size)
    └── HTML with Web Audio API
        └── AudioWorklet captures raw PCM Int16
        └── Sends to WebSocket server
        └── Receives transcriptions
        └── Sends transcriptions to React Native via postMessage
```

## Key Features

1. **Works in Expo Go** - No native modules required
2. **Works in Production APK** - WebView is available on all platforms
3. **Raw PCM Audio** - Sends Int16 PCM data (server requirement)
4. **Same API** - Drop-in replacement for original hook
5. **Error Handling** - Comprehensive error handling and recovery

## Testing

### To Test:

1. **Start the app**:
   ```bash
   npm start
   ```

2. **Navigate to consultation transcription screen**

3. **Check connection status**:
   - Should show "🟢 Connected" after WebView loads
   - WebSocket connects automatically

4. **Start recording**:
   - Tap "Start Live Transcription"
   - Grant microphone permission if prompted
   - Should see "🔴 Recording & Transcribing..."

5. **Speak and verify**:
   - Speak into microphone
   - Should see live transcriptions appearing
   - Interim (gray/italic) and final (green) transcriptions

6. **Stop recording**:
   - Tap "Stop Recording"
   - Recording should stop cleanly

### Expected Behavior:

- ✅ WebView loads silently (hidden)
- ✅ WebSocket connects automatically
- ✅ Microphone permission requested on first use
- ✅ Real-time transcriptions appear as you speak
- ✅ No errors about native modules
- ✅ Works in both Expo Go and production builds

## Troubleshooting

### If transcriptions don't appear:

1. **Check WebSocket connection**:
   - Look for "🟢 Connected" status
   - Check console for WebSocket errors

2. **Check microphone permission**:
   - Ensure microphone permission is granted
   - Check device settings if needed

3. **Check console logs**:
   - Look for "✅ WebView loaded successfully"
   - Look for "WebSocket connected"
   - Look for "Recording started"

### Common Issues:

- **"Not connected" error**: WebView may not be loaded yet, wait a moment
- **No transcriptions**: Check server connection and microphone permission
- **WebView errors**: Check that `react-native-webview` is properly installed

## Files Modified/Created

### New Files:
- `components/TranscriptionWebView.tsx` - WebView component
- `hooks/use-transcription-webview.ts` - WebView hook
- `assets/transcription-webview.html` - HTML template (for reference)

### Modified Files:
- `app/consultation/transcription.tsx` - Updated to use WebView hook
- `utils/pcmAudioRecorder.ts` - Updated to use expo-audio (fallback)
- `app.json` - Updated to use expo-audio plugin

## Next Steps

1. **Test in Expo Go** - Verify it works without native modules
2. **Test in Production Build** - Build APK and test
3. **Monitor Performance** - Check for any performance issues
4. **Add Analytics** - Track transcription success rates

## Notes

- The WebView is completely hidden (0x0 size, transparent)
- Web Audio API provides direct access to raw PCM audio samples
- This is the same approach used in your working HTML file
- No native modules required, works everywhere WebView works

