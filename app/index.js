import React, { useState, useRef, useEffect } from "react";
import { StatusBar, Alert, View, StyleSheet, Animated } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage"; // <--- NOUVEAU

// Composants
import { HomePage } from "./components/HomePage";
import { SearchPage } from "./components/SearchPage";
import { LeaderboardPage } from "./components/LeaderboardPage";
import { ProfilePage } from "./components/ProfilePage";
import { CustomTabBar } from "./components/CustomTabBar";
import { LoginPage } from "./components/LoginPage";

const Tab = createBottomTabNavigator();
const COLORS = { background: "#0A0A0A" };

// --- DATA INITIALE (SHOP) ---
// Dans App.js

const INITIAL_INVENTORY = [
  // J'ai ajouté une propriété 'image' à chaque skin
  {
    id: "skin_zombie",
    name: "Zombie",
    emoji: "🧟",
    price: 500,
    unlocked: true,
    image:
      "https://api.dicebear.com/7.x/avataaars/png?seed=Zombie&backgroundColor=b6e3f4",
  },
  {
    id: "skin_conducteur",
    name: "Conducteur",
    emoji: "👨‍✈️",
    price: 800,
    unlocked: true,
    image:
      "https://api.dicebear.com/7.x/avataaars/png?seed=Felix&clothing=graphicShirt",
  },
  {
    id: "skin_pigeon",
    name: "Pigeon",
    emoji: "🕊️",
    price: 0,
    unlocked: true,
    image: "https://i.pravatar.cc/150?img=11",
  }, // Le défaut
  {
    id: "skin_robot",
    name: "Robot",
    emoji: "🤖",
    price: 2500,
    unlocked: false,
    image: "https://api.dicebear.com/7.x/bottts/png?seed=Robot",
  },
  {
    id: "skin_ninja",
    name: "Ninja",
    emoji: "🥷",
    price: 5000,
    unlocked: false,
    image:
      "https://api.dicebear.com/7.x/avataaars/png?seed=Ninja&mode=exclude&top=turban",
  },
  {
    id: "skin_alien",
    name: "Alien",
    emoji: "👽",
    price: 10000,
    unlocked: false,
    image:
      "https://api.dicebear.com/7.x/bottts/png?seed=Alien&backgroundColor=ffdfbf",
  },
];

const INITIAL_FRIENDS = [
  {
    id: "f1",
    pseudo: "ThomasLeTrain",
    avatar: "TT",
    score: 1250,
    color: "#39FF14",
  },
  { id: "f2", pseudo: "RetardMan", avatar: "RM", score: 200, color: "#FF3B30" },
];

export default function App() {
  // --- ÉTATS ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userPseudo, setUserPseudo] = useState("");
  const [balance, setBalance] = useState(450);
  const [myBets, setMyBets] = useState([]);

  // Nouvel état pour l'inventaire (Skins)
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [currentAvatar, setCurrentAvatar] = useState(
    INITIAL_INVENTORY[2].image
  );
  const [friends, setFriends] = useState(INITIAL_FRIENDS);
  // Animations
  const [showConfetti, setShowConfetti] = useState(false);
  const [showLoseAnim, setShowLoseAnim] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // --- 1. SYSTÈME DE SAUVEGARDE (PERSISTANCE) ---

  // Au démarrage : On charge les données
  useEffect(() => {
    loadGameData();
  }, []);

  // À chaque changement important : On sauvegarde
  useEffect(() => {
    if (isLoggedIn) {
      // On ne sauvegarde que si on est connecté
      saveGameData();
    }
  }, [balance, myBets, inventory, userPseudo, isLoggedIn]);
  const handleAddFriend = (pseudo) => {
    const newFriend = {
      id: Date.now().toString(),
      pseudo: pseudo,
      avatar: pseudo.substring(0, 2).toUpperCase(),
      // Score aléatoire proche du tien pour que ce soit compétitif
      score: Math.floor(Math.random() * 2000),
      color: "#" + Math.floor(Math.random() * 16777215).toString(16), // Couleur aléatoire
    };
    setFriends((prev) => [...prev, newFriend]);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };
  const saveGameData = async () => {
    try {
      const dataToSave = {
        balance,
        myBets,
        inventory,
        userPseudo,
        currentAvatar,
        isLoggedIn: true,
        friends, // On retient qu'on était connecté
      };
      await AsyncStorage.setItem("@railrage_save", JSON.stringify(dataToSave));
    } catch (e) {
      console.error("Erreur sauvegarde", e);
    }
  };

  const handleEquipSkin = (skin) => {
    if (!skin.unlocked) return; // Sécurité
    setCurrentAvatar(skin.image); // On change l'image
    Haptics.selectionAsync(); // Petit retour tactile sympa
  };

  // Dans App.js
  // Dans App.js
  const handleResetData = async () => {
    await AsyncStorage.removeItem("@railrage_save"); // On vide le cache
    // On remet les états à zéro
    setBalance(450);
    setInventory(INITIAL_INVENTORY);
    setMyBets([]);
    setIsLoggedIn(false); // On retourne au login
    Alert.alert("Reset", "Données effacées avec succès.");
  };
  const loadGameData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@railrage_save");
      if (jsonValue != null) {
        const data = JSON.parse(jsonValue);
        if (data.currentAvatar) setCurrentAvatar(data.currentAvatar);

        // Restaure les données simples
        setBalance(data.balance);
        setMyBets(data.myBets);
        setUserPseudo(data.userPseudo);

        // --- LA MAGIE DU MERGE ICI ---
        // On prend la liste INITIALE du code (avec tes nouveaux prix)
        // Et on met à jour seulement le statut 'unlocked' depuis la sauvegarde
        const updatedInventory = INITIAL_INVENTORY.map((codeItem) => {
          // On cherche si cet item existait dans la sauvegarde
          const savedItem = data.inventory.find((i) => i.id === codeItem.id);

          return {
            ...codeItem, // On garde le nouveau prix/nom/emoji du code
            // On ne garde QUE le statut débloqué de la sauvegarde (ou faux si nouveau)
            unlocked: savedItem ? savedItem.unlocked : codeItem.unlocked,
          };
        });

        setInventory(updatedInventory);
      }
    } catch (e) {
      console.error("Erreur chargement", e);
    }
  };

  // --- 2. LOGIQUE DU SHOP ---
  const handleBuySkin = (skin) => {
    if (skin.unlocked) return; // Déjà acheté

    if (balance >= skin.price) {
      Alert.alert(
        "Confirmer l'achat",
        `Acheter le skin ${skin.name} pour ${skin.price} 🪙 ?`,
        [
          { text: "Annuler", style: "cancel" },
          {
            text: "ACHETER",
            onPress: () => {
              // 1. Payer
              setBalance((prev) => prev - skin.price);
              // 2. Débloquer
              const newInventory = inventory.map((item) =>
                item.id === skin.id ? { ...item, unlocked: true } : item
              );
              setInventory(newInventory);
              // 3. Feedback
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success
              );
              Alert.alert("Succès", `Tu as débloqué ${skin.emoji} !`);
            },
          },
        ]
      );
    } else {
      Alert.alert(
        "Pas assez riche",
        `Il te manque ${skin.price - balance} 🪙.\nVa parier !`
      );
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  // --- LOGIQUE MÉTIER EXISTANTE ---
  const handleLogin = (pseudo) => {
    setUserPseudo(pseudo);
    setIsLoggedIn(true);
  };

  const handlePlaceBet = (newBet) => {
    if (balance < newBet.bet) {
      Alert.alert(
        "Fonds insuffisants",
        "Va falloir recharger ou manger des pâtes."
      );
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

  // Anim Lose
  useEffect(() => {
    if (showLoseAnim) {
      fadeAnim.setValue(0);
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.delay(2500),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start(() => setShowLoseAnim(false));
    }
  }, [showLoseAnim]);

  // --- RENDU ---
  function MainApp() {
    return (
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          sceneContainerStyle: { backgroundColor: COLORS.background },
        }}
      >
        <Tab.Screen name="Accueil">
          {(props) => (
            <HomePage
              {...props}
              bets={myBets}
              balance={balance}
              onSimulate={simulateTime}
              currentAvatar={currentAvatar}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Recherche">
          {(props) => (
            <SearchPage
              {...props}
              onNavigate={(screen) =>
                props.navigation.navigate(
                  screen === "home" ? "Accueil" : screen
                )
              }
              onPlaceBet={handlePlaceBet}
              balance={balance}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Classement">
          {(props) => (
            <LeaderboardPage
              {...props}
              friends={friends} // La liste
              onAddFriend={handleAddFriend} // La fonction
              myScore={1200} // Simulé pour l'instant, ou calculé via tes paris gagnés
              myPseudo={userPseudo}
              myAvatar={currentAvatar} // Pour l'afficher dans la liste
            />
          )}
        </Tab.Screen>

        {/* 👇 MODIFICATION ICI : On passe l'inventaire et la fonction d'achat */}
        <Tab.Screen name="Profil">
          {(props) => (
            <ProfilePage
              {...props}
              balance={balance}
              pseudo={userPseudo}
              inventory={inventory} // <--- On passe la liste
              onBuySkin={handleBuySkin}
              onReset={handleResetData}
              currentAvatar={currentAvatar} // <--- Nouveau
              onEquipSkin={handleEquipSkin} // <--- On passe la fonction
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      {!isLoggedIn ? <LoginPage onLogin={handleLogin} /> : <MainApp />}

      {isLoggedIn && showConfetti && (
        <View style={styles.confettiContainer} pointerEvents="none">
          <LottieView
            source={{
              uri: "https://lottie.host/f9fac368-8499-406d-aa12-32804c0dd530/KcVVz4ZF1i.lottie",
            }}
            autoPlay
            loop={false}
            resizeMode="cover"
            style={styles.lottie}
            onAnimationFinish={() => setShowConfetti(false)}
          />
        </View>
      )}

      {/* Ton smiley (Uniquement si connecté et défaite) */}

      {isLoggedIn && showLoseAnim && (
        <Animated.View
          style={[styles.loseContainer, { opacity: fadeAnim }]}
          pointerEvents="none"
        >
          <LottieView
            source={{
              uri: "https://lottie.host/ffc3d272-73c9-429d-8ea8-f92569684a6d/hXI4k0DN9D.lottie",
            }}
            autoPlay
            loop={true}
            style={styles.lottieSmiley}
          />
        </Animated.View>
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  confettiContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    justifyContent: "center",
    alignItems: "center",
  },
  lottie: { width: "100%", height: "100%" },
  loseContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "40%",
    zIndex: 1000,
    alignItems: "center",
    justifyContent: "center",
  },
  lottieSmiley: { width: 200, height: 200 },
});
