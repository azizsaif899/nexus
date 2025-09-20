"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.firebaseConfig = void 0;
exports.getFirebaseApp = getFirebaseApp;
const app_1 = require("firebase/app");
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY || 'AIzaSyDNigeaS3tyY809X9KCKMNRGB6LgkO6BmY',
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'gen-lang-client-0147492600.firebaseapp.com',
    projectId: process.env.FIREBASE_PROJECT_ID || 'gen-lang-client-0147492600',
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'gen-lang-client-0147492600.firebasestorage.app',
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '869672857667',
    appId: process.env.FIREBASE_APP_ID || '1:869672857667:web:1604e7fa7df84b4dd3a4f6'
};
exports.firebaseConfig = firebaseConfig;
let app;
function getFirebaseApp() {
    if (!app) {
        app = (0, app_1.initializeApp)(firebaseConfig);
    }
    return app;
}
//# sourceMappingURL=firebase-config.js.map