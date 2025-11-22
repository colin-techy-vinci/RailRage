import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { COLORS } from "../constants/theme";
import { LottieAura } from './LottieAura';
import { Aura } from "./Aura";

export const Avatar = ({
  uri,
  skin,
  pseudo,
  size = 48,
  borderColor = COLORS.purple,
  glow = false,
  lottieScale = null, // Par défaut c'est null
}) => {
  
  const hasActiveSkin = skin && skin.type && skin.type !== "none";
  const faceSource = typeof uri === "string" ? { uri: uri } : uri;

  // 👇 CORRECTION ICI : CALCUL DE L'ÉCHELLE FINALE
  // 1. Si lottieScale est forcé (ex: ProfilePage), on le prend.
  // 2. Sinon, on regarde si le skin a une propriété 'scale' dans data.js.
  // 3. Sinon, on met 1.5 par défaut.
  const finalLottieScale = lottieScale || skin?.scale || 1.5;

  const containerStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: "#1C1C1E",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: hasActiveSkin ? 0 : 2,
    borderColor: borderColor,
    position: "relative",
    ...(glow && !hasActiveSkin
      ? {
          shadowColor: borderColor,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.8,
          shadowRadius: 15,
          elevation: 15,
          backgroundColor: "#1C1C1E",
        }
      : {}),
  };

  const textStyle = {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: size * 0.4,
  };

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* 1. L'AURA (Derrière le visage) */}
      {hasActiveSkin && (
        <>
          {/* CAS LOTTIE CUSTOM */}
          {/* J'ai ajouté les autres types possibles au cas où */}
          {skin.type === 'lottie' || skin.type === 'lottie_media' || skin.type === 'external_lottie' ? (
            <LottieAura 
              source={skin.source} 
              size={size} // 👈 Remets 'size' normal ici, c'est le scale qui va agrandir !
              scale={finalLottieScale} // 👈 On passe la valeur calculée
            />
          ) : (
            /* CAS AURA PROCÉDURALE */
            <Aura 
              type={skin.type} 
              colors={skin.colors} 
              size={size + 2} 
            />
          )}
        </>
      )}

      {/* 2. LE VISAGE (Devant) */}
      <View style={containerStyle}>
        {uri ? (
          <Image
            source={faceSource}
            style={{ width: "100%", height: "100%", borderRadius: size / 2 }}
          />
        ) : (
          <Text style={textStyle}>
            {pseudo ? pseudo.substring(0, 2).toUpperCase() : "?"}
          </Text>
        )}
      </View>
    </View>
  );
};