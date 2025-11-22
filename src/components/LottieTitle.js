// src/components/CyberCustomTitle.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { COLORS } from '../constants/theme';

// 👇 ATTENTION : C'est bien "export const", pas "export default"
export const CyberCustomTitle = ({ 
  source, 
  title = "RAILRAGE", 
  width = 280, 
  height = 80,
  fontSize = 28,
  textOffset = 0 
}) => {
  
  const lottieSource = typeof source === 'string' ? { uri: source } : source;

  return (
    <View style={{ width, height, justifyContent: 'center', alignItems: 'center' }}>
      {source && (
        <LottieView
          source={lottieSource}
          autoPlay
          loop
          resizeMode="contain"
          speed={0.5}
          style={StyleSheet.absoluteFillObject}
        />
      )}
      {/* <Text style={[
        styles.titleText, 
        { fontSize: fontSize, marginTop: textOffset }
      ]}>
        {title}
      </Text> */}
    </View>
  );
};
/*
const styles = StyleSheet.create({
  titleText: {
    color: COLORS.white,
    fontFamily: 'Inter_900Black', // Assurez-vous que cette font est chargée, sinon mettez 'System' ou 'Roboto' pour tester
    letterSpacing: 5.9,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)', 
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
});*/