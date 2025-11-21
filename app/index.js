import React, { useState, useRef, useEffect } from "react";
import {
  StatusBar,
  Alert,
  View,
  StyleSheet,
  Animated,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
import * as Haptics from "expo-haptics";

// Composants
import { HomePage } from "./components/HomePage";
import { SearchPage } from "./components/SearchPage";
import { LeaderboardPage } from "./components/LeaderboardPage";
import { ProfilePage } from "./components/ProfilePage";
import { CustomTabBar } from "./components/CustomTabBar";
import { LoginPage } from "./components/LoginPage"; // <--- NOUVEL IMPORT

const Tab = createBottomTabNavigator();

const COLORS = {
  background: "#0A0A0A",
};

export default function App() {
  // --- ÉTAT DE CONNEXION (NOUVEAU) ---
  const [isLoggedIn, setIsLoggedIn] = useState(false); // false = Écran de Login
  const [userPseudo, setUserPseudo] = useState("");    // Pour stocker le nom

  // --- ÉTATS DU JEU ---
  const [balance, setBalance] = useState(450);
  const [myBets, setMyBets] = useState([]);
  
  // États Animations
  const [showConfetti, setShowConfetti] = useState(false);
  const [showLoseAnim, setShowLoseAnim] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // --- FONCTION DE CONNEXION ---
  const handleLogin = (pseudo) => {
    setUserPseudo(pseudo);
    setIsLoggedIn(true); // DÉCLENCHE L'ENTRÉE DANS L'APP
  };

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

  const simulateTime = () => {
    const pendingBets = myBets.filter((b) => b.status === "pending");

    if (pendingBets.length === 0) {
      Alert.alert(
        "Calme plat",
        "Aucun train en circulation (aucun pari en cours)."
      );
      return;
    }

    let totalWinnings = 0;
    
    const updatedBets = myBets.map((bet) => {
      if (bet.status !== "pending") return bet;

      const isLate = Math.random() > 0.4;

      if (isLate) {
        const odds = 2.5;
        const winAmount = Math.floor(bet.bet * odds);
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

  // Animation Fade pour le smiley
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
        })
      ]).start(() => {
        setShowLoseAnim(false);
      });
    }
  }, [showLoseAnim]);


  // --- COMPOSANT INTERNE POUR L'APP PRINCIPALE (Pour plus de clarté) ---
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

        <Tab.Screen name="Classement" component={LeaderboardPage} />

        <Tab.Screen name="Profil">
          {/* On passe le pseudo pour l'afficher (si tu updates ProfilePage plus tard) */}
          {(props) => <ProfilePage {...props} balance={balance} pseudo={userPseudo} />}
        </Tab.Screen>
      </Tab.Navigator>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* --- GESTION DE L'AFFICHAGE --- */}
      {/* Si PAS connecté -> Écran Login */}
      {/* Si connecté -> App Principale */}
      
      {!isLoggedIn ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <MainApp />
      )}

      {/* --- COUCHES D'ANIMATION (Confetti & Lose) --- */}
      
      {/* Tes confettis (Uniquement si connecté et victoire) */}
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
          style={[
            styles.loseContainer,
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
  lottie: {
    width: "100%",
    height: "100%",
  },
  loseContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '40%',
    zIndex: 1000,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottieSmiley: {
    width: 200,
    height: 200,
  },
});