import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFunctions } from 'firebase/functions';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Firebase Configuration - قيم تجريبية للتطوير
// سيتم استبدال هذه القيم بالقيم الحقيقية من فريق Backend
const firebaseConfig = {
  apiKey: "demo-api-key-nexus-ai",
  authDomain: "nexus-ai-azizsys.firebaseapp.com",
  projectId: "nexus-ai-azizsys",
  storageBucket: "nexus-ai-azizsys.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789"
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);

// تصدير الخدمات
export const auth = getAuth(app);
export const functions = getFunctions(app);
export const storage = getStorage(app);

// Analytics (optional - يتم تفعيلها في الإنتاج فقط)
export const analytics = typeof window !== 'undefined' 
  ? getAnalytics(app) 
  : null;

// Data Connect - سيتم إضافتها عند جاهزية Schema من فريق Backend
// import { connectDataConnect } from '@firebase/data-connect';
// export const dataConnect = connectDataConnect(app, {
//   connector: process.env.REACT_APP_DATA_CONNECT_CONNECTOR || 'default',
//   location: process.env.REACT_APP_DATA_CONNECT_LOCATION || 'us-central1'
// });

export default app;