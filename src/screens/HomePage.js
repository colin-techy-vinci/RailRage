// src/screens/HomePage.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { MapPin, Plus, RefreshCw } from "lucide-react-native";
import { CyberCustomTitle } from "../components/LottieTitle";

// Imports modularisés
import { COLORS } from "../constants/theme";
import { FAKE_HOME_TRAINS, FAKE_HOME_LEADERBOARD } from "../constants/data";
import { TrainCard } from "../components/TrainCard";
import { BetCard } from "../components/BetCard";
import { LeaderboardItem } from "../components/LeaderboardItem";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGame } from "../context/GameContext";

export function HomePage({}) {
  const { myBets, balance, simulateTime } = useGame();
  const CUSTOM_TITLE_SOURCE =
    "https://lottie.host/6da32931-5ebb-4835-ba8a-beeef9a80019/h2CjFiZmSE.lottie";
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={{ paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topSection}>
        {/* 1. TITRE CENTRÉ (Ligne 1) */}
        <View style={styles.titleContainer}>
           <CyberCustomTitle 
             source={CUSTOM_TITLE_SOURCE}
             width={320}      // 1. Agrandis la zone si l'anim est coupée
             height={100}     // 2. Agrandis la hauteur si besoin
             fontSize={33}    // 3. Réduis la police pour que ça rentre (essaie 20, 22, 24...)
             textOffset={2}  // 4. Descends le texte si l'anim est trop basse (ou -10 pour monter)
           />
        </View>

        {/* 2. BARRE DE STATUTS (Ligne 2) */}
        <View style={styles.statusRow}>
          {/* DROITE : Argent + Boutons */}
          <View style={styles.headerRight}>
            <View style={styles.coinBox}>
              <Text style={{ fontSize: 14 }}>🪙</Text>
              <Text style={styles.coinText}>
                {balance !== undefined ? balance : 0}
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.plusBtn,
                { backgroundColor: "#BF5AF2", marginRight: 8 },
              ]}
              onPress={simulateTime} // Utilise la fonction du contexte
            >
              <RefreshCw color="white" size={20} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.plusBtn}>
              <Plus color="black" size={20} />
            </TouchableOpacity>
          </View>
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
        <Text style={styles.sectionTitle}>Mes Mises ({myBets.length})</Text>
        {myBets.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
          >
            {myBets.map((bet, index) => (
              <BetCard key={index} {...bet} />
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyBetState}>
            <Text style={{ fontSize: 24 }}>🦗</Text>
            <Text style={styles.emptyBetText}>Aucun pari en cours.</Text>
            <Text style={styles.emptyBetSub}>
              Va au terminal pour perdre ton argent.
            </Text>
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
  container: { flex: 1, backgroundColor: COLORS.bg, paddingHorizontal: 16 },

  // Nouveaux styles pour le header restructuré
  topSection: {
    marginBottom: 20,
    marginTop: 10,
  },
  titleContainer: {
    alignItems: "center", // Centre le titre horizontalement
    marginBottom: 15, // Espace entre le titre et la barre d'argent
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between", // Avatar à gauche, Argent à droite
    alignItems: "center",
  },

  // Le reste reste identique
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  coinBox: {
    backgroundColor: COLORS.card,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  coinText: { color: COLORS.white, fontWeight: "bold", fontSize: 14 },
  plusBtn: {
    backgroundColor: COLORS.neonGreen,
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  section: { marginBottom: 24 },
  sectionTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    marginLeft: 4,
  },
  stationCard: {
    backgroundColor: COLORS.card,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  stationHeader: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
    alignItems: "center",
  },
  stationTitle: { color: COLORS.white, fontSize: 16, fontWeight: "600" },
  leaderContainer: { gap: 8 },
  emptyBetState: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: "dashed",
  },
  emptyBetText: { color: COLORS.white, fontWeight: "bold", marginTop: 8 },
  emptyBetSub: { color: "#8E8E93", fontSize: 12, marginTop: 4 },
});
