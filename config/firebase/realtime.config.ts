
import { getDatabase } from "firebase/database";
import { initializeApp } from "firebase/app";

// TODO: Replace with your Firebase config from your FIR
const firebaseConfig = {
  apiKey: "AIzaSyDNigeaS3tyY809X9KCKMNRGB6LgkO6BmY",
  authDomain: "gen-lang-client-0147492600.firebaseapp.com",
  projectId: "gen-lang-client-0147492600",
  databaseURL: "https://gen-lang-client-0147492600.firebaseio.com",
  storageBucket: "gen-lang-client-0147492600.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
