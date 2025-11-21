import React, { useState, useRef, useEffect } from "react";
import {
  StatusBar,
  Alert,
  View,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
import * as Haptics from "expo-haptics";

// Composants
import { HomePage } from "./components/HomePage"; // Vérifie tes chemins (../ ou ./)
import { SearchPage } from "./components/SearchPage";
import { LeaderboardPage } from "./components/LeaderboardPage";
import { ProfilePage } from "./components/ProfilePage";
import { CustomTabBar } from "./components/CustomTabBar";

const Tab = createBottomTabNavigator();

const COLORS = {
  background: "#0A0A0A",
};

export default function App() {
  // --- ÉTAT GLOBAL ---
  const [balance, setBalance] = useState(450);
  const [myBets, setMyBets] = useState([]);
  // État Victoire
  const [showConfetti, setShowConfetti] = useState(false);

  // 👇 NOUVEL ÉTAT DÉFAITE
  const [showLoseAnim, setShowLoseAnim] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  // --- LOGIQUE MÉTIER ---
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

  // --- MOTEUR DE JEU : SIMULATION DES TRAINS ---
  const simulateTime = () => {
    // On ne garde que les paris "pending"
    const pendingBets = myBets.filter((b) => b.status === "pending");

    if (pendingBets.length === 0) {
      Alert.alert(
        "Calme plat",
        "Aucun train en circulation (aucun pari en cours)."
      );
      return;
    }

    let totalWinnings = 0;
    let message = "";

    // On crée une nouvelle liste de paris mis à jour
    const updatedBets = myBets.map((bet) => {
      if (bet.status !== "pending") return bet; // On touche pas aux vieux paris

      // RNG : 60% de chance de retard (C'est la Belgique après tout)
      const isLate = Math.random() > 0.4;

      if (isLate) {
        // GAGNÉ !
        const odds = 2.5; // On simplifie, cote fixe pour l'instant ou récupérée du bet
        const winAmount = Math.floor(bet.bet * odds);
        totalWinnings += winAmount;
        return { ...bet, status: "won", winAmount: winAmount };
      } else {
        // PERDU (Le train est à l'heure, l'horreur !)
        return { ...bet, status: "lost" };
      }
    });

    setMyBets(updatedBets);

    // Paiement et Feedback
    if (totalWinnings > 0) {
      setBalance((prev) => prev + totalWinnings);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setShowConfetti(true);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      // 👇 C'EST ICI : ON LANCE L'ANIMATION DE DÉFAITE
      setShowLoseAnim(true);
    }
  };
  // GESTION DE L'ANIMATION DE DÉFAITE (FADE)
  useEffect(() => {
    if (showLoseAnim) {
      
      // Sécurité : on s'assure qu'il est invisible au début
      fadeAnim.setValue(0); 

      Animated.sequence([
        // 1. Fade In (Apparition)
        Animated.timing(fadeAnim, {
          toValue: 1,   // Devient totalement visible
          duration: 2000,
          useNativeDriver: true,
        }),
        // 2. Reste visible
        Animated.delay(2500), // Attend 2.5 secondes
        // 3. Fade Out (Disparition)
        Animated.timing(fadeAnim, {
          toValue: 0,   // Redevient invisible
          duration: 800,
          useNativeDriver: true,
        })
      ]).start(() => {
        // Quand c'est fini, on "démonte" le composant
        setShowLoseAnim(false);
      });
    }
  }, [showLoseAnim]); // On a retiré screenHeight des dépendances

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* ❌ SUPPRIMÉ : <NavigationContainer> (Expo le fait déjà) */}

      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          sceneContainerStyle: { backgroundColor: COLORS.background },
        }}
      >
        {/* ÉCRAN 1 : ACCUEIL */}
        <Tab.Screen name="Accueil">
          {(props) => (
            <HomePage
              {...props}
              bets={myBets}
              balance={balance}
              onSimulate={simulateTime}
            />
          )}
        </Tab.Screen>

        {/* ÉCRAN 2 : RECHERCHE */}
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

        {/* ÉCRAN 3 : CLASSEMENT */}
        <Tab.Screen name="Classement" component={LeaderboardPage} />

        {/* ÉCRAN 4 : PROFIL */}
        <Tab.Screen name="Profil">
          {(props) => <ProfilePage {...props} balance={balance} />}
        </Tab.Screen>
      </Tab.Navigator>
      {/* 👇 LA COUCHE D'ANIMATION (Seulement si showConfetti est true) */}
      {showConfetti && (
        <View style={styles.confettiContainer} pointerEvents="none">
          <LottieView
            // On utilise une URL directe vers une animation de confettis gratuite
            source={{
              uri: "https://lottie.host/f9fac368-8499-406d-aa12-32804c0dd530/KcVVz4ZF1i.lottie",
            }}
            autoPlay
            loop={false} // Important : ne joue qu'une fois
            resizeMode="cover" // Remplit l'écran
            style={styles.lottie}
            // QUAND C'EST FINI, ON ÉTEINT L'INTERRUPTEUR
            onAnimationFinish={() => setShowConfetti(false)}
          />
        </View>
      )}
      {showLoseAnim && (
        <Animated.View 
          style={[
            styles.loseContainer,
            // 👇 C'EST ICI LE CHANGEMENT : On applique l'opacité
            { opacity: fadeAnim } 
          ]}
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

// Tout en bas de App.js

const styles = StyleSheet.create({
  confettiContainer: {
    position: "absolute", // Flotte au-dessus
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999, // S'assure d'être au premier plan
    justifyContent: "center",
    alignItems: "center",
    // Pas de fond (transparent)
  },
  lottie: {
    width: "100%",
    height: "100%",
  },
  loseContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    // On le place initialement au centre vertical, mais l'anim translateY va le décaler
    top: '40%', // Un peu plus haut que le centre exact
    zIndex: 1000,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottieSmiley: {
    width: 200, // Taille du smiley
    height: 200,
  },
});
