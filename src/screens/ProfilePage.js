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

// Imports
import { COLORS } from "../constants/theme";
import { useGame } from "../context/GameContext";
import {
  PROFILE_BADGES,
  PROFILE_SETTINGS,
  getProfileStats,
} from "../constants/data";
import { Avatar } from "../components/Avatar"; // Utilise le composant maître
import { Aura } from "../components/Aura"; // Pour la prévisualisation shop
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LottieAura } from "../components/LottieAura";

export function ProfilePage() {
  const insets = useSafeAreaInsets();
  // 👇 RÉCUPÉRATION DES FONCTIONS DEPUIS LE CONTEXTE (Noms corrects)
  const {
    balance,
    userPseudo,
    inventory,
    currentAvatar,
    buySkin, // <--- S'appelle buySkin, pas onBuySkin
    equipSkin, // <--- S'appelle equipSkin, pas onEquipSkin
    resetData,
  } = useGame();

  // Stats dynamiques
  const stats = getProfileStats(balance);

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={{ paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={["#0A0A0A", "#2D1B4E", "#0A0A0A"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.identityCard}
        >
          <View style={styles.avatarSection}>
            {/* Avatar Maître avec Aura active */}
            <Avatar
              uri="https://i.pravatar.cc/150?img=11"
              pseudo={userPseudo}
              skin={currentAvatar} // On passe l'objet skin complet
              size={100}
              borderColor={COLORS.purple}
              glow={true}
            />
            <Text style={styles.pseudo}>{userPseudo || "PigeonVoyageur"}</Text>
            <View style={styles.titleBadge}>
              <Text style={styles.titleText}>Navetteur Masochiste</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* STATS */}
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

      {/* SHOP (Auras) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Skins & Cosmétiques</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12, paddingHorizontal: 16 }}
        >
          {inventory &&
            inventory.map((item, index) => {
              // On vérifie si c'est l'aura actuelle (par ID)
              // Note: On ajoute une sécurité (currentAvatar?.id) car currentAvatar peut être null au début
              const isEquipped =
                currentAvatar?.id && item.id && currentAvatar.id === item.id;
              return (
                <TouchableOpacity
                  key={index}
                  // 👇 CORRECTION ICI : Utilisation de equipSkin / buySkin
                  onPress={() =>
                    item.unlocked ? equipSkin(item) : buySkin(item)
                  }
                  activeOpacity={item.unlocked ? 0.7 : 0.9}
                  style={[
                    styles.skinCard,
                    !item.unlocked && { opacity: 0.6, borderColor: "#444" },
                    isEquipped && {
                      borderColor: COLORS.neonGreen,
                      borderWidth: 2,
                      backgroundColor: "rgba(57, 255, 20, 0.1)",
                    },
                  ]}
                >
                  {/* APERÇU DE L'AURA DANS LE SHOP */}
                  <View
                    style={{
                      width: 50,
                      height: 50,
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 10,
                    }}
                  >
                    {/* On n'affiche l'aura que si ce n'est pas le skin par défaut "none" */}
                    {item.type !== "none" && (
                      <Aura type={item.type} colors={item.colors} size={50} />
                    )}

                    {(item.type === "lottie" ||
                      item.type === "lottie_media" ||
                      item.type === "external_lottie") && (
                      <LottieAura
                        source={item.source}
                        size={50}
                        scale={item.scale || 1.5}
                      />
                    )}
                    <Text style={{ fontSize: 24, zIndex: 10 }}>
                      {item.emoji}
                    </Text>
                  </View>

                  {/* Indicateurs (Cadenas / Actif) */}
                  {isEquipped ? (
                    <View style={styles.equippedBadge}>
                      <Text
                        style={{
                          color: "black",
                          fontSize: 8,
                          fontWeight: "bold",
                        }}
                      >
                        ACTIF
                      </Text>
                    </View>
                  ) : !item.unlocked ? (
                    <View style={styles.priceTag}>
                      <Lock
                        size={10}
                        color="#FF3B30"
                        style={{ marginRight: 4 }}
                      />
                      <Text style={styles.priceText}>{item.price}</Text>
                    </View>
                  ) : (
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
          {PROFILE_BADGES.map((badge, index) => (
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
          {PROFILE_SETTINGS.map((setting, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.settingRow,
                setting.danger && { borderColor: "rgba(255,59,48,0.3)" },
              ]}
              onPress={() => setting.action === "reset" && resetData()}
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  section: { marginBottom: 24 },
  sectionTitle: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 12,
    marginLeft: 16,
  },
  headerContainer: { padding: 16, marginTop: 10 },
  identityCard: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(191, 90, 242, 0.3)",
  },
  avatarSection: { alignItems: "center" },
  // avatarGlowContainer n'est plus nécessaire car géré par Avatar.js, mais on peut garder pour l'espacement
  // avatarImage non plus...
  pigeonBadge: {
    position: "absolute",
    bottom: -6,
    alignSelf: "center",
    backgroundColor: COLORS.neonGreen,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    zIndex: 20,
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

  // Style Skin Card
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
    overflow: "hidden", // Pour que l'aura ne dépasse pas de la carte shop
  },
  skinEmoji: { fontSize: 32 }, // Plus besoin de margin car centré dans la View
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
    zIndex: 20,
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
    zIndex: 20,
  },
  equippedBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: COLORS.neonGreen,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    zIndex: 20,
  },

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
  settingText: { color: COLORS.white, fontWeight: "500", fontSize: 14 },
});
