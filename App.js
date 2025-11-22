import React, { useRef, useEffect } from "react";
import { StatusBar, View, StyleSheet, Animated } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
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
import { LoadingScreen } from "./src/screens/LoadingScreen";

import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_900Black,
} from "@expo-google-fonts/inter";

const Tab = createBottomTabNavigator();
const COLORS = { background: "#0A0A0A" };

// --- SOUS-COMPOSANT QUI CONTIENT LA NAVIGATION ---
function AppContent() {
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_900Black, // Parfait pour le titre RAILRAGE
  });
  const {
    isLoading,
    isLoggedIn,
    balance,
    myBets,
    inventory,
    currentAvatar,
    friends,
    userPseudo,
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
  } = useGame();

  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Anim Lose (UI Only)
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

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Si pas connecté, on montre le Login
  // Note : LoginPage utilise maintenant useGame() en interne, plus besoin de passer 'onLogin'
  if (!isLoggedIn) {
    return <LoginPage />;
  }
  if (!fontsLoaded) {
    return null;
  }

  return (
    // 👇 CORRECTION ICI : On utilise un Fragment <> pour grouper
    <>
      {!isLoggedIn ? (
        <LoginPage onLogin={login} />
      ) : (
        <NavigationContainer>
          <Tab.Navigator
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{
              headerShown: false,
              sceneContainerStyle: { backgroundColor: COLORS.background },
            }}
          >
            <Tab.Screen name="Accueil">
              {(props) => <HomePage {...props} />}
            </Tab.Screen>
            <Tab.Screen name="Recherche">
              {(props) => (
                <SearchPage
                  {...props}
                  // La navigation est gérée ici
                  onNavigate={(screen) =>
                    props.navigation.navigate(
                      screen === "home" ? "Accueil" : screen
                    )
                  }
                />
              )}
            </Tab.Screen>
            <Tab.Screen name="Classement">
              {(props) => (
                <LeaderboardPage
                  {...props}
                  friends={friends}
                  onAddFriend={addFriend}
                  myScore={balance}
                  myPseudo={userPseudo}
                  myAvatar={currentAvatar}
                />
              )}
            </Tab.Screen>
            <Tab.Screen name="Profil">
              {(props) => (
                <ProfilePage
                  {...props}
                  // Note: ProfilePage utilise maintenant useGame() en interne,
                  // mais on peut laisser les props pour compatibilité si tu n'as pas tout nettoyé
                  balance={balance}
                  pseudo={userPseudo}
                  inventory={inventory}
                  buySkin={buySkin}
                  onReset={resetData}
                  currentAvatar={currentAvatar}
                  equipSkin={equipSkin}
                />
              )}
            </Tab.Screen>
          </Tab.Navigator>
        </NavigationContainer>
      )}
      {/* 2. LE LOADING SCREEN (Positionné PAR DESSUS en absolute) */}
      {isLoading && (
        <View
          style={[
            StyleSheet.absoluteFill,
            { zIndex: 9999, backgroundColor: "#0A0A0A" },
          ]}
        >
          <LoadingScreen />
        </View>
      )}
      {/* 👇 LES ANIMATIONS SONT MAINTENANT EN DEHORS DU CONTAINER (FRÈRES) */}

      {showConfetti && (
        <View style={styles.confettiContainer} pointerEvents="none">
          <LottieView
            // Assure-toi que le fichier existe ou utilise l'URI
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

      {showLoseAnim && (
        <Animated.View
          style={[styles.loseContainer, { opacity: fadeAnim }]}
          pointerEvents="none"
        >
          <LottieView
            // Idem pour le fichier local
            source={{
              uri: "https://lottie.host/ffc3d272-73c9-429d-8ea8-f92569684a6d/hXI4k0DN9D.lottie",
            }}
            autoPlay
            loop={true}
            style={styles.lottieSmiley}
          />
        </Animated.View>
      )}
    </>
  );
}

// --- APP PRINCIPALE ---
export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <GameProvider>
        <AppContent />
      </GameProvider>
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
