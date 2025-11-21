import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import {
  Settings,
  Bell,
  UserPlus,
  HelpCircle,
  Trash2,
  Lock,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient"; // Pour le fond stylé

// --- THEME ---
const COLORS = {
  bg: "#0A0A0A",
  card: "#1C1C1E",
  border: "#2A2A2E",
  purple: "#BF5AF2",
  neonGreen: "#39FF14",
  neonRed: "#FF3B30",
  textDim: "#8E8E93",
  white: "#FFFFFF",
};

export function ProfilePage({ balance }) {
  // --- DATA ---
  const stats = [
    { label: "RageCoins", value: balance, icon: "🪙" },
    { label: "Trains Annulés", value: "12", icon: "☠️" },
    { label: "Heures Perdues", value: "42h", icon: "⏳" },
    { label: "Taux de Victoire", value: "65%", icon: "📈" },
  ];

  const inventory = [
    { name: "Zombie", emoji: "🧟", unlocked: true },
    { name: "Conducteur", emoji: "👨‍✈️", unlocked: true },
    { name: "Pigeon", emoji: "🕊️", unlocked: true },
    { name: "Robot", emoji: "🤖", unlocked: false },
    { name: "Ninja", emoji: "🥷", unlocked: false },
    { name: "Alien", emoji: "👽", unlocked: false },
  ];

  const badges = [
    {
      name: "Le Survivant",
      description: "Survécu à un retard de 120 min",
      icon: "💪",
      color: "#39FF14",
      unlocked: true,
    },
    {
      name: "La Sardine",
      description: "Signalé un train bondé 10 fois",
      icon: "🐟",
      color: "#FF3B30",
      unlocked: true,
    },
    {
      name: "L'Oracle",
      description: "10 prédictions correctes d'affilée",
      icon: "🔮",
      color: "#BF5AF2",
      unlocked: true,
    },
    {
      name: "Le Maudit",
      description: "Perdu 5 paris d'affilée",
      icon: "💀",
      color: "#8B0000",
      unlocked: false,
    },
    {
      name: "Le Marathonien",
      description: "Accumulé 100h de retard",
      icon: "⏱️",
      color: "#FFD700",
      unlocked: false,
    },
    {
      name: "Le Chanceux",
      description: "Gagné 1000 RageCoins",
      icon: "🍀",
      color: "#32ADE6",
      unlocked: false,
    },
  ];

  const settings = [
    { icon: Bell, label: "Notifications" },
    { icon: UserPlus, label: "Inviter un pote de galère" },
    { icon: HelpCircle, label: "Support" },
    { icon: Trash2, label: "Supprimer mon compte", danger: true },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 120 }} // Espace pour la nav bar
      showsVerticalScrollIndicator={false}
    >
      {/* --- HEADER: CARTE D'IDENTITÉ --- */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={["#0A0A0A", "#2D1B4E", "#0A0A0A"]} // Dégradé violet sombre
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.identityCard}
        >
          <View style={styles.avatarSection}>
            <View style={styles.avatarGlowContainer}>
              <Image
                source={{ uri: "https://i.pravatar.cc/150?img=11" }}
                style={styles.avatarImage}
              />
              {/* Badge Pigeon */}
              <View style={styles.pigeonBadge}>
                <Text style={{ fontSize: 12 }}>🕊️</Text>
              </View>
            </View>

            <Text style={styles.pseudo}>PigeonVoyageur</Text>

            <View style={styles.titleBadge}>
              <Text style={styles.titleText}>Navetteur Masochiste</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* --- STATS GRID --- */}
      <View style={styles.section}>
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <Text style={styles.statIcon}>{stat.icon}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* --- SKINS (Horizontal Scroll) --- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Skins & Cosmétiques</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12, paddingHorizontal: 16 }}
        >
          {inventory.map((item, index) => (
            <View
              key={index}
              style={[styles.skinCard, !item.unlocked && { opacity: 0.4 }]}
            >
              <Text style={styles.skinEmoji}>{item.emoji}</Text>
              {!item.unlocked && (
                <View style={styles.lockIcon}>
                  <Lock size={12} color="white" />
                </View>
              )}
              <Text style={styles.skinName}>{item.name}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* --- BADGES / TROPHÉES (Grid 3 cols) --- */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { marginLeft: 16 }]}>
          Salle des Trophées
        </Text>
        <View style={styles.badgeGrid}>
          {badges.map((badge, index) => (
            <View
              key={index}
              style={[styles.badgeCard, !badge.unlocked && { opacity: 0.3 }]}
            >
              <View
                style={[
                  styles.badgeIconBox,
                  {
                    backgroundColor: badge.unlocked
                      ? `${badge.color}20`
                      : COLORS.card, // 20 = transparence hex
                    borderColor: badge.unlocked ? badge.color : COLORS.border,
                  },
                ]}
              >
                <Text style={{ fontSize: 24 }}>{badge.icon}</Text>
                {!badge.unlocked && (
                  <Lock
                    size={12}
                    color="white"
                    style={{ position: "absolute", top: 4, right: 4 }}
                  />
                )}
              </View>
              <Text style={styles.badgeName} numberOfLines={1}>
                {badge.name}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* --- PARAMÈTRES --- */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { marginLeft: 16 }]}>
          Paramètres
        </Text>
        <View style={styles.settingsList}>
          {settings.map((setting, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.settingRow,
                setting.danger && { borderColor: "rgba(255,59,48,0.3)" },
              ]}
            >
              <setting.icon
                size={20}
                color={setting.danger ? COLORS.neonRed : COLORS.textDim}
              />
              <Text
                style={[
                  styles.settingText,
                  setting.danger && { color: COLORS.neonRed },
                ]}
              >
                {setting.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={{ padding: 20, alignItems: "center" }}>
        <Text style={{ color: "#444", fontSize: 10 }}>
          v1.0.0 - Made with rage in Belgium 🇧🇪
        </Text>
      </View>
    </ScrollView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 12,
  },

  // Header Identity Card
  headerContainer: {
    padding: 16,
    marginTop: 10,
  },
  identityCard: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(191, 90, 242, 0.3)", // Violet border
  },
  avatarSection: {
    alignItems: "center",
  },
  avatarWrapper: {
    marginBottom: 16,
    position: 'relative',
    // 👇 AJOUTE ÇA POUR CENTRER LE GLOW
    alignItems: 'center', 
    justifyContent: 'center',
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: COLORS.purple,
  },
  pigeonBadge: {
    position: "absolute",
    bottom: -3,
    alignSelf: "center",
    backgroundColor: COLORS.neonGreen,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  pseudo: {
    color: COLORS.white,
    fontSize: 24,
    bottom: -9,
    fontWeight: "bold",
    marginBottom: 8,
  },
  titleBadge: {
    backgroundColor: "rgba(191, 90, 242, 0.1)",
    borderColor: COLORS.purple,
    borderWidth: 1,
    bottom: -9,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  titleText: {
    color: COLORS.purple,
    fontSize: 12,
    fontWeight: "600",
  },

  // Stats Grid
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 12,
  },
  statCard: {
    width: "48%", // Pour avoir 2 colonnes
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statIcon: { fontSize: 24, marginBottom: 8 },
  statValue: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 2,
  },
  statLabel: { color: COLORS.textDim, fontSize: 12 },

  // Skins
  skinCard: {
    width: 90,
    height: 100,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  skinEmoji: { fontSize: 32, marginBottom: 8 },
  skinName: { color: COLORS.textDim, fontSize: 10 },
  lockIcon: { position: "absolute", bottom: 4, right: 4 },

  // Badges Grid
  badgeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 12,
  },
  badgeCard: {
    width: "30.5%", // Pour 3 colonnes environ
    alignItems: "center",
    marginBottom: 8,
  },
  badgeIconBox: {
    width: "100%",
    aspectRatio: 1, // Carré
    borderRadius: 16,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  badgeName: {
    color: COLORS.textDim,
    fontSize: 10,
    textAlign: "center",
  },

  // Settings
  settingsList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
  },
  settingText: {
    color: "#D1D1D6",
    fontWeight: "500",
  },


  // 👇 NOUVEAU STYLE POUR LE GLOW SUBTIL
  avatarGlowContainer: {
    // Pour iOS :
    shadowColor: COLORS.purple,
    shadowOffset: { width: 0, height: 0 }, // Lumière centrée
    shadowOpacity: 1.6, // Pas trop fort
    shadowRadius: 15,   // Rayon large pour l'effet "flou"
    
    // Pour Android (moins précis pour les couleurs, mais donne du relief) :
    elevation: 10,
    backgroundColor: '#0000', // Nécessaire sur Android pour que l'ombre apparaisse parfois
    borderRadius: 50, // Important pour que l'ombre suive le rond
  },

});
