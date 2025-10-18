// Firebase Configuration
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyDNigeaS3tyY809X9KCKMNRGB6LgkO6BmY",
  authDomain: "nexus-ai-869672857667.firebaseapp.com",
  projectId: "nexus-ai-869672857667",
  storageBucket: "nexus-ai-869672857667.appspot.com",
  messagingSenderId: "869672857667",
  appId: "1:869672857667:web:nexus-ai"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);