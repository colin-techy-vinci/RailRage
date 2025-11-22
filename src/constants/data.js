import { Bell, UserPlus, HelpCircle, Trash2 } from "lucide-react-native";
import { COLORS } from "./theme";
export const FAKE_TRAIN_RESULTS = [
  { id: '1', train: 'IC 3405', route: 'Bruxelles-Midi → Mons', time: '18:42', type: 'IC', odds: 1.5 },
  { id: '2', train: 'P 8002', route: 'Schaerbeek → Gand-St-Pierre', time: '18:45', type: 'P', odds: 2.1 },
  { id: '3', train: 'S1 1920', route: 'Anvers-Central → Nivelles', time: '18:52', type: 'S', odds: 1.2 },
  { id: '4', train: 'IC 1515', route: 'Liège → Paris Nord', time: '19:10', type: 'IC', odds: 3.5 },
  { id: '5', train: 'P 7000', route: 'Mouscron → Tournai', time: '19:15', type: 'P', odds: 1.8 },
];

export const FAKE_HOME_TRAINS = [
  { time: "18:12", destination: "Mons", status: "onTime", delay: 0 },
  { time: "18:25", destination: "Liège-Guillemins", status: "delayed", delay: 8 },
  { time: "18:34", destination: "Charleroi-Sud", status: "onTime", delay: 0 },
];

export const FAKE_HOME_LEADERBOARD = [
  { rank: 1, pseudo: "RailMaster", avatar: "RM", gain: 1200 },
  { rank: 2, pseudo: "TGV_Killer", avatar: "TK", gain: 980 },
  { rank: 3, pseudo: "PigeonPro", avatar: "PP", gain: 750 },
];


// 1. Les Badges (100% Statique)
export const PROFILE_BADGES = [
  { name: "Le Survivant", description: "Survécu à un retard de 120 min", icon: "💪", color: "#39FF14", unlocked: true },
  { name: "La Sardine", description: "Signalé un train bondé 10 fois", icon: "🐟", color: "#FF3B30", unlocked: true },
  { name: "L'Oracle", description: "10 prédictions correctes d'affilée", icon: "🔮", color: "#BF5AF2", unlocked: true },
  { name: "Le Maudit", description: "Perdu 5 paris d'affilée", icon: "💀", color: "#8B0000", unlocked: false },
];

// 2. Les Settings (Statique, contient des références d'icônes)
export const PROFILE_SETTINGS = [
  { icon: Bell, label: "Notifications" },
  { icon: UserPlus, label: "Inviter un pote de galère" },
  { icon: HelpCircle, label: "Support" },
  { icon: Trash2, label: "Reset Save (Dev)", action: "reset", danger: true },
];

// 3. Les Stats (DYNAMIQUE -> C'est une fonction !)
export const getProfileStats = (currentBalance) => [
  { label: "RageCoins", value: currentBalance, icon: "🪙" },
  { label: "Trains Annulés", value: "12", icon: "☠️" },
  { label: "Heures Perdues", value: "42h", icon: "⏳" },
  { label: "Taux de Victoire", value: "65%", icon: "📈" },
];
// src/constants/data.js

// ... (Tes autres exports : FAKE_TRAIN_RESULTS, PROFILE_BADGES...)

export const INITIAL_INVENTORY = [
  { 
    id: "skin_default", 
    name: "Recrue", 
    price: 0, 
    unlocked: true, 
    type: 'none', // Pas d'aura
    colors: [] 
  },
  { 
    id: "skin_plasma", 
    name: "Plasma", 
    price: 1500, 
    unlocked: false, 
    type: 'rotate', // Aura qui tourne
    colors: ['#FF00FF', '#00FFFF'] // Violet vers Cyan
  },
  { 
    id: "skin_gold", 
    name: "Légendaire", 
    price: 5000, 
    unlocked: false, 
    type: 'rotate', 
    colors: ['#FFD700', '#FFA500', '#FFD700'] // Or brillant
  },
  { 
    id: "skin_neon_green", 
    name: "Sonar", 
    price: 500, 
    unlocked: true, 
    type: 'sonar', // <--- ESSAIE CELUI-LA !
    colors: [COLORS.neonRed, COLORS.purple] 
  },
  
  { 
    id: "skin_plasma", 
    name: "Orbit", 
    price: 1500, 
    unlocked: false, 
    type: 'orbit', // <--- ESSAIE CELUI-LA !
    colors: ['#FF00FF', '#00FFFF'] 
  },

  { 
    id: "skin_custom_fire", 
    name: "Contour Plasma", 
    price: 6000, 
    unlocked: false, 
    type: 'lottie',
    source: 'https://lottie.host/cd54d04c-722d-4173-afcb-7b063afd9eff/ukeR1lIKoL.lottie',
    scale: 3.3, // <--- TYPE : Lottie // <--- SOURCE : Ton fichier local
  },

  { 
    id: "skin_custom_plasma", 
    name: "Contour Plasma fire", 
    price: 6000, 
    unlocked: false, 
    type: 'lottie',
    source: 'https://lottie.host/49e14301-977f-4097-a90e-e1d1681094af/FYKMQdUGLh.lottie',
    scale: 1.6, // <--- TYPE : Lottie // <--- SOURCE : Ton fichier local
  },
  { 
    id: "skin_custom_plasma2", 
    name: "Contour Plasma fire", 
    price: 10, 
    unlocked: false, 
    type: 'lottie',
    source: 'https://lottie.host/b4dbd8d5-52b2-4757-9841-c04bc584a8ef/3S76qO9Lg7.lottie',
    scale: 1.6, // <--- TYPE : Lottie // <--- SOURCE : Ton fichier local
  },
  { 
    id: "skin_custom_plasma3", 
    name: "Contour Plasma fire", 
    price: 10, 
    unlocked: false, 
    type: 'lottie',
    source: 'https://lottie.host/160dcd8d-562c-4ac2-b0b7-c54ee6e67290/grbcFbCvM1.lottie',
    scale: 1.6, // <--- TYPE : Lottie // <--- SOURCE : Ton fichier local
  },
];

// Tu peux aussi déplacer les amis initiaux ici si tu veux
export const INITIAL_FRIENDS = [
  { id: "f1", pseudo: "ThomasLeTrain", avatar: "TT", score: 1250, color: "#39FF14" },
  { id: "f2", pseudo: "RetardMan", avatar: "RM", score: 200, color: "#FF3B30" },
];


