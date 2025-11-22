import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Crown, Users, Globe, Plus, Clock } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Imports
import { COLORS } from '../constants/theme';
import { useGame } from '../context/GameContext';
import { Avatar } from '../components/Avatar'; // On utilise le composant global !

export function LeaderboardPage({ navigation }) {
  const insets = useSafeAreaInsets();
  
  // Connexion au Cerveau
  const { friends, addFriend, userPseudo, balance, currentAvatar } = useGame();

  const [activeTab, setActiveTab] = useState('GLOBAL'); 
  const [isModalVisible, setModalVisible] = useState(false);
  const [newFriendName, setNewFriendName] = useState('');
  const [timeLeft, setTimeLeft] = useState("");

  // Timer
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const target = new Date();
      const dayOfWeek = now.getDay();
      const daysUntilSunday = (7 - dayOfWeek) % 7;
      target.setDate(now.getDate() + daysUntilSunday);
      target.setHours(20, 0, 0, 0);
      if (target <= now) target.setDate(target.getDate() + 7);
      const diff = target - now;
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24 + (Math.floor(diff / (1000 * 60 * 60 * 24)) * 24));
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      return `${hours}h ${minutes < 10 ? '0'+minutes : minutes}m ${seconds < 10 ? '0'+seconds : seconds}s`;
    };
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => { setTimeLeft(calculateTimeLeft()); }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Données Globales
  const globalData = [
    { rank: 1, pseudo: "RailMaster", avatar: "RM", score: 15400 },
    { rank: 2, pseudo: "TGV_Killer", avatar: "TK", score: 12800 },
    { rank: 3, pseudo: "PigeonPro", avatar: "PP", score: 9500 },
    { rank: 4, pseudo: "DelayKing", avatar: "DK", score: 8900 },
    { rank: 5, pseudo: "SNCB_Lover", avatar: "SL", score: 7650 },
  ];

  // Préparer la liste (Moi + Amis)
  const myProfile = { 
    id: 'me', 
    pseudo: userPseudo || "Moi", 
    // Note: myProfile stocke l'objet skin complet dans 'avatar' pour qu'on puisse le passer au composant Avatar
    avatar: currentAvatar, 
    score: balance || 450, // On utilise la balance comme score
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
    addFriend(newFriendName);
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
    
    // On gère le cas où l'avatar est un objet skin (pour moi) ou juste des initiales (amis/global)
    // Si c'est moi, 'player.avatar' contient l'objet skin complet
    // Si c'est un ami généré, il n'a pas de skin pour l'instant, donc on passe null
    const skinToPass = player.isMe ? player.avatar : null;
    const pseudoToPass = typeof player.avatar === 'string' ? player.avatar : player.pseudo;

    return (
      <View style={[styles.podiumCol, isFirst && { marginBottom: 20 }]}> 
        {isFirst && <Crown size={24} color={COLORS.gold} style={{ marginBottom: 4 }} />}
        
        <View style={{ marginBottom: 10 }}>
          <Avatar 
            pseudo={pseudoToPass} // Initiales
            skin={skinToPass}     // Aura (si c'est moi)
            size={size} 
            borderColor={rankColor}
            // Pas de bordure violette ici, on veut la couleur du rang !
          />
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
    <View style={[styles.mainContainer, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <Text style={styles.title}>CLASSEMENT</Text>
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

        <View style={styles.podiumContainer}>
          {top3[1] && renderPodiumPlayer(top3[1], 64)}
          {top3[0] && renderPodiumPlayer(top3[0], 80, true)}
          {top3[2] && renderPodiumPlayer(top3[2], 64)}
        </View>

        <View style={styles.listContainer}>
          {others.map((user) => (
            <View key={user.rank} style={[styles.rankRow, user.isMe && styles.myRow]}>
              <View style={styles.rankRowLeft}>
                <Text style={styles.rankNumber}>#{user.rank}</Text>
                
                <Avatar 
                  pseudo={typeof user.avatar === 'string' ? user.avatar : user.pseudo}
                  skin={user.isMe ? user.avatar : null}
                  size={40} 
                  borderColor={user.color || COLORS.border} 
                />

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

        <View style={styles.myRankCard}>
           <View style={styles.stickyContent}>
              <View style={styles.stickyRow}>
                 <View style={styles.stickyUserInfo}>
                    <Avatar 
                      uri="https://i.pravatar.cc/150?img=11" 
                      skin={currentAvatar} 
                      size={40} 
                      borderColor={COLORS.neonGreen} 
                    />
                    <View>
                       <Text style={styles.stickyText}>Tu es #{activeTab === 'GLOBAL' ? '458' : friendsData.find(f => f.isMe)?.rank}</Text>
                       <Text style={styles.shameText}>(Honteux)</Text>
                    </View>
                 </View>
                 <Text style={styles.stickyScore}>{balance} XP</Text>
              </View>
              <TouchableOpacity style={styles.stickyButton} onPress={() => navigation.navigate('Recherche')}>
                 <Text style={styles.stickyButtonText}>Parier pour remonter</Text>
              </TouchableOpacity>
           </View>
        </View>
      </ScrollView>

      <Modal visible={isModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>SCANNER UN MATRICULE</Text>
            <TextInput style={styles.input} placeholder="Pseudo du pote..." placeholderTextColor="#666" value={newFriendName} onChangeText={setNewFriendName} />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}><Text style={{color: 'white'}}>ANNULER</Text></TouchableOpacity>
              <TouchableOpacity style={styles.confirmBtn} onPress={submitFriend}><Text style={{color: 'black', fontWeight:'bold'}}>AJOUTER</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: COLORS.bg },
  header: { alignItems: 'center', paddingBottom: 10, marginBottom: 10 }, // Header propre au scrollview
  title: { color: COLORS.white, fontSize: 24, fontWeight: 'bold', letterSpacing: 2, marginBottom: 8 },
  timerContainer: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16, backgroundColor: 'rgba(255, 59, 48, 0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255, 59, 48, 0.3)' },
  timerLabel: { color: COLORS.neonRed, fontSize: 10, fontWeight: 'bold' },
  timerValue: { color: COLORS.white, fontSize: 12, fontWeight: 'bold', fontVariant: ['tabular-nums'] },
  tabContainer: { flexDirection: 'row', backgroundColor: COLORS.card, borderRadius: 25, padding: 4, borderWidth: 1, borderColor: COLORS.border },
  tabBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20, gap: 8 },
  tabBtnActive: { backgroundColor: COLORS.neonGreen },
  tabText: { color: COLORS.textDim, fontWeight: 'bold', fontSize: 12 },
  podiumContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', paddingVertical: 30 },
  podiumCol: { alignItems: 'center', width: '30%' },
  rankBadge: { position: 'absolute', top: -5, right: -5, width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  rankBadgeText: { color: 'black', fontSize: 10, fontWeight: 'bold' },
  podiumPseudo: { fontWeight: 'bold', fontSize: 12, marginBottom: 2, textAlign: 'center' },
  xpBadge: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, backgroundColor: COLORS.card },
  xpText: { fontSize: 10, fontWeight: 'bold' },
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