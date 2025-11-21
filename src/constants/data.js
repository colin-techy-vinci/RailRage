import { Bell, UserPlus, HelpCircle, Trash2 } from "lucide-react-native";
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