import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../constants/theme';

export const TrainCard = ({ time, destination, status, delay }) => {
  const isDelayed = delay > 0;
  const bgOpacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isDelayed) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bgOpacityAnim, { toValue: 0.6, duration: 1000, useNativeDriver: true }),
          Animated.timing(bgOpacityAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      ).start();
    } else {
      bgOpacityAnim.setValue(1);
    }
  }, [isDelayed]);

  const backgroundColor = isDelayed ? 'rgba(255, 59, 48, 0.4)' : 'rgba(57, 255, 20, 0.1)';
  const textColor = isDelayed ? COLORS.neonRed : COLORS.neonGreen;
  const borderColor = isDelayed ? 'rgba(255, 59, 48, 0.3)' : 'transparent';

  return (
    <View style={styles.trainCard}>
      <View>
        <Text style={styles.trainTime}>{time}</Text>
        <Text style={styles.trainDest}>{destination}</Text>
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <View style={[styles.badgeContainer, { borderColor: borderColor }]}>
          <Animated.View 
            style={[StyleSheet.absoluteFill, { backgroundColor: backgroundColor }, isDelayed && { opacity: bgOpacityAnim }]} 
          />
          <Text style={[styles.statusText, { color: textColor }]}>
            {isDelayed ? `+${delay} min` : "À l'heure"}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  trainCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#2C2C2E', paddingVertical: 16 },
  trainTime: { color: COLORS.white, fontSize: 20, fontWeight: 'bold' },
  trainDest: { color: '#8E8E93', fontSize: 14, marginTop: 2 },
  badgeContainer: { borderRadius: 20, borderWidth: 1, overflow: 'hidden', paddingHorizontal: 12, paddingVertical: 6, position: 'relative' },
  statusText: { fontWeight: 'bold', fontSize: 12 },
});