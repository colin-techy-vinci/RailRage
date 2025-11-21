import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Search, TrainFront } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Imports Clean Architecture
import { COLORS } from "../constants/theme";
import { FAKE_TRAIN_RESULTS } from "../constants/data";
import { useGame } from "../context/GameContext";
import { BettingModal } from "../components/BettingModal"; // <--- On importe le composant

export function SearchPage({ onNavigate }) {
  const { balance, placeBet } = useGame();
  const insets = useSafeAreaInsets();

  const [query, setQuery] = useState("");
  const [selectedTrain, setSelectedTrain] = useState(null);

  // --- LOGIQUE MÉTIER ---
  const handleConfirmBet = (amount) => {
    if (!selectedTrain) return;

    const newBet = {
      id: Date.now().toString(),
      trainNumber: selectedTrain.train.replace(" ", ""),
      bet: amount,
      status: "pending",
      tension: Math.floor(Math.random() * 100),
    };

    const success = placeBet(newBet);

    if (success) {
      // On ferme la modale AVANT l'alerte
      setSelectedTrain(null);

      Alert.alert(
        "PARI VALIDÉ ! 💸",
        `Mise de ${amount} 🪙 acceptée.\nSolde restant : ${
          balance - amount
        } 🪙`,
        [
          {
            text: "Voir mes paris",
            onPress: () => onNavigate && onNavigate("home"),
          },
        ]
      );
    }
  };

  // --- UI ---
  const filteredData = FAKE_TRAIN_RESULTS.filter(
    (item) =>
      item.train.toLowerCase().includes(query.toLowerCase()) ||
      item.route.toLowerCase().includes(query.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.resultRow}
      activeOpacity={0.7}
      onPress={() => setSelectedTrain(item)}
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
          onPress={() => setSelectedTrain(item)}
        >
          <Text style={styles.betButtonText}>MISER</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={[styles.header, { paddingTop: insets.top }]}>
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

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* On appelle notre composant propre ici */}
      <BettingModal
        visible={selectedTrain !== null}
        train={selectedTrain}
        balance={balance}
        onClose={() => setSelectedTrain(null)}
        onConfirm={handleConfirmBet}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, paddingTop: 20 },
  header: { paddingHorizontal: 16, marginBottom: 20 },
  pageTitle: {
    color: COLORS.neonGreen,
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 16,
    textTransform: "uppercase",
    opacity: 0.8,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    color: COLORS.white,
    fontSize: 16,
    marginLeft: 10,
    fontWeight: "500",
  },
  listContent: { paddingHorizontal: 16, paddingBottom: 120 },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.border,
  },
  trainIconBox: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    width: 40,
  },
  trainType: {
    color: COLORS.textDim,
    fontSize: 10,
    fontWeight: "900",
    marginTop: 4,
  },
  trainInfo: { flex: 1 },
  trainName: { color: COLORS.white, fontSize: 16, fontWeight: "bold" },
  route: { color: COLORS.textDim, fontSize: 12, marginTop: 2 },
  actionArea: { alignItems: "flex-end", gap: 8 },
  time: { color: COLORS.white, fontWeight: "bold", fontSize: 16 },
  betButton: {
    backgroundColor: COLORS.neonGreen,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  betButtonText: { color: "#000", fontWeight: "bold", fontSize: 10 },
});
