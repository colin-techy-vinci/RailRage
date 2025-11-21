import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Image } from 'react-native';
import { Crown, Users, Globe, Plus, Clock } from 'lucide-react-native';

const COLORS = {
  bg: '#0A0A0A',
  card: '#1C1C1E',
  border: '#2A2A2E',
  neonGreen: '#39FF14',
  neonRed: '#FF3B30',
  textDim: '#8E8E93',
  white: '#FFFFFF',
  gold: '#FFD700',
  silver: '#C0C0C0',
  bronze: '#CD7F32',
};

// --- COMPOSANT AVATAR AMÉLIORÉ (Gère Texte ET Images) ---
const Avatar = ({ fallback, size = 40, color, border = false }) => {
  // On vérifie si le "fallback" est une URL d'image (commence par http)
  const isImage = fallback && fallback.startsWith('http');

  return (
    <View style={[
      styles.avatarContainer, 
      { width: size, height: size, borderRadius: size / 2, backgroundColor: color || '#333' },
      border && { borderWidth: 2, borderColor: COLORS.white },
      // Si c'est une image, on cache ce qui dépasse pour garder le rond
      isImage && { overflow: 'hidden', backgroundColor: 'transparent', borderWidth: 0 } 
    ]}>
      {isImage ? (
        <Image 
          source={{ uri: fallback }} 
          style={{ width: '100%', height: '100%' }} 
        />
      ) : (
        <Text style={[styles.avatarText, { fontSize: size * 0.4 }]}>{fallback}</Text>
      )}
    </View>
  );
};

export function LeaderboardPage({ navigation, friends, onAddFriend, myPseudo, myScore, myAvatar }) {
  
  const [activeTab, setActiveTab] = useState('GLOBAL'); 
  const [isModalVisible, setModalVisible] = useState(false);
  const [newFriendName, setNewFriendName] = useState('');
  const [timeLeft, setTimeLeft] = useState("");

  // --- LOGIQUE DU TIMER (Dimanche 20h) ---
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const target = new Date();

      // Trouver le prochain Dimanche (0 = Dimanche)
      const dayOfWeek = now.getDay();
      const daysUntilSunday = (7 - dayOfWeek) % 7;
      
      target.setDate(now.getDate() + daysUntilSunday);
      target.setHours(20, 0, 0, 0); // À 20h00

      // Si on est déjà dimanche après 20h, on vise dimanche prochain
      if (target <= now) {
        target.setDate(target.getDate() + 7);
      }

      const diff = target - now;
      
      // Conversion en H M S
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24 + (Math.floor(diff / (1000 * 60 * 60 * 24)) * 24)); // Total heures
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      // Formatage avec des zéros (04h 02m 09s)
      return `${hours}h ${minutes < 10 ? '0'+minutes : minutes}m ${seconds < 10 ? '0'+seconds : seconds}s`;
    };

    // Mise à jour initiale
    setTimeLeft(calculateTimeLeft());

    // Intervalle chaque seconde
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);


  // --- DONNÉES ---
  const globalData = [
    { rank: 1, pseudo: "RailMaster", avatar: "RM", score: 15400 },
    { rank: 2, pseudo: "TGV_Killer", avatar: "TK", score: 12800 },
    { rank: 3, pseudo: "PigeonPro", avatar: "PP", score: 9500 },
    { rank: 4, pseudo: "DelayKing", avatar: "DK", score: 8900 },
    { rank: 5, pseudo: "SNCB_Lover", avatar: "SL", score: 7650 },
  ];

  // Préparer la liste (On utilise myAvatar ici !)
  const myProfile = { 
    id: 'me', 
    pseudo: myPseudo || "Moi", 
    avatar: myAvatar, // <--- ICI C'EST TON URL D'IMAGE
    score: myScore || 450, 
    isMe: true, 
    color: COLORS.neonGreen 
  };

  const friendsListSorted = [...friends, myProfile].sort((a, b) => b.score - a.score);
  const friendsData = friendsListSorted.map((item, index) => ({ ...item, rank: index + 1 }));

  const currentList = activeTab === 'GLOBAL' ? globalData : friendsData;
  const top3 = currentList.slice(0, 3);
  const others = currentList.slice(3);

  const submitFriend = () => {
    if (newFriendName.trim().length < 2) return;
    onAddFriend(newFriendName);
    setNewFriendName('');
    setModalVisible(false);
  };

  const getRankColor = (rank, defaultColor) => {
    if (rank === 1) return COLORS.gold;
    if (rank === 2) return COLORS.silver;
    if (rank === 3) return COLORS.bronze;
    return defaultColor || COLORS.white;
  };

  const renderPodiumPlayer = (player, size, isFirst = false) => {
    const rankColor = getRankColor(player.rank, player.color);
    const dynamicGlowStyle = {
      shadowColor: rankColor, shadowOffset: { width: 0, height: 0 }, shadowOpacity: isFirst ? 1 : 0.8, shadowRadius: isFirst ? 25 : 15, elevation: 10, backgroundColor: '#0000', borderRadius: size / 2,
    };

    return (
      <View style={[styles.podiumCol, isFirst && { marginBottom: 20 }]}> 
        {isFirst && <Crown size={24} color={COLORS.gold} style={{ marginBottom: 4 }} />}
        
        <View style={[styles.podiumAvatarWrapper, dynamicGlowStyle]}>
          <Avatar fallback={player.avatar} size={size} color={rankColor} border={true} />
          <View style={[styles.rankBadge, { backgroundColor: rankColor }]}>
            <Text style={styles.rankBadgeText}>{player.rank}</Text>
          </View>
        </View>

        <Text style={[styles.podiumPseudo, { color: player.isMe ? COLORS.neonGreen : rankColor }]}>
          {player.pseudo}
        </Text>
        <View style={[styles.xpBadge, { borderColor: rankColor }]}>
          <Text style={[styles.xpText, { color: rankColor }]}>{player.score} XP</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.mainContainer}>
      
      <View style={styles.header}>
        <Text style={styles.title}>CLASSEMENT</Text>

        {/* --- TIMER --- */}
        <View style={styles.timerContainer}>
          <Clock size={14} color={COLORS.neonRed} />
          <Text style={styles.timerLabel}>RESET DANS :</Text>
          <Text style={styles.timerValue}>{timeLeft}</Text>
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity style={[styles.tabBtn, activeTab === 'GLOBAL' && styles.tabBtnActive]} onPress={() => setActiveTab('GLOBAL')}>
            <Globe size={16} color={activeTab === 'GLOBAL' ? 'black' : COLORS.textDim} />
            <Text style={[styles.tabText, activeTab === 'GLOBAL' && {color:'black'}]}>Monde</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tabBtn, activeTab === 'FRIENDS' && styles.tabBtnActive]} onPress={() => setActiveTab('FRIENDS')}>
            <Users size={16} color={activeTab === 'FRIENDS' ? 'black' : COLORS.textDim} />
            <Text style={[styles.tabText, activeTab === 'FRIENDS' && {color:'black'}]}>Amis</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        
        {/* PODIUM */}
        <View style={styles.podiumContainer}>
          {top3[1] && renderPodiumPlayer(top3[1], 64)}
          {top3[0] && renderPodiumPlayer(top3[0], 80, true)}
          {top3[2] && renderPodiumPlayer(top3[2], 64)}
        </View>

        {/* LISTE */}
        <View style={styles.listContainer}>
          {others.map((user) => (
            <View key={user.rank} style={[styles.rankRow, user.isMe && styles.myRow]}>
              <View style={styles.rankRowLeft}>
                <Text style={styles.rankNumber}>#{user.rank}</Text>
                <Avatar fallback={user.avatar} size={40} color={user.color || COLORS.border} />
                <Text style={[styles.rankPseudo, user.isMe && {color: COLORS.neonGreen}]}>{user.pseudo}</Text>
              </View>
              <Text style={styles.rankScore}>{user.score} XP</Text>
            </View>
          ))}
        </View>

        {activeTab === 'FRIENDS' && (
           <TouchableOpacity style={styles.addFriendBtn} onPress={() => setModalVisible(true)}>
             <Plus color="black" size={20} />
             <Text style={{color: 'black', fontWeight: 'bold', marginLeft: 8}}>AJOUTER UN RIVAL</Text>
           </TouchableOpacity>
        )}

        {/* Sticky Card (Moi) */}
        <View style={styles.myRankCard}>
           <View style={styles.stickyContent}>
              <View style={styles.stickyRow}>
                 <View style={styles.stickyUserInfo}>
                    {/* Affiche aussi ton avatar image ici */}
                    <Avatar fallback={myAvatar} size={40} color={COLORS.neonGreen} border={true} />
                    <View>
                       <Text style={styles.stickyText}>Tu es #{activeTab === 'GLOBAL' ? '458' : friendsData.find(f => f.isMe)?.rank}</Text>
                       <Text style={styles.shameText}>(Honteux)</Text>
                    </View>
                 </View>
                 <Text style={styles.stickyScore}>{myScore} XP</Text>
              </View>
              <TouchableOpacity style={styles.stickyButton} onPress={() => navigation.navigate('Recherche')}>
                 <Text style={styles.stickyButtonText}>Parier pour remonter</Text>
              </TouchableOpacity>
           </View>
        </View>
      </ScrollView>

      {/* MODALE */}
      <Modal visible={isModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>SCANNER UN MATRICULE</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Pseudo du pote..." 
              placeholderTextColor="#666"
              value={newFriendName}
              onChangeText={setNewFriendName}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={{color: 'white'}}>ANNULER</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmBtn} onPress={submitFriend}>
                <Text style={{color: 'black', fontWeight:'bold'}}>AJOUTER</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: COLORS.bg },
  
  header: { alignItems: 'center', paddingTop: 20, paddingBottom: 10, backgroundColor: COLORS.bg, zIndex: 10 },
  title: { color: COLORS.white, fontSize: 24, fontWeight: 'bold', letterSpacing: 2, marginBottom: 8 },
  
  // Styles du Timer
  timerContainer: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16, backgroundColor: 'rgba(255, 59, 48, 0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255, 59, 48, 0.3)' },
  timerLabel: { color: COLORS.neonRed, fontSize: 10, fontWeight: 'bold' },
  timerValue: { color: COLORS.white, fontSize: 12, fontWeight: 'bold', fontVariant: ['tabular-nums'] }, // tabular-nums évite que le texte bouge quand les chiffres changent

  tabContainer: { flexDirection: 'row', backgroundColor: COLORS.card, borderRadius: 25, padding: 4, borderWidth: 1, borderColor: COLORS.border },
  tabBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20, gap: 8 },
  tabBtnActive: { backgroundColor: COLORS.neonGreen },
  tabText: { color: COLORS.textDim, fontWeight: 'bold', fontSize: 12 },

  // Podium & List
  podiumContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', paddingVertical: 30 },
  podiumCol: { alignItems: 'center', width: '30%' },
  podiumAvatarWrapper: { marginBottom: 10 },
  rankBadge: { position: 'absolute', top: -5, right: -5, width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  rankBadgeText: { color: 'black', fontSize: 10, fontWeight: 'bold' },
  podiumPseudo: { fontWeight: 'bold', fontSize: 12, marginBottom: 2, textAlign: 'center' },
  xpBadge: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, backgroundColor: COLORS.card },
  xpText: { fontSize: 10, fontWeight: 'bold' },
  avatarContainer: { justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: 'white', fontWeight: 'bold' },

  listContainer: { paddingHorizontal: 16 },
  rankRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.card, padding: 12, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: COLORS.border },
  myRow: { borderColor: COLORS.neonGreen, backgroundColor: 'rgba(57, 255, 20, 0.05)' },
  rankRowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rankNumber: { color: COLORS.textDim, width: 30, fontWeight: 'bold' },
  rankPseudo: { color: COLORS.white, fontWeight: '600' },
  rankScore: { color: '#D1D1D6', fontSize: 12 },

  addFriendBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.neonGreen, marginHorizontal: 16, padding: 12, borderRadius: 12, marginTop: 10 },
  myRankCard: { marginTop: 24, paddingHorizontal: 16, marginBottom: 20 },
  stickyContent: { backgroundColor: 'rgba(44, 44, 46, 0.6)', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: COLORS.neonGreen },
  stickyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  stickyUserInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stickyText: { color: COLORS.white, fontWeight: '600' },
  shameText: { color: COLORS.neonRed, fontSize: 12 },
  stickyScore: { color: '#D1D1D6' },
  stickyButton: { backgroundColor: COLORS.neonGreen, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  stickyButtonText: { color: 'black', fontWeight: 'bold' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '80%', backgroundColor: '#1C1C1E', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: COLORS.neonGreen },
  modalTitle: { color: COLORS.white, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: { backgroundColor: '#0A0A0A', color: 'white', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#333', marginBottom: 20 },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between' },
  cancelBtn: { padding: 10 },
  confirmBtn: { backgroundColor: COLORS.neonGreen, padding: 10, borderRadius: 8, paddingHorizontal: 20 },
});