// src/components/BettingModal.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { X, Coins, AlertTriangle } from 'lucide-react-native';
import { COLORS } from '../constants/theme';

export function BettingModal({ visible, train, onClose, onConfirm, balance }) {
  const [betAmount, setBetAmount] = useState(50);

  // Reset le montant quand la modale s'ouvre
  useEffect(() => {
    if (visible) setBetAmount(50);
  }, [visible]);

  const handleConfirm = () => {
    // On renvoie juste le montant au parent, lui se débrouillera avec la logique
    onConfirm(betAmount);
  };

  if (!train) return null;

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
        <View style={styles.modalContent}>
          
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>NOUVEAU PARI</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={COLORS.textDim} />
            </TouchableOpacity>
          </View>

          {/* Info Train */}
          <View style={styles.trainSummary}>
            <View>
              <Text style={styles.summaryTrain}>{train.train}</Text>
              <Text style={styles.summaryRoute}>{train.route}</Text>
            </View>
            <View style={styles.oddsBadge}>
              <Text style={styles.oddsLabel}>COTE</Text>
              <Text style={styles.oddsValue}>x{train.odds}</Text>
            </View>
          </View>

          {/* Solde */}
          <View style={{ alignItems: 'center', marginBottom: 10 }}>
            <Text style={{ color: '#8E8E93', fontSize: 16 }}>
              Portefeuille : <Text style={{ color: COLORS.white, fontWeight: 'bold' }}>{balance} 🪙</Text>
            </Text>
          </View>

          {/* Sélecteur */}
          <Text style={styles.sectionLabel}>MONTANT DE LA MISE</Text>
          <View style={styles.amountSelector}>
            <TouchableOpacity style={styles.amountBtn} onPress={() => setBetAmount(Math.max(10, betAmount - 10))}>
              <Text style={styles.amountBtnText}>-</Text>
            </TouchableOpacity>
            <View style={styles.amountDisplay}>
              <Text style={styles.amountText}>{betAmount}</Text>
              <Coins size={16} color={COLORS.gold} />
            </View>
            <TouchableOpacity style={styles.amountBtn} onPress={() => setBetAmount(betAmount + 10)}>
              <Text style={styles.amountBtnText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Gains */}
          <View style={styles.gainBox}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <AlertTriangle size={18} color={COLORS.neonGreen} />
              <Text style={styles.gainLabel}>GAIN POTENTIEL</Text>
            </View>
            <Text style={styles.gainValue}>{Math.floor(betAmount * train.odds)} 🪙</Text>
          </View>

          {/* Action */}
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmText}>VALIDER LE PARI</Text>
          </TouchableOpacity>
          <Text style={styles.disclaimer}>Mise non remboursable si le train arrive à l heure (lol).</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' },
  modalContent: { backgroundColor: '#151517', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, borderTopWidth: 1, borderColor: COLORS.neonGreen, minHeight: '50%', paddingBottom: 40, shadowColor: COLORS.neonGreen, shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.3, shadowRadius: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { color: COLORS.white, fontSize: 18, fontWeight: '900', letterSpacing: 1 },
  trainSummary: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.card, padding: 16, borderRadius: 12, marginBottom: 24, borderWidth: 1, borderColor: COLORS.border },
  summaryTrain: { color: COLORS.white, fontSize: 20, fontWeight: 'bold' },
  summaryRoute: { color: COLORS.textDim, fontSize: 12 },
  oddsBadge: { alignItems: 'flex-end' },
  oddsLabel: { color: COLORS.neonGreen, fontSize: 10, fontWeight: 'bold' },
  oddsValue: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
  sectionLabel: { color: COLORS.textDim, fontSize: 12, fontWeight: 'bold', marginBottom: 12 },
  amountSelector: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  amountBtn: { width: 50, height: 50, borderRadius: 12, backgroundColor: COLORS.card, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  amountBtnText: { color: COLORS.white, fontSize: 24 },
  amountDisplay: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  amountText: { color: COLORS.white, fontSize: 32, fontWeight: 'bold' },
  gainBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(57, 255, 20, 0.1)', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(57, 255, 20, 0.3)', marginBottom: 24 },
  gainLabel: { color: COLORS.neonGreen, fontWeight: 'bold', fontSize: 12 },
  gainValue: { color: COLORS.neonGreen, fontWeight: 'bold', fontSize: 20 },
  confirmButton: { backgroundColor: COLORS.neonGreen, paddingVertical: 16, borderRadius: 16, alignItems: 'center', marginBottom: 16, shadowColor: COLORS.neonGreen, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 10 },
  confirmText: { color: 'black', fontWeight: '900', fontSize: 16, letterSpacing: 1 },
  disclaimer: { textAlign: 'center', color: '#444', fontSize: 10, fontStyle: 'italic' }
});