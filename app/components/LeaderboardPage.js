import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  Crown,
  TrendingUp,
  TrendingDown,
  Minus,
  CloudRain,
} from "lucide-react-native";

// --- CONFIGURATION DU THÈME ---
const COLORS = {
  bg: "#0A0A0A",
  card: "#1C1C1E",
  border: "#2A2A2E",
  neonGreen: "#39FF14",
  neonRed: "#FF3B30",
  textDim: "#8E8E93",
  white: "#FFFFFF",
  gold: "#FFD700",
  silver: "#C0C0C0",
  bronze: "#CD7F32",
  darkRed: "#8B0000",
};

// --- COMPOSANT AVATAR (Reutilisable) ---
const Avatar = ({ fallback, size = 40, color, border = false }) => (
  <View
    style={[
      styles.avatarContainer,
      { width: size, height: size, borderRadius: size / 2 },
      border && { borderWidth: 2, borderColor: color },
    ]}
  >
    {/* Ici on pourrait mettre une <Image />, pour l'instant on met le fallback text */}
    <Text style={[styles.avatarText, { fontSize: size * 0.4 }]}>
      {fallback}
    </Text>
  </View>
);

export function LeaderboardPage() {
  // --- DONNÉES ---
  const topThree = [
    {
      rank: 2,
      pseudo: "TGV_Killer",
      avatar: "TK",
      score: 12800,
      badge: "Visionnaire",
      color: COLORS.silver,
    },
    {
      rank: 1,
      pseudo: "RailMaster",
      avatar: "RM",
      score: 15400,
      badge: "Oracle",
      color: COLORS.gold,
    },
    {
      rank: 3,
      pseudo: "PigeonPro",
      avatar: "PP",
      score: 9500,
      badge: "Voyant",
      color: COLORS.bronze,
    },
  ];

  const otherRanks = [
    { rank: 4, pseudo: "DelayKing", avatar: "DK", score: 8900, trend: "up" },
    {
      rank: 5,
      pseudo: "TrainSpotter",
      avatar: "TS",
      score: 7650,
      trend: "down",
    },
    { rank: 6, pseudo: "RailRebel", avatar: "RR", score: 6890, trend: "up" },
    {
      rank: 7,
      pseudo: "StationMaster",
      avatar: "SM",
      score: 6120,
      trend: "same",
    },
    { rank: 8, pseudo: "TrackHunter", avatar: "TH", score: 5800, trend: "up" },
    {
      rank: 9,
      pseudo: "WagonWarrior",
      avatar: "WW",
      score: 5200,
      trend: "down",
    },
  ];

  const myRank = { rank: 458, pseudo: "Toi", avatar: "PV", score: 450 };
  const lastPlace = {
    pseudo: "NoobVoyageur",
    avatar: "NV",
    score: -320,
    rank: 1247,
  };

  // --- RENDU D'UN JOUEUR DU PODIUM ---
  // Dans components/LeaderboardPage.js

  // --- RENDU D'UN JOUEUR DU PODIUM ---
  const renderPodiumPlayer = (player, size, isFirst = false) => {
    // 👇 CALCUL DU GLOW DYNAMIQUE
    const dynamicGlowStyle = {
      shadowColor: player.color, // La couleur Or/Argent/Bronze
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: isFirst ? 1 : 0.8, // Le 1er brille plus fort
      shadowRadius: isFirst ? 25 : 15, // Le rayon est plus grand pour le 1er
      elevation: 10, // Pour Android
      backgroundColor: "#0000", // Hack Android
      borderRadius: size / 2, // Pour suivre le rond
    };

    return (
      <View style={[styles.podiumCol, isFirst && { marginBottom: 20 }]}>
        {/* Couronne pour le 1er */}
        {isFirst && (
          <Crown size={24} color={COLORS.gold} style={{ marginBottom: 4 }} />
        )}

        {/* 👇 ON APPLIQUE LE STYLE DYNAMIQUE ICI */}
        <View style={[styles.podiumAvatarWrapper, dynamicGlowStyle]}>
          <Avatar
            fallback={player.avatar}
            size={size}
            color={player.color}
            border={true}
          />
          <View style={[styles.rankBadge, { backgroundColor: player.color }]}>
            <Text style={styles.rankBadgeText}>{player.rank}</Text>
          </View>
        </View>

        <Text style={[styles.podiumPseudo, { color: player.color }]}>
          {player.pseudo}
        </Text>
        <Text style={styles.podiumBadgeText}>{player.badge}</Text>

        <View style={[styles.xpBadge, { borderColor: player.color }]}>
          <Text style={[styles.xpText, { color: player.color }]}>
            {player.score} XP
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 220 }} // Espace pour la barre Sticky + Nav
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>CLASSEMENT</Text>
          <Text style={styles.subtitle}>Semaine 47 • 2025</Text>
        </View>

        {/* PODIUM (Flexbox Align-Items: Flex-End) */}
        <View style={styles.podiumContainer}>
          {/* 2ème Place */}
          {renderPodiumPlayer(topThree[0], 64)}
          {/* 1ère Place (Centre) */}
          {renderPodiumPlayer(topThree[1], 80, true)}
          {/* 3ème Place */}
          {renderPodiumPlayer(topThree[2], 64)}
        </View>

        {/* LISTE DES AUTRES */}
        <View style={styles.listContainer}>
          {otherRanks.map((user) => (
            <View key={user.rank} style={styles.rankRow}>
              <View style={styles.rankRowLeft}>
                <Text style={styles.rankNumber}>#{user.rank}</Text>
                <Avatar
                  fallback={user.avatar}
                  size={40}
                  color={COLORS.border}
                />
                <Text style={styles.rankPseudo}>{user.pseudo}</Text>
              </View>

              <View style={styles.rankRowRight}>
                <Text style={styles.rankScore}>{user.score} XP</Text>
                {user.trend === "up" && (
                  <TrendingUp size={16} color={COLORS.neonGreen} />
                )}
                {user.trend === "down" && (
                  <TrendingDown size={16} color={COLORS.neonRed} />
                )}
                {user.trend === "same" && (
                  <Minus size={16} color={COLORS.textDim} />
                )}
              </View>
            </View>
          ))}
        </View>
        <View style={styles.myRankCard}>
          <View style={styles.stickyContent}>
            <View style={styles.stickyRow}>
              <View style={styles.stickyUserInfo}>
                <Avatar
                  fallback={myRank.avatar}
                  size={40}
                  color={COLORS.neonGreen}
                  border={true}
                />
                <View>
                  <Text style={styles.stickyText}>Tu es #{myRank.rank}</Text>
                  <Text style={styles.shameText}>(Honteux)</Text>
                </View>
              </View>
              <Text style={styles.stickyScore}>{myRank.score} XP</Text>
            </View>

            <TouchableOpacity style={styles.stickyButton}>
              <Text style={styles.stickyButtonText}>Parier pour remonter</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* LE CHAT NOIR (Honte) */}
        <View style={styles.shameSection}>
          <View style={styles.shameCard}>
            <View style={styles.shameHeader}>
              <CloudRain size={20} color={COLORS.neonRed} />
              <Text style={styles.shameTitle}>Le Chat Noir</Text>
            </View>

            <View style={styles.shameContent}>
              <View style={styles.shameUser}>
                <View>
                  <Avatar
                    fallback={lastPlace.avatar}
                    size={48}
                    color={COLORS.card}
                  />
                  <CloudRain
                    size={16}
                    color={COLORS.neonRed}
                    style={styles.shameIconOverlay}
                  />
                </View>
                <View>
                  <Text style={styles.rankPseudo}>{lastPlace.pseudo}</Text>
                  <Text style={styles.shameRank}>#{lastPlace.rank}</Text>
                </View>
              </View>

              <View style={{ alignItems: "flex-end" }}>
                <Text style={{ color: COLORS.neonRed, fontWeight: "bold" }}>
                  {lastPlace.score} XP
                </Text>
                <Text style={styles.shameLabel}>Dernier</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: COLORS.bg },

  // Header
  header: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    alignItems: "center",
  },
  title: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  subtitle: { color: COLORS.textDim, marginTop: 4 },

  // Avatar Helpers
  avatarContainer: {
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { color: "white", fontWeight: "bold" },

  // Podium
  podiumContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 10,
  },
  podiumCol: { alignItems: "center", width: "30%" },
  podiumAvatarWrapper: { marginBottom: 10 },
  rankBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  rankBadgeText: { color: "black", fontSize: 10, fontWeight: "bold" },
  podiumPseudo: {
    fontWeight: "bold",
    fontSize: 12,
    marginBottom: 2,
    textAlign: "center",
  },
  podiumBadgeText: { color: COLORS.textDim, fontSize: 10, marginBottom: 6 },
  xpBadge: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: COLORS.card,
  },
  xpText: { fontSize: 10, fontWeight: "bold" },

  // List
  listContainer: { paddingHorizontal: 16 },
  rankRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.card,
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  rankRowLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  rankNumber: { color: COLORS.textDim, width: 30, fontWeight: "bold" },
  rankPseudo: { color: COLORS.white, fontWeight: "600" },
  rankRowRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  rankScore: { color: "#D1D1D6", fontSize: 12 },

  // Shame Section
  shameSection: { paddingHorizontal: 16, marginTop: 16 },
  shameCard: {
    backgroundColor: "rgba(139, 0, 0, 0.15)",
    borderWidth: 1,
    borderColor: COLORS.darkRed,
    borderRadius: 16,
    padding: 16,
  },
  shameHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  shameTitle: { color: COLORS.neonRed, fontWeight: "bold" },
  shameContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  shameUser: { flexDirection: "row", gap: 12, alignItems: "center" },
  shameIconOverlay: { position: "absolute", top: -4, right: -4 },
  shameRank: { color: COLORS.textDim, fontSize: 12 },
  shameLabel: { color: COLORS.textDim, fontSize: 10 },

  // Sticky Bar
  myRankCard: {
    // Plus de position absolute, bottom, left, right !
    marginTop: 24, // Un peu d'espace au-dessus
    paddingHorizontal: 16, // Marges sur les côtés
    marginBottom: 20, // Marge en bas
  },
  stickyContent: {
    backgroundColor: "rgba(44, 44, 46, 0.6)", // J'ai baissé un peu l'opacité
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.neonGreen, // Bordure verte pour bien le distinguer
    // On peut garder l'ombre si tu veux
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  stickyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  stickyUserInfo: { flexDirection: "row", alignItems: "center", gap: 12 },
  stickyText: { color: COLORS.white, fontWeight: "600" },
  shameText: { color: COLORS.neonRed, fontSize: 12 },
  stickyScore: { color: "#D1D1D6" },
  stickyButton: {
    backgroundColor: COLORS.neonGreen,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  stickyButtonText: { color: "black", fontWeight: "bold" },
});
