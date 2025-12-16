# PCM Audio Recording Setup

## Overview
We've migrated from Expo AV (M4A format) to PCM audio recording to match the server's requirements. The server expects raw PCM Int16 audio data, not encoded M4A files.

## Library Used
- **react-native-audio-recorder-player** (v4.5.0)
  - ⚠️ **Note**: This package is deprecated and suggests using `react-native-nitro-sound` instead
  - However, it's functional and we'll use it for now

## Important Notes

### Expo Go Limitation
⚠️ **This library requires native modules and will NOT work with Expo Go.**

You'll need to:
1. Create a **development build** using:
   ```bash
   npx expo prebuild
   npx expo run:android  # or run:ios
   ```

2. Or use EAS Build:
   ```bash
   eas build --profile development --platform android
   ```

### Permissions

#### Android
Add to `app.json` or `AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
```

#### iOS
Add to `app.json`:
```json
{
  "ios": {
    "infoPlist": {
      "NSMicrophoneUsageDescription": "This app needs access to your microphone for transcription"
    }
  }
}
```

## How It Works

1. **Recording**: Records audio in PCM format (16kHz, mono, 16-bit)
2. **Chunking**: Records 2-second chunks continuously
3. **Sending**: Reads PCM file as ArrayBuffer and sends directly via WebSocket
4. **Server**: Server receives raw PCM data and can process it immediately

## Files Changed

- `poc/utils/pcmAudioRecorder.ts` - New PCM recording utility
- `poc/hooks/use-transcription.ts` - Updated to use PCM recorder instead of Expo AV

## Testing

After creating a development build:
1. Start the app
2. Navigate to transcription screen
3. Click "Start Recording"
4. You should see:
   - ✅ WebSocket connected
   - 🎤 PCM recording started
   - 📤 Audio chunks sent
   - 📨 Transcription messages received (if server processes correctly)

## Troubleshooting

### "Module not found" errors
- You need a development build, not Expo Go

### "Permission denied"
- Check that microphone permissions are properly configured
- On Android, ensure permissions are requested at runtime

### "Recording failed"
- Check device microphone is working
- Verify permissions are granted

### Still getting WebSocket 1006 errors
- Verify the PCM format matches server expectations
- Check server logs for format errors
- Ensure sample rate is 16kHz (matches server)

## Future Improvements

Consider migrating to `react-native-nitro-sound` which:
- Is actively maintained
- Has better PCM support
- Better TypeScript support

