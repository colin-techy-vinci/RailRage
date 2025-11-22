import React, { useState, useEffect, useRef } from 'react'; // <--- Ajouter useRef
import { View, Text, StyleSheet, Platform } from 'react-native';
import LottieView from 'lottie-react-native';
import { COLORS } from '../constants/theme';

const LOADING_MESSAGES = [
  "Connexion au réseau SNCBet...",
  "Calcul des probabilités de retard...",
  "Corruption des contrôleurs...",
  "Recherche de caténaires cassées...",
  "Chargement des excuses bidons...",
  "Initialisation du Chaos..."
];

export function LoadingScreen() {
  const [messageIndex, setMessageIndex] = useState(0);
  
  // 1. Créer une référence pour contrôler l'animation
  const animationRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 800);

    // 2. LA FONCTION DE NETTOYAGE (CLEANUP)
    // Ceci s'exécute juste avant que le LoadingScreen ne disparaisse de l'écran
    return () => {
      clearInterval(interval);
      
      // Si l'animation existe encore, on la force à s'arrêter et se vider
      if (animationRef.current) {
        animationRef.current.reset(); // Remet à zéro
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      
      <View style={styles.lottieContainer}>
        <LottieView
          // 3. Attacher la référence ici
          ref={animationRef} 
          
          // Important : donnez-lui une clé unique pour le différencier du titre
          key="loading_animation_unique" 
          
          source={{ uri: 'https://lottie.host/258e3d5a-e2cc-4369-848a-784ed59b5d07/tPIOGCCvLI.lottie' }}
          autoPlay
          loop
          style={styles.lottie}
        />
      </View>

      <Text style={styles.title}>RAILRAGE</Text>
      
      <Text style={styles.loadingText}>
        {LOADING_MESSAGES[messageIndex]}
      </Text>

      <Text style={styles.version}>v1.0.0 • System Boot</Text>
    </View>
  );
}

// ... styles inchangés
const styles = StyleSheet.create({
    // ...
    container: {
        flex: 1,
        backgroundColor: COLORS.bg,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lottieContainer: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
    lottie: {
        width: '100%',
        height: '100%',
    },
    title: {
        color: COLORS.neonGreen,
        fontSize: 32,
        fontWeight: '900',
        letterSpacing: 6,
        marginBottom: 20,
    },
    loadingText: {
        color: COLORS.textDim,
        fontSize: 14,
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
        marginTop: 10,
        height: 20,
    },
    version: {
        position: 'absolute',
        bottom: 50,
        color: '#333',
        fontSize: 10,
    }
});
