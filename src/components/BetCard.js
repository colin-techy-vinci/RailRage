import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

export const BetCard = ({ trainNumber, bet, status, winAmount }) => {
  let statusText = "En attente...";
  let statusColor = "#8E8E93";
  let borderColor = COLORS.border;

  if (status === 'won') {
    statusText = `+${winAmount} 🪙`;
    statusColor = COLORS.neonGreen;
    borderColor = COLORS.neonGreen;
  } else if (status === 'lost') {
    statusText = "À l'heure 🤮";
    statusColor = COLORS.neonRed;
    borderColor = COLORS.neonRed;
  }

  return (
    <View style={[styles.betCard, { borderColor: borderColor }]}>
      <View style={styles.betHeader}>
        <Text style={styles.betTrain}>{trainNumber}</Text>
        <Text style={styles.betAmount}>{bet} 🪙</Text>
      </View>
      <Text style={[styles.betStatus, { color: statusColor, fontWeight: 'bold' }]}>{statusText}</Text>
      {status === 'pending' ? (
        <View style={styles.tensionContainer}>
          <Text style={styles.tensionLabel}>Tension</Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${Math.random() * 100}%` }]} />
          </View>
        </View>
      ) : (
        <View style={{ alignItems: 'center', marginTop: 5 }}>
          <Text style={{ fontSize: 20 }}>{status === 'won' ? '🤑' : '💸'}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  betCard: { width: 160, backgroundColor: COLORS.card, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border },
  betHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  betTrain: { color: COLORS.white, fontWeight: 'bold' },
  betAmount: { color: COLORS.neonGreen, fontSize: 12 },
  betStatus: { color: "#8E8E93", fontSize: 12, marginBottom: 8 },
  tensionContainer: { marginTop: 4 },
  tensionLabel: { color: "#555", fontSize: 10, marginBottom: 2 },
  progressBarBg: { height: 4, backgroundColor: "#333", borderRadius: 2 },
  progressBarFill: { height: 4, backgroundColor: COLORS.neonRed, borderRadius: 2 },
});