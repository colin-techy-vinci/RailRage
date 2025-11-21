import React, { useRef, useEffect } from "react";
import { StatusBar, View, StyleSheet, Animated } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from '@react-navigation/native'; // <--- AJOUTE ÇA
import LottieView from "lottie-react-native";

// Context
import { GameProvider, useGame } from "./src/context/GameContext";

// Composants

import { CustomTabBar } from "./src/components/CustomTabBar";
// Screens
import { LeaderboardPage } from "./src/screens/LeaderboardPage";
import { HomePage } from "./src/screens/HomePage";
import { SearchPage } from "./src/screens/SearchPage";
import { ProfilePage } from "./src/screens/ProfilePage";
import { LoginPage } from "./src/screens/LoginPage";

const Tab = createBottomTabNavigator();
const COLORS = { background: "#0A0A0A" };

// --- SOUS-COMPOSANT QUI CONTIENT LA NAVIGATION ---
// On le sépare pour qu'il puisse utiliser useGame() (qui doit être dans le Provider)
function AppContent() {
  const { 
    isLoggedIn, userPseudo, balance, myBets, inventory, currentAvatar, friends,
    showConfetti, setShowConfetti, showLoseAnim, setShowLoseAnim,
    login, addFriend, equipSkin, buySkin, resetData, placeBet, simulateTime 
  } = useGame();

  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Anim Lose (UI Only)
  useEffect(() => {
    if (showLoseAnim) {
      fadeAnim.setValue(0);
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.delay(2500),
        Animated.timing(fadeAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
      ]).start(() => setShowLoseAnim(false));
    }
  }, [showLoseAnim]);

  // Si pas connecté, on montre le Login (Pas besoin de Container ici)
  if (!isLoggedIn) {
    return <LoginPage onLogin={login} />;
  }

  return (
    // 👇 LE VOICI ! LE RETOUR DU ROI 👑
    <NavigationContainer>
      
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          sceneContainerStyle: { backgroundColor: COLORS.background },
        }}
      >
        <Tab.Screen name="Accueil">
          {(props) => (
            <HomePage {...props} bets={myBets} balance={balance} onSimulate={simulateTime} currentAvatar={currentAvatar} />
          )}
        </Tab.Screen>
        <Tab.Screen name="Recherche">
          {(props) => (
            <SearchPage 
              {...props} 
              onNavigate={(screen) => props.navigation.navigate(screen === "home" ? "Accueil" : screen)} 
              onPlaceBet={placeBet} 
              balance={balance} 
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Classement">
          {(props) => (
            <LeaderboardPage {...props} friends={friends} onAddFriend={addFriend} myScore={1200} myPseudo={userPseudo} myAvatar={currentAvatar} />
          )}
        </Tab.Screen>
        <Tab.Screen name="Profil">
          {(props) => (
            <ProfilePage 
              {...props} 
              balance={balance} 
              pseudo={userPseudo} 
              inventory={inventory} 
              onBuySkin={buySkin} 
              onReset={resetData} 
              currentAvatar={currentAvatar} 
              onEquipSkin={equipSkin} 
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>

      {/* Animations Globales (À l'intérieur du Container pour s'afficher par-dessus) */}
      {showConfetti && (
        <View style={styles.confettiContainer} pointerEvents="none">
          <LottieView
            source={{uri :'https://lottie.host/f9fac368-8499-406d-aa12-32804c0dd530/KcVVz4ZF1i.lottie'}} // Assure-toi d'avoir remis le require si tu as le fichier
            // OU source={{ uri: "..." }}
            autoPlay loop={false} resizeMode="cover" style={styles.lottie}
            onAnimationFinish={() => setShowConfetti(false)}
          />
        </View>
      )}
      {showLoseAnim && (
        <Animated.View style={[styles.loseContainer, { opacity: fadeAnim }]} pointerEvents="none">
          <LottieView
            source={{uri : 'https://lottie.host/ffc3d272-73c9-429d-8ea8-f92569684a6d/hXI4k0DN9D.lottie'}} // Idem
            // OU source={{ uri: "..." }}
            autoPlay loop={true} style={styles.lottieSmiley}
          />
        </Animated.View>
      )}

    </NavigationContainer> // 👇 ON FERME LE CONTAINER ICI
  );
}

// --- APP PRINCIPALE ---
export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      {/* On enveloppe tout dans le Provider */}
      <GameProvider>
        <AppContent />
      </GameProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  confettiContainer: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 999, justifyContent: "center", alignItems: "center" },
  lottie: { width: "100%", height: "100%" },
  loseContainer: { position: "absolute", left: 0, right: 0, top: "40%", zIndex: 1000, alignItems: "center", justifyContent: "center" },
  lottieSmiley: { width: 200, height: 200 },
});