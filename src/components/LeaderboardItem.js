import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Crown } from 'lucide-react-native';
import { COLORS } from '../constants/theme';

export const LeaderboardItem = ({ rank, pseudo, gain }) => (
  <View style={[styles.leaderRow, rank === 1 && styles.leaderRowFirst]}>
    <View style={styles.leaderLeft}>
      <Text style={[styles.rank, rank === 1 ? { color: COLORS.gold } : { color: "white" }]}>#{rank}</Text>
      <View style={[styles.avatarSmall, rank === 1 && { borderColor: COLORS.gold, borderWidth: 1 }]}>
        <Text style={styles.avatarText}>{pseudo.substring(0, 2).toUpperCase()}</Text>
      </View>
      <Text style={styles.pseudo}>{pseudo}</Text>
    </View>
    <View style={styles.gainBadge}>
      {rank === 1 && <Crown size={14} color="black" style={{ marginRight: 4 }} />}
      <Text style={styles.gainText}>+{gain}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  leaderRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: COLORS.card, padding: 12, borderRadius: 10 },
  leaderRowFirst: { borderColor: COLORS.gold, borderWidth: 1 },
  leaderLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  rank: { fontSize: 16, fontWeight: "bold", width: 20 },
  avatarSmall: { width: 32, height: 32, borderRadius: 16, backgroundColor: "#333", alignItems: "center", justifyContent: "center" },
  avatarText: { color: "white", fontSize: 10, fontWeight: "bold" },
  pseudo: { color: "white", fontWeight: "600" },
  gainBadge: { backgroundColor: COLORS.neonGreen, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, flexDirection: "row", alignItems: "center" },
  gainText: { color: "black", fontWeight: "bold", fontSize: 12 },
});