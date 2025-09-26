import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase config object, information comes from Firebase and is safe to put in our code like this - Drew
const firebaseConfig = {
  apiKey: "AIzaSyD448I2rEq2TgALUiQQglRdGhaGw3nPnqA",
  authDomain: "agrogo-153e5.firebaseapp.com",
  projectId: "agrogo-153e5",
  storageBucket: "agrogo-153e5.firebasestorage.app",
  messagingSenderId: "740635863871",
  appId: "1:740635863871:web:57841f4a312baf515ac18a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Auth instance
export const auth = getAuth(app);