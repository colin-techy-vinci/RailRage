import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Home, Search, Trophy, User } from 'lucide-react-native';

const COLORS = {
  neonGreen: '#39FF14',
  textDim: '#6B7280',
};

export function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.navContainer}>
      <BlurView intensity={30} tint="dark" style={styles.blurContainer}>
        <View style={styles.navItemsWrapper}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label = route.name;
            const isFocused = state.index === index;

            // Définir l'icône selon le nom de la route
            let Icon;
            if (route.name === 'Accueil') Icon = Home;
            else if (route.name === 'Recherche') Icon = Search;
            else if (route.name === 'Classement') Icon = Trophy;
            else if (route.name === 'Profil') Icon = User;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <TouchableOpacity
                key={index}
                onPress={onPress}
                style={styles.navButton}
                activeOpacity={0.7}
              >
                <Icon 
                  size={24} 
                  color={isFocused ? COLORS.neonGreen : COLORS.textDim} 
                />
                <Text style={[
                  styles.navLabel, 
                  { color: isFocused ? COLORS.neonGreen : COLORS.textDim }
                ]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  navContainer: {
    position: 'absolute',
    bottom: 20, // Flottant
    left: 20,
    right: 20,
    borderRadius: 20,
    overflow: 'hidden',
    // Ombre et Bordure
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  blurContainer: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(28, 28, 30, 0.75)',
  },
  navItemsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navButton: {
    alignItems: 'center',
    gap: 4,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: '500',
  }
});