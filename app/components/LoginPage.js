import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Fingerprint, ArrowRight, Terminal } from 'lucide-react-native';

const COLORS = {
  bg: '#0A0A0A',
  card: '#1C1C1E',
  neonGreen: '#39FF14',
  neonRed: '#FF3B30',
  textDim: '#8E8E93',
  white: '#FFFFFF',
  border: '#2A2A2E',
};

export function LoginPage({ onLogin }) {
  const [pseudo, setPseudo] = useState('');

  const handleConnect = () => {
    if (pseudo.length < 3) return; // Petite validation
    onLogin(pseudo); // On envoie le pseudo au parent
  };

  const handleGoogleFake = () => {
    // Plus tard, on mettra ici le vrai code Google Sign-In
    onLogin("GoogleUser"); 
  };

  return (
    <View style={styles.container}>
      {/* Fond Dégradé sombre */}
      <LinearGradient
        colors={['#000000', '#1a0b2e']}
        style={StyleSheet.absoluteFill}
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        
        {/* LOGO / TITRE */}
        <View style={styles.logoSection}>
          <View style={styles.iconCircle}>
            <Terminal size={40} color={COLORS.neonGreen} />
          </View>
          <Text style={styles.appTitle}>RAILRAGE</Text>
          <Text style={styles.subtitle}>SNCBet Network Access</Text>
        </View>

        {/* FORMULAIRE */}
        <View style={styles.formSection}>
          
          <Text style={styles.label}>IDENTIFIANT / MATRICULE</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Ex: PigeonVoyageur"
              placeholderTextColor="#555"
              value={pseudo}
              onChangeText={setPseudo}
              autoCapitalize="none"
              selectionColor={COLORS.neonGreen}
            />
            <Fingerprint size={20} color={COLORS.textDim} style={{ marginRight: 10 }} />
          </View>

          {/* Bouton Connexion Classique */}
          <TouchableOpacity 
            style={[styles.loginBtn, pseudo.length < 3 && { opacity: 0.5, borderColor: '#333' }]}
            onPress={handleConnect}
            disabled={pseudo.length < 3}
          >
            <Text style={styles.loginBtnText}>INITIALISER LA SESSION</Text>
            <ArrowRight size={20} color="black" />
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.orText}>OU</Text>
            <View style={styles.line} />
          </View>

          {/* Bouton Google (Style Visuel) */}
          <TouchableOpacity style={styles.googleBtn} onPress={handleGoogleFake}>
            {/* On simule le logo G avec du texte coloré pour éviter d'importer une image externe */}
            <View style={{ flexDirection: 'row', gap: 2 }}>
               <Text style={{color: '#EA4335', fontWeight:'bold', fontSize: 18}}>G</Text>
               <Text style={{color: '#4285F4', fontWeight:'bold', fontSize: 18}}>o</Text>
               <Text style={{color: '#FBBC05', fontWeight:'bold', fontSize: 18}}>o</Text>
               <Text style={{color: '#4285F4', fontWeight:'bold', fontSize: 18}}>g</Text>
               <Text style={{color: '#34A853', fontWeight:'bold', fontSize: 18}}>l</Text>
               <Text style={{color: '#EA4335', fontWeight:'bold', fontSize: 18}}>e</Text>
            </View>
            <Text style={styles.googleText}>Connexion Rapide</Text>
          </TouchableOpacity>

        </View>

        <Text style={styles.version}>v1.0.0 • Secure Connection</Text>

      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  content: { flex: 1, justifyContent: 'center', padding: 24 },
  
  logoSection: { alignItems: 'center', marginBottom: 60 },
  iconCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(57, 255, 20, 0.1)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.neonGreen,
    marginBottom: 20,
    shadowColor: COLORS.neonGreen, shadowOpacity: 0.5, shadowRadius: 20,
  },
  appTitle: {
    color: COLORS.white, fontSize: 32, fontWeight: '900', letterSpacing: 6,
  },
  subtitle: {
    color: COLORS.textDim, fontSize: 12, textTransform: 'uppercase', letterSpacing: 2, marginTop: 5,
  },

  formSection: { width: '100%' },
  label: { color: COLORS.neonGreen, fontSize: 10, fontWeight: 'bold', marginBottom: 8, letterSpacing: 1 },
  
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 12, height: 56, paddingHorizontal: 4, marginBottom: 20,
  },
  input: {
    flex: 1, color: COLORS.white, fontSize: 16, fontWeight: 'bold', paddingHorizontal: 16, height: '100%',
  },

  loginBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: COLORS.neonGreen, height: 56, borderRadius: 12,
    shadowColor: COLORS.neonGreen, shadowOpacity: 0.4, shadowRadius: 10,
  },
  loginBtnText: { color: 'black', fontWeight: '900', fontSize: 14, letterSpacing: 1 },

  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
  line: { flex: 1, height: 1, backgroundColor: '#333' },
  orText: { color: '#555', marginHorizontal: 10, fontSize: 10, fontWeight: 'bold' },

  googleBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12,
    backgroundColor: COLORS.white, height: 56, borderRadius: 12,
  },
  googleText: { color: 'black', fontWeight: 'bold', fontSize: 14 },

  version: { position: 'absolute', bottom: 40, alignSelf: 'center', color: '#333', fontSize: 10 },
});