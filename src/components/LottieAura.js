import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

// 👇 AJOUT : "scale = 1.5" assure que si on oublie l'échelle, ça ne plante pas
export function LottieAura({ source, size, scale = 1.5 }) {
  
  const lottieSource = typeof source === 'string' ? { uri: source } : source;
  
  const wrapperSize = size * scale; 
  
  return (
    <View style={{ 
      width: wrapperSize, 
      height: wrapperSize, 
      position: 'absolute',
      // Centrage parfait pour que l'aura soit bien autour de la tête
      justifyContent: 'center',
      alignItems: 'center',
      pointerEvents: 'none' // Permet de cliquer sur l'avatar à travers l'aura
    }}>
      <LottieView
        source={lottieSource}
        autoPlay
        loop
        style={StyleSheet.absoluteFillObject}
        resizeMode="contain"
      />
    </View>
  );
}