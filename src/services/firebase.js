import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyMockKeyForDevOnly_123456789",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "karsa-tiket-dev.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "karsa-tiket-dev",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "karsa-tiket-dev.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789012:web:abcdef123456"
};

// Singleton Firebase App instance
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Export Firestore Database instance
export const db = getFirestore(app);
export default app;
