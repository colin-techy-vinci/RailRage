import React, { useEffect, useRef } from "react";
import { MapPin, Plus, Crown, RefreshCw } from "lucide-react-native"; // RefreshCw ajouté
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated
} from "react-native";

// --- PALETTE RAILRAGE ---
const COLORS = {
  bg: "#0A0A0A",
  card: "#1C1C1E",
  border: "#2A2A2E",
  neonGreen: "#39FF14",
  neonRed: "#FF3B30",
  white: "#FFFFFF",
  gold: "#FFD700",
};

// --- 1. LES SOUS-COMPOSANTS (Train, Bet, Leaderboard) ---

// Carte Train (Déjà vue, version simplifiée ici)
const TrainCard = ({ time, destination, status, delay }) => {
  const isDelayed = delay > 0;
  
  // Valeur d'animation pour l'opacité du FOND uniquement
  const bgOpacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isDelayed) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bgOpacityAnim, {
            toValue: 0.6, // On descend bas pour bien voir l'effet de "respiration"
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(bgOpacityAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      bgOpacityAnim.setValue(1);
    }
  }, [isDelayed]);

  // Couleurs
  // On force un rouge un peu plus visible pour le fond qui pulse
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
        {/* 1. Le Conteneur principal (Forme la pilule) */}
        <View style={[styles.badgeContainer, { borderColor: borderColor }]}>
          
          {/* 2. Le Fond Animé (Position Absolue derrière le texte) */}
          <Animated.View 
            style={[
              StyleSheet.absoluteFill, // Remplit tout le conteneur
              { backgroundColor: backgroundColor },
              isDelayed && { opacity: bgOpacityAnim } // SEUL LUI CLIGNOTE
            ]} 
          />

          {/* 3. Le Texte (Reste fixe et opaque) */}
          <Text style={[styles.statusText, { color: textColor }]}>
            {isDelayed ? `+${delay} min` : "À l'heure"}
          </Text>
          
        </View>
      </View>
    </View>
  );
};

// Carte Mise (Bet)
const BetCard = ({ trainNumber, bet, status, winAmount }) => {
  // Définition du style selon le statut
  let statusText = "En attente...";
  let statusColor = "#8E8E93"; // Gris
  let borderColor = COLORS.border;

  if (status === 'won') {
    statusText = `+${winAmount} 🪙`; // Affiche le gain
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
      
      <Text style={[styles.betStatus, { color: statusColor, fontWeight: 'bold' }]}>
        {statusText}
      </Text>

      {/* On cache la barre de tension si c'est fini, on affiche un Emoji à la place */}
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

// Item Leaderboard
const LeaderboardItem = ({ rank, pseudo, gain }) => (
  <View style={[styles.leaderRow, rank === 1 && styles.leaderRowFirst]}>
    <View style={styles.leaderLeft}>
      <Text
        style={[
          styles.rank,
          rank === 1 ? { color: COLORS.gold } : { color: "white" },
        ]}
      >
        #{rank}
      </Text>
      {/* Avatar Cercle */}
      <View
        style={[
          styles.avatarSmall,
          rank === 1 && { borderColor: COLORS.gold, borderWidth: 1 },
        ]}
      >
        <Text style={styles.avatarText}>
          {pseudo.substring(0, 2).toUpperCase()}
        </Text>
      </View>
      <Text style={styles.pseudo}>{pseudo}</Text>
    </View>

    <View style={styles.gainBadge}>
      {rank === 1 && (
        <Crown size={14} color="black" style={{ marginRight: 4 }} />
      )}
      <Text style={styles.gainText}>+{gain}</Text>
    </View>
  </View>
);

// --- 2. LA PAGE PRINCIPALE (HomePage) ---

export function HomePage({ bets, balance, onSimulate }) {
  // Données (copiées de ton code React)
  const trains = [
    { time: "18:12", destination: "Mons", status: "onTime", delay: 0 },
    {
      time: "18:25",
      destination: "Liège-Guillemins",
      status: "delayed",
      delay: 8,
    },
    { time: "18:34", destination: "Charleroi-Sud", status: "onTime", delay: 0 },
  ];

  const leaderboard = [
    { rank: 1, pseudo: "RailMaster", avatar: "RM", gain: 1200 },
    { rank: 2, pseudo: "TGV_Killer", avatar: "TK", gain: 980 },
    { rank: 3, pseudo: "PigeonPro", avatar: "PP", gain: 750 },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 120 }} // Espace pour la barre de nav en bas
      showsVerticalScrollIndicator={false}
    >
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View>
            <Image
              source={{
                uri: "https://scontent.fbru5-1.fna.fbcdn.net/v/t39.30808-6/465968573_9119371728081459_2795510261622361528_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=MioVz-HHf-4Q7kNvwF7H6kP&_nc_oc=AdnOoejUlMYitae1RnkqPmUsFL6Crk7csQ3ZUQBBQgHLQ5pzbNMr7Kc0SPfckUXvbmCDtKKW4cxEWdg00G8LZlip&_nc_zt=23&_nc_ht=scontent.fbru5-1.fna&_nc_gid=lddBXSVJjg5FaJUqlW9grA&oh=00_Afj3r2w84vS_gqkPSYGMCNRYgpZTO2zlQp1Nc_QWYx9pDQ&oe=692571DA",
              }} // Image temporaire
              style={styles.avatarMain}
            />
            {/* Badge Pigeon */}
            <View style={styles.badge}>
              <Text style={{ fontSize: 10 }}>🕊️</Text>
            </View>
          </View>
        </View>

        <View>
          <Text style={styles.appTitle}>RAILRAGE</Text>
        </View>

        <View style={styles.headerRight}>
          {/* Bloc Solde */}
          <View style={styles.coinBox}>
            <Text style={{ fontSize: 14 }}>🪙</Text>
            {/* On affiche la variable reçue ou 0 par sécurité */}
            <Text style={styles.coinText}>
              {balance !== undefined ? balance : 0}
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.plusBtn,
              { backgroundColor: "#BF5AF2", marginRight: 8 },
            ]}
            onPress={onSimulate}
          >
            <RefreshCw color="white" size={20} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.plusBtn}>
            <Plus color="black" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      {/* --- SECTION MA GARE --- */}
      <View style={styles.section}>
        <View style={styles.stationCard}>
          <View style={styles.stationHeader}>
            <MapPin color={COLORS.neonRed} size={20} />
            <Text style={styles.stationTitle}>Gare de Bruxelles-Midi</Text>
          </View>

          <View style={{ gap: 10 }}>
            {trains.map((train, index) => (
              <TrainCard key={index} {...train} />
            ))}
          </View>
        </View>
      </View>

      {/* --- SECTION PARIS EN COURS --- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mes Mises ({bets.length})</Text>

        {/* CONDITION : Si on a des paris, on affiche le scroll, sinon un message */}
        {bets.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 12 }}
          >
            {bets.map((bet, index) => (
              <BetCard key={index} {...bet} />
            ))}
          </ScrollView>
        ) : (
          // Message "État Vide" (Empty State)
          <View style={styles.emptyBetState}>
            <Text style={{ fontSize: 24 }}>🦗</Text>
            <Text style={styles.emptyBetText}>Aucun pari en cours.</Text>
            <Text style={styles.emptyBetSub}>
              Va au terminal pour perdre ton argent.
            </Text>
          </View>
        )}
      </View>

      {/* --- SECTION LEADERBOARD --- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Les Prophètes du Retard</Text>
        <View style={styles.leaderContainer}>
          {leaderboard.map((user) => (
            <LeaderboardItem key={user.rank} {...user} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    marginTop: 10,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  avatarMain: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: COLORS.neonGreen,
  },
  badge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    backgroundColor: COLORS.neonGreen,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: "hidden",
  },
  appTitle: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 4,
    fontFamily: "System", // Fallback pour Inter
  },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  // ... autres styles

  // 👇 AJOUTE CES STYLES QUI MANQUENT
  coinBox: {
    backgroundColor: COLORS.card,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginRight: 8, // Un peu d'espace avant le bouton +
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  coinText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 14,
  },

  // ... fin des styles
  plusBtn: {
    backgroundColor: COLORS.neonGreen,
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  // Sections General
  section: { marginBottom: 24 },
  sectionTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    marginLeft: 4,
  },

  // Station Card (Ma Gare)
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

  // Train Card Internal
  trainCard: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    borderBottomWidth: 1, 
    borderBottomColor: '#2C2C2E', 
    paddingVertical: 16, // Un peu plus d'espace vertical
  },
  trainTime: { 
    color: COLORS.white, 
    fontSize: 20, 
    fontWeight: 'bold' 
  },
  trainDest: { 
    color: '#8E8E93', 
    fontSize: 14, 
    marginTop: 2 
  },
  
  badgeContainer: {
    // C'est lui qui donne la forme
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden', // Important : coupe le fond animé s'il dépasse (arrondi)
    
    // Le padding est ici pour repousser les bords autour du texte
    paddingHorizontal: 12,
    paddingVertical: 6,
    
    // Nécessaire pour que le 'absoluteFill' du fond se cale sur ce bloc
    position: 'relative', 
  },
  statusText: { 
    fontWeight: 'bold', 
    fontSize: 12,
    // Le texte est au-dessus du fond (z-index implicite car déclaré après)
  },

  // Bet Card
  betCard: {
    width: 160,
    backgroundColor: COLORS.card,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  betHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  betTrain: { color: COLORS.white, fontWeight: "bold" },
  betAmount: { color: COLORS.neonGreen, fontSize: 12 },
  betStatus: { color: "#8E8E93", fontSize: 12, marginBottom: 8 },
  tensionContainer: { marginTop: 4 },
  tensionLabel: { color: "#555", fontSize: 10, marginBottom: 2 },
  progressBarBg: { height: 4, backgroundColor: "#333", borderRadius: 2 },
  progressBarFill: {
    height: 4,
    backgroundColor: COLORS.neonRed,
    borderRadius: 2,
  },

  // Leaderboard
  leaderContainer: { gap: 8 },
  leaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.card,
    padding: 12,
    borderRadius: 10,
  },
  leaderRowFirst: { borderColor: COLORS.gold, borderWidth: 1 },
  leaderLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  rank: { fontSize: 16, fontWeight: "bold", width: 20 },
  avatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#333",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "white", fontSize: 10, fontWeight: "bold" },
  pseudo: { color: "white", fontWeight: "600" },
  gainBadge: {
    backgroundColor: COLORS.neonGreen,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  gainText: { color: "black", fontWeight: "bold", fontSize: 12 },
  // ... styles existants
  emptyBetState: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: "dashed", // Bordure en pointillés style "Zone vide"
  },
  emptyBetText: {
    color: COLORS.white,
    fontWeight: "bold",
    marginTop: 8,
  },
  emptyBetSub: {
    color: "#8E8E93",
    fontSize: 12,
    marginTop: 4,
  },
});
