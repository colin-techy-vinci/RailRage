import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, Modal, Alert } from 'react-native';
import { Search, TrainFront, X, Coins, AlertTriangle } from 'lucide-react-native';
import { BlurView } from 'expo-blur';

const COLORS = {
  bg: '#0A0A0A',
  card: '#1C1C1E',
  neonGreen: '#39FF14',
  neonRed: '#FF3B30',
  textDim: '#8E8E93',
  white: '#FFFFFF',
  border: '#2A2A2E',
};

const FAKE_RESULTS = [
  { id: '1', train: 'IC 3405', route: 'Bruxelles-Midi → Mons', time: '18:42', type: 'IC', odds: 1.5 }, // Odds = Côte
  { id: '2', train: 'P 8002', route: 'Schaerbeek → Gand-St-Pierre', time: '18:45', type: 'P', odds: 2.1 },
  { id: '3', train: 'S1 1920', route: 'Anvers-Central → Nivelles', time: '18:52', type: 'S', odds: 1.2 },
  { id: '4', train: 'IC 1515', route: 'Liège → Paris Nord', time: '19:10', type: 'IC', odds: 3.5 },
  { id: '5', train: 'P 7000', route: 'Mouscron → Tournai', time: '19:15', type: 'P', odds: 1.8 },
];

export function SearchPage({onNavigate, onPlaceBet, balance}) {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('TOUS');
  
  
  // --- NOUVEAUX ÉTATS POUR LA MODALE ---
  const [selectedTrain, setSelectedTrain] = useState(null); // Le train qu'on clique
  const [betAmount, setBetAmount] = useState(50); // Montant par défaut

  // Ouvrir la modale
  const openBetModal = (train) => {
    setSelectedTrain(train);
    setBetAmount(50); // Reset montant
  };

  // Fermer la modale
  const closeBetModal = () => {
    setSelectedTrain(null);
  };

  // Simuler la validation
  const confirmBet = () => {
    if (!selectedTrain) return;

    // Création de l'objet pari
    const newBet = {
      id: Date.now().toString(), // ID unique
      trainNumber: selectedTrain.train.split(' ')[0] + selectedTrain.train.split(' ')[1], // Ex: "IC 3405" -> "IC3405"
      bet: betAmount,
      status: "pending",
      tension: Math.floor(Math.random() * 100), // Tension aléatoire pour le fun
    };

    // Appel de la fonction du parent (App.js)
    const success = onPlaceBet(newBet);

    if (success) {
      Alert.alert(
        "PARI VALIDÉ ! 💸",
        `Mise de ${betAmount} 🪙 acceptée.\nSolde restant : ${balance - betAmount} 🪙`,
        [
          { 
            text: "Voir mes paris", 
            onPress: () => {
              closeBetModal();
              onNavigate('home'); // Redirige vers l'accueil pour voir le résultat
            }
          }
        ]
      );
    }
  };

  const filteredData = FAKE_RESULTS.filter(item => 
    item.train.toLowerCase().includes(query.toLowerCase()) || 
    item.route.toLowerCase().includes(query.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.resultRow} 
      activeOpacity={0.7}
      onPress={() => openBetModal(item)} // Clic sur toute la ligne ouvre aussi
    >
      <View style={styles.trainIconBox}>
        <TrainFront size={20} color={COLORS.white} />
        <Text style={styles.trainType}>{item.type}</Text>
      </View>
      
      <View style={styles.trainInfo}>
        <Text style={styles.trainName}>{item.train}</Text>
        <Text style={styles.route}>{item.route}</Text>
      </View>

      <View style={styles.actionArea}>
        <Text style={styles.time}>{item.time}</Text>
        <TouchableOpacity 
          style={styles.betButton}
          onPress={() => openBetModal(item)}
        >
          <Text style={styles.betButtonText}>MISER</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.pageTitle}>TERMINAL DE RECHERCHE</Text>
        <View style={styles.searchBox}>
          <Search color={COLORS.textDim} size={20} />
          <TextInput
            style={styles.input}
            placeholder="N° Train, Gare..."
            placeholderTextColor={COLORS.textDim}
            value={query}
            onChangeText={setQuery}
            selectionColor={COLORS.neonGreen}
          />
        </View>
      </View>

      {/* LISTE */}
      <FlatList
        data={filteredData}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* --- LA MODALE DE PARI (Pop-up) --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={selectedTrain !== null}
        onRequestClose={closeBetModal}
      >
        {selectedTrain && (
          <View style={styles.modalOverlay}>
            {/* Blur arrière-plan */}
            <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />

            <View style={styles.modalContent}>
              {/* Header Modale */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>NOUVEAU PARI</Text>
                <TouchableOpacity onPress={closeBetModal}>
                  <X size={24} color={COLORS.textDim} />
                </TouchableOpacity>
              </View>

              {/* Info Train */}
              <View style={styles.trainSummary}>
                <View>
                  <Text style={styles.summaryTrain}>{selectedTrain.train}</Text>
                  <Text style={styles.summaryRoute}>{selectedTrain.route}</Text>
                </View>
                <View style={styles.oddsBadge}>
                  <Text style={styles.oddsLabel}>COTE</Text>
                  <Text style={styles.oddsValue}>x{selectedTrain.odds}</Text>
                </View>
              </View>

              {/* AJOUT : Indicateur de Solde */}
              <View style={{alignItems: 'center', marginBottom: 10}}>
                <Text style={{color: '#8E8E93', fontSize: 16}}>
                  Portefeuille : <Text style={{color: COLORS.white, fontWeight: 'bold'}}>{balance} 🪙</Text>
                </Text>
              </View>

              {/* Sélecteur de Mise */}
              <Text style={styles.sectionLabel}>MONTANT DE LA MISE</Text>
              <View style={styles.amountSelector}>
                <TouchableOpacity 
                  style={styles.amountBtn} 
                  onPress={() => setBetAmount(Math.max(10, betAmount - 10))}
                >
                  <Text style={styles.amountBtnText}>-</Text>
                </TouchableOpacity>
                
                <View style={styles.amountDisplay}>
                  <Text style={styles.amountText}>{betAmount}</Text>
                  <Coins size={16} color={COLORS.gold} />
                </View>

                <TouchableOpacity 
                  style={styles.amountBtn} 
                  onPress={() => setBetAmount(betAmount + 10)}
                >
                  <Text style={styles.amountBtnText}>+</Text>
                </TouchableOpacity>
              </View>

              {/* Calcul Gains */}
              <View style={styles.gainBox}>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                  <AlertTriangle size={18} color={COLORS.neonGreen} />
                  <Text style={styles.gainLabel}>GAIN POTENTIEL</Text>
                </View>
                <Text style={styles.gainValue}>
                  {/* Ajout du '?' après selectedTrain et '|| 0' au cas où */}
                  {selectedTrain ? Math.floor(betAmount * selectedTrain.odds) : 0} 🪙
                </Text>
              </View>

              {/* Bouton Valider */}
              <TouchableOpacity style={styles.confirmButton} onPress={confirmBet}>
                <Text style={styles.confirmText}>VALIDER LE PARI</Text>
              </TouchableOpacity>
              
              <Text style={styles.disclaimer}>
                Mise non remboursable si le train arrive à l heure (lol).
              </Text>

            </View>
          </View>
        )}
      </Modal>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // ... (Styles précédents inchangés pour container, header, etc.)
  container: { flex: 1, backgroundColor: COLORS.bg, paddingTop: 20 },
  header: { paddingHorizontal: 16, marginBottom: 20 },
  pageTitle: { color: COLORS.neonGreen, fontSize: 14, fontWeight: '900', letterSpacing: 2, marginBottom: 16, textTransform: 'uppercase', opacity: 0.8 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 12 },
  input: { flex: 1, color: COLORS.white, fontSize: 16, marginLeft: 10, fontWeight: '500' },
  listContent: { paddingHorizontal: 16, paddingBottom: 120 },
  resultRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, padding: 16, borderRadius: 12, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: COLORS.border },
  trainIconBox: { alignItems: 'center', justifyContent: 'center', marginRight: 16, width: 40 },
  trainType: { color: COLORS.textDim, fontSize: 10, fontWeight: '900', marginTop: 4 },
  trainInfo: { flex: 1 },
  trainName: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
  route: { color: COLORS.textDim, fontSize: 12, marginTop: 2 },
  actionArea: { alignItems: 'flex-end', gap: 8 },
  time: { color: COLORS.white, fontWeight: 'bold', fontSize: 16 },
  betButton: { backgroundColor: COLORS.neonGreen, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  betButtonText: { color: '#000', fontWeight: 'bold', fontSize: 10 },

  // --- STYLES DE LA MODALE ---
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end', // Modale en bas de l'écran (Bottom Sheet style)
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalContent: {
    backgroundColor: '#151517',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    borderTopWidth: 1,
    borderColor: COLORS.neonGreen,
    minHeight: '50%',
    paddingBottom: 40,
    shadowColor: COLORS.neonGreen,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  },
  trainSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summaryTrain: { color: COLORS.white, fontSize: 20, fontWeight: 'bold' },
  summaryRoute: { color: COLORS.textDim, fontSize: 12 },
  oddsBadge: { alignItems: 'flex-end' },
  oddsLabel: { color: COLORS.neonGreen, fontSize: 10, fontWeight: 'bold' },
  oddsValue: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },

  sectionLabel: {
    color: COLORS.textDim,
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  amountSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  amountBtn: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  amountBtnText: { color: COLORS.white, fontSize: 24 },
  amountDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  amountText: {
    color: COLORS.white,
    fontSize: 32,
    fontWeight: 'bold',
  },
  
  gainBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(57, 255, 20, 0.1)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(57, 255, 20, 0.3)',
    marginBottom: 24,
  },
  gainLabel: { color: COLORS.neonGreen, fontWeight: 'bold', fontSize: 12 },
  gainValue: { color: COLORS.neonGreen, fontWeight: 'bold', fontSize: 20 },

  confirmButton: {
    backgroundColor: COLORS.neonGreen,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: COLORS.neonGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  confirmText: {
    color: 'black',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 1,
  },
  disclaimer: {
    textAlign: 'center',
    color: '#444',
    fontSize: 10,
    fontStyle: 'italic',
  }
});