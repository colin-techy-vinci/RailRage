// src/screens/HomePage.js
import React from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import { MapPin, Plus, RefreshCw } from "lucide-react-native";

// Imports modularisés
import { COLORS } from "../constants/theme";
import { FAKE_HOME_TRAINS, FAKE_HOME_LEADERBOARD } from "../constants/data";
import { TrainCard } from "../components/TrainCard";
import { BetCard } from "../components/BetCard";
import { LeaderboardItem } from "../components/LeaderboardItem";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function HomePage({ bets, balance, onSimulate, currentAvatar }) {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      style={[
      styles.container, 
      { paddingTop: insets.top }]}
      contentContainerStyle={{ paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={{ uri: currentAvatar }} style={styles.avatarMain} />
        </View>
        <Text style={styles.appTitle}>RAILRAGE</Text>
        <View style={styles.headerRight}>
          <View style={styles.coinBox}>
            <Text style={{ fontSize: 14 }}>🪙</Text>
            <Text style={styles.coinText}>{balance !== undefined ? balance : 0}</Text>
          </View>
          <TouchableOpacity style={[styles.plusBtn, { backgroundColor: "#BF5AF2", marginRight: 8 }]} onPress={onSimulate}>
            <RefreshCw color="white" size={20} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.plusBtn}>
            <Plus color="black" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      {/* MA GARE */}
      <View style={styles.section}>
        <View style={styles.stationCard}>
          <View style={styles.stationHeader}>
            <MapPin color={COLORS.neonRed} size={20} />
            <Text style={styles.stationTitle}>Gare de Bruxelles-Midi</Text>
          </View>
          <View style={{ gap: 10 }}>
            {FAKE_HOME_TRAINS.map((train, index) => (
              <TrainCard key={index} {...train} />
            ))}
          </View>
        </View>
      </View>

      {/* MES MISES */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mes Mises ({bets.length})</Text>
        {bets.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
            {bets.map((bet, index) => (
              <BetCard key={index} {...bet} />
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyBetState}>
            <Text style={{ fontSize: 24 }}>🦗</Text>
            <Text style={styles.emptyBetText}>Aucun pari en cours.</Text>
            <Text style={styles.emptyBetSub}>Va au terminal pour perdre ton argent.</Text>
          </View>
        )}
      </View>

      {/* LEADERBOARD */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Les Prophètes du Retard</Text>
        <View style={styles.leaderContainer}>
          {FAKE_HOME_LEADERBOARD.map((user) => (
            <LeaderboardItem key={user.rank} {...user} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, paddingHorizontal: 16, paddingTop: 10 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 30, marginTop: 10 },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  avatarMain: { width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: COLORS.neonGreen },
  appTitle: { color: COLORS.white, fontSize: 24, fontWeight: "900", letterSpacing: 4, fontFamily: "System" },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  coinBox: { backgroundColor: COLORS.card, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, flexDirection: "row", alignItems: "center", gap: 6, marginRight: 8, borderWidth: 1, borderColor: COLORS.border },
  coinText: { color: COLORS.white, fontWeight: "bold", fontSize: 14 },
  plusBtn: { backgroundColor: COLORS.neonGreen, width: 32, height: 32, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  section: { marginBottom: 24 },
  sectionTitle: { color: COLORS.white, fontSize: 18, fontWeight: "bold", marginBottom: 12, marginLeft: 4 },
  stationCard: { backgroundColor: COLORS.card, padding: 20, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border },
  stationHeader: { flexDirection: "row", gap: 8, marginBottom: 16, alignItems: "center" },
  stationTitle: { color: COLORS.white, fontSize: 16, fontWeight: "600" },
  leaderContainer: { gap: 8 },
  emptyBetState: { backgroundColor: COLORS.card, borderRadius: 12, padding: 20, alignItems: "center", borderWidth: 1, borderColor: COLORS.border, borderStyle: "dashed" },
  emptyBetText: { color: COLORS.white, fontWeight: "bold", marginTop: 8 },
  emptyBetSub: { color: "#8E8E93", fontSize: 12, marginTop: 4 },
});