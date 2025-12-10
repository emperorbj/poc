// components/AudioVisualizer.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../styles/commonStyles';

interface AudioVisualizerProps {
  isRecording: boolean;
  onPause: () => void;
  onStop: () => void;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isRecording,
  onPause,
  onStop,
}) => {
  const [waveHeights, setWaveHeights] = useState<number[]>(
    Array(8).fill(20)
  );

  useEffect(() => {
    if (!isRecording) return;

    const interval = setInterval(() => {
      setWaveHeights(
        Array(8)
          .fill(0)
          .map(() => Math.random() * 40 + 10)
      );
    }, 150);

    return () => clearInterval(interval);
  }, [isRecording]);

  return (
    <View style={styles.container}>
      <View style={styles.waveform}>
        {waveHeights.map((height, index) => (
          <View
            key={index}
            style={[
              styles.waveBar,
              {
                height,
                backgroundColor: isRecording ? colors.primary : colors.gray[400],
              },
            ]}
          />
        ))}
      </View>
      
      <View style={styles.controls}>
        <TouchableOpacity style={styles.pauseButton} onPress={onPause}>
          <Text style={styles.buttonText}>
            {isRecording ? '⏸ Pause' : '▶ Resume'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.stopButton} onPress={onStop}>
          <Text style={styles.buttonText}>⏹ Stop</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    gap: 4,
    marginBottom: 20,
  },
  waveBar: {
    width: 4,
    borderRadius: 2,
  },
  controls: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  pauseButton: {
    backgroundColor: colors.warning,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  stopButton: {
    backgroundColor: colors.danger,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: colors.white,
    fontWeight: '600',
  },
});