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
import { LinearGradient } from "expo-linear-gradient";

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

// 👇 AJOUTE 'inventory' et 'onBuySkin' dans les props
export function ProfilePage({
  balance,
  pseudo,
  inventory,
  onBuySkin,
  onReset,
  currentAvatar,
  onEquipSkin,
}) {
  const stats = [
    { label: "RageCoins", value: balance, icon: "🪙" },
    { label: "Trains Annulés", value: "12", icon: "☠️" },
    { label: "Heures Perdues", value: "42h", icon: "⏳" },
    { label: "Taux de Victoire", value: "65%", icon: "📈" },
  ];

  // ❌ J'ai supprimé la variable 'inventory' locale ici.
  // On utilise celle reçue en props.

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
  ];

  const settings = [
    { icon: Bell, label: "Notifications" },
    { icon: UserPlus, label: "Inviter un pote de galère" },
    { icon: HelpCircle, label: "Support" },
    { icon: Trash2, label: "Reset Save (Dev)", action: "reset", danger: true },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER: CARTE D'IDENTITÉ */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={["#0A0A0A", "#2D1B4E", "#0A0A0A"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.identityCard}
        >
          <View style={styles.avatarSection}>
            <View style={styles.avatarGlowContainer}>
              <Image
                source={{ uri: currentAvatar }}
                style={styles.avatarImage}
              />
              <View style={styles.pigeonBadge}>
                <Text style={{ fontSize: 12 }}>🕊️</Text>
              </View>
            </View>

            {/* On affiche le vrai pseudo */}
            <Text style={styles.pseudo}>{pseudo || "PigeonVoyageur"}</Text>

            <View style={styles.titleBadge}>
              <Text style={styles.titleText}>Navetteur Masochiste</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* STATS GRID */}
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

      {/* --- SHOP SKINS (Interactif) --- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Skins & Cosmétiques</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingHorizontal: 16 }}>
          
          {/* On utilise l'inventaire qui vient de App.js */}
          {inventory && inventory.map((item, index) => {
            
            // 👇 DÉFINITION DE LA VARIABLE ICI (Dans la boucle)
            const isEquipped = currentAvatar === item.image;

            return (
              <TouchableOpacity 
                key={index} 
                // LOGIQUE DU CLIC : Si débloqué -> Équiper, Sinon -> Acheter
                onPress={() => item.unlocked ? onEquipSkin(item) : onBuySkin(item)}
                activeOpacity={item.unlocked ? 0.7 : 0.9}
                style={[
                  styles.skinCard, 
                  !item.unlocked && { opacity: 0.6, borderColor: '#444' },
                  // BORDURE VERTE SI ÉQUIPÉ
                  isEquipped && { borderColor: COLORS.neonGreen, borderWidth: 2, backgroundColor: 'rgba(57, 255, 20, 0.1)' }
                ]}
              >
                <Text style={styles.skinEmoji}>{item.emoji}</Text>
                
                {/* LOGIQUE D'AFFICHAGE */}
                {isEquipped ? (
                  // Badge ACTIF
                  <View style={styles.equippedBadge}>
                    <Text style={{color: 'black', fontSize: 8, fontWeight: 'bold'}}>ACTIF</Text>
                  </View>
                ) : !item.unlocked ? (
                  // Prix + Cadenas
                  <View style={styles.priceTag}>
                    <Lock size={10} color="#FF3B30" style={{marginRight: 4}}/>
                    <Text style={styles.priceText}>{item.price}</Text>
                  </View>
                ) : (
                  // Point vert (Possédé mais pas équipé)
                  <View style={styles.ownedDot} />
                )}
                
                <Text style={styles.skinName}>{item.name}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* BADGES */}
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
                      : COLORS.card,
                    borderColor: badge.unlocked ? badge.color : COLORS.border,
                  },
                ]}
              >
                <Text style={{ fontSize: 24 }}>{badge.icon}</Text>
              </View>
              <Text style={styles.badgeName} numberOfLines={1}>
                {badge.name}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* SETTINGS */}
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
              onPress={() => {
                if (setting.action === "reset" && onReset) {
                  onReset();
                }
              }}
            >
              <setting.icon
                size={20}
                color={setting.danger ? COLORS.neonRed : COLORS.textDim}
              />
              <Text
                style={[
                  styles.settingText,
                  setting.danger && { color: COLORS.neonRed }, // Le rouge écrase le blanc si danger
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
  container: { flex: 1, backgroundColor: COLORS.bg },
  section: { marginBottom: 24 },
  sectionTitle: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 12,
    marginLeft: 16,
  }, // Ajout marginLeft ici pour aligner

  // Header Identity Card (Styles existants...)
  headerContainer: { padding: 16, marginTop: 10 },
  identityCard: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(191, 90, 242, 0.3)",
  },
  avatarSection: { alignItems: "center" },
  avatarGlowContainer: {
    shadowColor: COLORS.neonGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 10,
    backgroundColor: "#0000",
    borderRadius: 50,
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
    bottom: -6,
    alignSelf: "center",
    backgroundColor: COLORS.neonGreen,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  pseudo: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 16,
  },
  titleBadge: {
    backgroundColor: "rgba(191, 90, 242, 0.1)",
    borderColor: COLORS.purple,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  titleText: { color: COLORS.purple, fontSize: 12, fontWeight: "600" },

  // Stats Grid
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 12,
  },
  statCard: {
    width: "48%",
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

  // Skins (Nouveaux Styles Shop)
  skinCard: {
    width: 100,
    height: 110,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  skinEmoji: { fontSize: 32, marginBottom: 14 },
  skinName: {
    color: COLORS.textDim,
    fontSize: 10,
    position: "absolute",
    bottom: 10,
  },

  priceTag: {
    position: "absolute",
    top: 6,
    right: 6,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  priceText: { color: "#FF3B30", fontSize: 10, fontWeight: "bold" },
  ownedDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.neonGreen,
  },

  // Badges Grid
  badgeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 12,
  },
  badgeCard: { width: "30.5%", alignItems: "center", marginBottom: 8 },
  badgeIconBox: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  badgeName: { color: COLORS.textDim, fontSize: 10, textAlign: "center" },

  // Settings
  settingsList: { paddingHorizontal: 16, gap: 8 },
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
  settingText: { color: "#D1D1D6", fontWeight: "500" },
  // ...
  equippedBadge: {
    position: 'absolute', top: 6, right: 6,
    backgroundColor: COLORS.neonGreen,
    paddingHorizontal: 6, paddingVertical: 2,
    borderRadius: 8,
  },
});
