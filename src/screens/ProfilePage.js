import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { Lock } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Imports Clean
import { COLORS } from "../constants/theme";
import { useGame } from "../context/GameContext";
import { PROFILE_BADGES, PROFILE_SETTINGS, getProfileStats } from "../constants/data";

export function ProfilePage() {
  const { 
    balance, userPseudo, inventory, currentAvatar, 
    buySkin, equipSkin, resetData 
  } = useGame();

  const insets = useSafeAreaInsets();

  // On génère les stats dynamiques avec la balance actuelle
  const stats = getProfileStats(balance);

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top}]} contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
      
      {/* HEADER */}
      <View style={styles.headerContainer}>
        <LinearGradient colors={["#0A0A0A", "#2D1B4E", "#0A0A0A"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.identityCard}>
          <View style={styles.avatarSection}>
            <View style={styles.avatarGlowContainer}>
              <Image source={{ uri: currentAvatar }} style={styles.avatarImage} />
              <View style={styles.pigeonBadge}><Text style={{ fontSize: 12 }}>🕊️</Text></View>
            </View>
            <Text style={styles.pseudo}>{userPseudo || "PigeonVoyageur"}</Text>
            <View style={styles.titleBadge}><Text style={styles.titleText}>Navetteur Masochiste</Text></View>
          </View>
        </LinearGradient>
      </View>

      {/* STATS (Utilise la variable générée plus haut) */}
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

      {/* SHOP (Reste inchangé car il utilise 'inventory' du context) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Skins & Cosmétiques</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingHorizontal: 16 }}>
          {inventory && inventory.map((item, index) => {
            const isEquipped = currentAvatar === item.image;
            return (
              <TouchableOpacity 
                key={index} 
                onPress={() => item.unlocked ? equipSkin(item) : buySkin(item)}
                activeOpacity={item.unlocked ? 0.7 : 0.9}
                style={[
                  styles.skinCard, 
                  !item.unlocked && { opacity: 0.6, borderColor: '#444' },
                  isEquipped && { borderColor: COLORS.neonGreen, borderWidth: 2, backgroundColor: 'rgba(57, 255, 20, 0.1)' }
                ]}
              >
                <Text style={styles.skinEmoji}>{item.emoji}</Text>
                {isEquipped ? (
                  <View style={styles.equippedBadge}><Text style={{color: 'black', fontSize: 8, fontWeight: 'bold'}}>ACTIF</Text></View>
                ) : !item.unlocked ? (
                  <View style={styles.priceTag}>
                    <Lock size={10} color="#FF3B30" style={{marginRight: 4}}/>
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

      {/* BADGES (Importé de data.js) */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { marginLeft: 16 }]}>Salle des Trophées</Text>
        <View style={styles.badgeGrid}>
          {PROFILE_BADGES.map((badge, index) => (
            <View key={index} style={[styles.badgeCard, !badge.unlocked && { opacity: 0.3 }]}>
              <View style={[styles.badgeIconBox, { backgroundColor: badge.unlocked ? `${badge.color}20` : COLORS.card, borderColor: badge.unlocked ? badge.color : COLORS.border }]}>
                <Text style={{ fontSize: 24 }}>{badge.icon}</Text>
              </View>
              <Text style={styles.badgeName} numberOfLines={1}>{badge.name}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* SETTINGS (Importé de data.js) */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { marginLeft: 16 }]}>Paramètres</Text>
        <View style={styles.settingsList}>
          {PROFILE_SETTINGS.map((setting, index) => (
            <TouchableOpacity 
              key={index} 
              style={[styles.settingRow, setting.danger && { borderColor: "rgba(255,59,48,0.3)" }]}
              onPress={() => setting.action === "reset" && resetData()}
            >
              <setting.icon size={20} color={setting.danger ? COLORS.neonRed : COLORS.textDim} />
              <Text style={[styles.settingText, setting.danger && { color: COLORS.neonRed }]}>
                {setting.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={{ padding: 20, alignItems: "center" }}>
        <Text style={{ color: "#444", fontSize: 10 }}>v1.0.0 - Made with rage in Belgium 🇧🇪</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  section: { marginBottom: 24 },
  sectionTitle: { color: COLORS.white, fontWeight: "bold", fontSize: 16, marginBottom: 12, marginLeft: 16 },
  headerContainer: { padding: 16, marginTop: 10 },
  identityCard: { borderRadius: 24, padding: 24, borderWidth: 1, borderColor: "rgba(191, 90, 242, 0.3)" },
  avatarSection: { alignItems: "center" },
  avatarGlowContainer: { shadowColor: COLORS.purple, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1.6, shadowRadius: 15, elevation: 10, backgroundColor: "#0000", borderRadius: 50 },
  avatarImage: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: COLORS.purple },
  pigeonBadge: { position: "absolute", bottom: -6, alignSelf: "center", backgroundColor: COLORS.neonGreen, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  pseudo: { color: COLORS.white, fontSize: 24, fontWeight: "bold", marginBottom: 8, marginTop: 16 },
  titleBadge: { backgroundColor: "rgba(191, 90, 242, 0.1)", borderColor: COLORS.purple, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  titleText: { color: COLORS.purple, fontSize: 12, fontWeight: "600" },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 16, gap: 12 },
  statCard: { width: "48%", backgroundColor: COLORS.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: COLORS.border },
  statIcon: { fontSize: 24, marginBottom: 8 },
  statValue: { color: COLORS.white, fontSize: 20, fontWeight: "bold", marginBottom: 2 },
  statLabel: { color: COLORS.textDim, fontSize: 12 },
  skinCard: { width: 100, height: 110, backgroundColor: COLORS.card, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, alignItems: "center", justifyContent: "center", position: "relative" },
  skinEmoji: { fontSize: 32, marginBottom: 14 },
  skinName: { color: COLORS.textDim, fontSize: 10, position: "absolute", bottom: 10 },
  priceTag: { position: "absolute", top: 6, right: 6, flexDirection: "row", alignItems: "center", backgroundColor: "rgba(0,0,0,0.6)", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  priceText: { color: "#FF3B30", fontSize: 10, fontWeight: "bold" },
  ownedDot: { position: "absolute", top: 8, right: 8, width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.neonGreen },
  equippedBadge: { position: 'absolute', top: 6, right: 6, backgroundColor: COLORS.neonGreen, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  badgeGrid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 16, gap: 12 },
  badgeCard: { width: "30.5%", alignItems: "center", marginBottom: 8 },
  badgeIconBox: { width: "100%", aspectRatio: 1, borderRadius: 16, borderWidth: 2, alignItems: "center", justifyContent: "center", marginBottom: 6 },
  badgeName: { color: COLORS.textDim, fontSize: 10, textAlign: "center" },
  settingsList: { paddingHorizontal: 16, gap: 8 },
  settingRow: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.card, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, gap: 12 },
  settingText: { color: COLORS.white, fontWeight: "500", fontSize: 14 },
});