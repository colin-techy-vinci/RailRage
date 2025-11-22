// src/context/GameContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { INITIAL_INVENTORY, INITIAL_FRIENDS } from '../constants/data';

// Création du contexte
const GameContext = createContext();

export const GameProvider = ({ children }) => {
  // --- ÉTATS ---
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userPseudo, setUserPseudo] = useState("");
  const [balance, setBalance] = useState(450);
  const [myBets, setMyBets] = useState([]);
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [currentAvatar, setCurrentAvatar] = useState(INITIAL_INVENTORY[0]);
  const [friends, setFriends] = useState(INITIAL_FRIENDS);

  // États UI (Animations) - On les garde ici pour pouvoir les déclencher de partout
  const [showConfetti, setShowConfetti] = useState(false);
  const [showLoseAnim, setShowLoseAnim] = useState(false);

  // --- PERSISTANCE (Load/Save) ---
  useEffect(() => {
    loadGameData();
  }, []);

  useEffect(() => {
    if (isLoggedIn) saveGameData();
  }, [
    balance,
    myBets,
    inventory,
    userPseudo,
    isLoggedIn,
    friends,
    currentAvatar,
  ]);

  const saveGameData = async () => {
    try {
      const dataToSave = {
        balance,
        myBets,
        inventory,
        userPseudo,
        currentAvatar,
        isLoggedIn: true,
        friends,
      };
      await AsyncStorage.setItem("@railrage_save", JSON.stringify(dataToSave));
    } catch (e) {
      console.error("Erreur sauvegarde", e);
    }
  };

  const loadGameData = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      const jsonValue = await AsyncStorage.getItem("@railrage_save");
      if (jsonValue != null) {
        const data = JSON.parse(jsonValue);
        setBalance(data.balance);
        setMyBets(data.myBets);
        setUserPseudo(data.userPseudo);
        if (data.friends) setFriends(data.friends);
        
        // 👇 CORRECTION ICI :
        // Si on a un avatar sauvegardé ET que c'est bien un objet avec un type (Nouveau format)
        if (data.currentAvatar && data.currentAvatar.type) {
           setCurrentAvatar(data.currentAvatar);
        } else {
           // Sinon (Ancien format ou rien), on met le défaut
           setCurrentAvatar(INITIAL_INVENTORY[0]);
        }
        
        const updatedInventory = INITIAL_INVENTORY.map((codeItem) => {
          const savedItem = data.inventory.find((i) => i.id === codeItem.id);
          return { ...codeItem, unlocked: savedItem ? savedItem.unlocked : codeItem.unlocked };
        });
        setInventory(updatedInventory);
        
        if (data.isLoggedIn) setIsLoggedIn(true);
      }
    } catch (e) {
      console.error("Erreur chargement", e);
    } finally {
      setIsLoading(false);
    }
  };

  // --- ACTIONS ---
  const login = (pseudo) => {
    setUserPseudo(pseudo);
    setIsLoggedIn(true);
  };

  const addFriend = (pseudo) => {
    const newFriend = {
      id: Date.now().toString(),
      pseudo: pseudo,
      avatar: pseudo.substring(0, 2).toUpperCase(),
      score: Math.floor(Math.random() * 2000),
      color: "#" + Math.floor(Math.random() * 16777215).toString(16),
    };
    setFriends((prev) => [...prev, newFriend]);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const equipSkin = (skin) => {
    if (!skin.unlocked) return;
    setCurrentAvatar(skin);
    Haptics.selectionAsync();
  };

  const buySkin = (skin) => {
    if (skin.unlocked) return;
    if (balance >= skin.price) {
      Alert.alert(
        "Confirmer l'achat",
        `Acheter ${skin.name} pour ${skin.price} 🪙 ?`,
        [
          { text: "Annuler", style: "cancel" },
          {
            text: "ACHETER",
            onPress: () => {
              setBalance((prev) => prev - skin.price);
              const newInventory = inventory.map((item) =>
                item.id === skin.id ? { ...item, unlocked: true } : item
              );
              setInventory(newInventory);
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success
              );
              Alert.alert("Succès", `Tu as débloqué ${skin.emoji} !`);
            },
          },
        ]
      );
    } else {
      Alert.alert("Pas assez riche", `Manque ${skin.price - balance} 🪙.`);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const resetData = async () => {
    await AsyncStorage.removeItem("@railrage_save");
    setBalance(20000);
    setInventory(INITIAL_INVENTORY);
    setMyBets([]);
    setFriends(INITIAL_FRIENDS);

    setCurrentAvatar(INITIAL_INVENTORY[0]); 
    
    setIsLoggedIn(false);
    Alert.alert("Reset", "Données effacées.");
  };

  const placeBet = (newBet) => {
    if (balance < newBet.bet) {
      Alert.alert("Fonds insuffisants", "Va falloir recharger.");
      return false;
    }
    setBalance((prev) => prev - newBet.bet);
    setMyBets((prev) => [newBet, ...prev]);
    return true;
  };

  const simulateTime = () => {
    const pendingBets = myBets.filter((b) => b.status === "pending");
    if (pendingBets.length === 0) {
      Alert.alert("Calme plat", "Aucun train en circulation.");
      return;
    }
    let totalWinnings = 0;
    const updatedBets = myBets.map((bet) => {
      if (bet.status !== "pending") return bet;
      const isLate = Math.random() > 0.4;
      if (isLate) {
        const winAmount = Math.floor(bet.bet * 2.5);
        totalWinnings += winAmount;
        return { ...bet, status: "won", winAmount: winAmount };
      } else {
        return { ...bet, status: "lost" };
      }
    });
    setMyBets(updatedBets);
    if (totalWinnings > 0) {
      setBalance((prev) => prev + totalWinnings);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setShowConfetti(true);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setShowLoseAnim(true);
    }
  };

  // On exporte tout ce dont les composants ont besoin
  return (
    <GameContext.Provider
      value={{
        isLoading,
        isLoggedIn,
        userPseudo,
        balance,
        myBets,
        inventory,
        currentAvatar,
        friends,
        showConfetti,
        setShowConfetti,
        showLoseAnim,
        setShowLoseAnim,
        login,
        addFriend,
        equipSkin,
        buySkin,
        resetData,
        placeBet,
        simulateTime,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte facilement
export const useGame = () => useContext(GameContext);
