import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export const Aura = ({ type, colors, size }) => {
  // Valeurs d'animation
  const progress = useRef(new Animated.Value(0)).current;
  const progress2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Reset
    progress.setValue(0);
    progress2.setValue(0);

    // 1. ROTATION & ORBIT
    if (type === 'rotate' || type === 'orbit') {
      Animated.loop(
        Animated.timing(progress, {
          toValue: 1,
          duration: type === 'orbit' ? 4000 : 3000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    }

    // 2. SONAR (Avec décalage)
    if (type === 'sonar') {
      const runSonar = (anim, delay = 0) => {
        setTimeout(() => {
          Animated.loop(
            Animated.timing(anim, {
              toValue: 1,
              duration: 2000,
              easing: Easing.out(Easing.ease), // Effet d'explosion (rapide puis lent)
              useNativeDriver: true,
            })
          ).start();
        }, delay);
      };

      runSonar(progress, 0);
      runSonar(progress2, 1000); // La 2ème onde part 1s après
    }

    return () => {
      progress.stopAnimation();
      progress2.stopAnimation();
    };
  }, [type]);

  // --- INTERPOLATIONS ---

  const rotate = progress.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const rotateReverse = progress.interpolate({ inputRange: [0, 1], outputRange: ['360deg', '0deg'] });
  
  // Sonar
  const sonarScale = progress.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1.6] });
  const sonarOpacity = progress.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.8, 0.5, 0] });
  
  const sonarScale2 = progress2.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1.6] });
  const sonarOpacity2 = progress2.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.8, 0.5, 0] });

  const centerStyle = {
    position: 'absolute', width: size, height: size,
    justifyContent: 'center', alignItems: 'center', pointerEvents: 'none',
  };

  // --- RENDUS ---

  // 1. DOUBLE ORBIT
  if (type === 'orbit') {
    return (
      <View style={centerStyle}>
        <Animated.View style={{
          position: 'absolute', width: size, height: size, borderRadius: size / 2,
          borderWidth: 2, borderColor: 'transparent',
          borderTopColor: colors[0] || 'white',
          borderRightColor: colors[1] || 'white',
          transform: [{ rotate: rotate }]
        }} />
        <Animated.View style={{
          position: 'absolute', width: size * 1.2, height: size * 1.2, borderRadius: size,
          borderWidth: 2, borderColor: 'transparent',
          borderBottomColor: colors[1] || 'white',
          borderLeftColor: colors[0] || 'white',
          transform: [{ rotate: rotateReverse }]
        }} />
      </View>
    );
  }

  // 2. SONAR GLOWING (Modifié)
  if (type === 'sonar') {
    // On définit le style de glow ici pour le réutiliser
    const glowStyle = {
      shadowColor: colors[0], // La couleur principale (ex: vert)
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 1,     // Opacité max pour l'effet néon
      shadowRadius: 10,     // Rayon de diffusion
      elevation: 10,        // Pour Android
      borderWidth: 2,       // Bordure un peu plus épaisse pour bien voir la couleur
      borderColor: colors[0] || 'white',
    };

    return (
      <View style={centerStyle}>
        {/* Onde 1 */}
        <Animated.View style={{
          position: 'absolute', width: size, height: size, borderRadius: size,
          ...glowStyle, // On applique le glow
          transform: [{ scale: sonarScale }], opacity: sonarOpacity
        }} />
        
        {/* Onde 2 */}
        <Animated.View style={{
          position: 'absolute', width: size, height: size, borderRadius: size,
          ...glowStyle, // On applique le glow
          borderColor: colors[1] || colors[0], // Peut avoir une couleur secondaire
          shadowColor: colors[1] || colors[0],
          transform: [{ scale: sonarScale2 }], opacity: sonarOpacity2
        }} />
      </View>
    );
  }

  // 3. ROTATE
  if (type === 'rotate') {
    return (
      <View style={centerStyle}>
        <Animated.View style={{
          width: size, height: size, alignItems: 'center', justifyContent: 'center',
          transform: [{ rotate: rotate }]
        }}>
          <LinearGradient colors={colors} start={{x:0, y:0}} end={{x:1, y:1}}
            style={{ width: size * 1.1, height: size * 1.1, borderRadius: size / 2 }} />
        </Animated.View>
      </View>
    );
  }


  return null;
};