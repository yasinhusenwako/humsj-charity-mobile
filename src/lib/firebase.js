// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBhZnYTGTKoFpFPi8EzgYVlO_dZho9VBs4",
  authDomain: "humsj-charity.firebaseapp.com",
  projectId: "humsj-charity",
  storageBucket: "humsj-charity.firebasestorage.app",
  messagingSenderId: "493349195104",
  appId: "1:493349195104:web:86eb158b513e03fb822205",
  measurementId: "G-T9N7GYT1CD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
