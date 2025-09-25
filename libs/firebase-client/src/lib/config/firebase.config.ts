/**
 * @file Firebase Core Configuration (CRITICAL-001)
 * @description Initializes the Firebase app with credentials from environment variables.
 * This is the central configuration file for Firebase services, delivered urgently for INT team.
 *
 * @project gen-lang-client-0147492600
 */

import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: "gen-lang-client-0147492600",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
// This pattern prevents re-initialization in a hot-reload environment.
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export { app };
export default app;