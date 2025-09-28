import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase config object, information comes from Firebase and is safe to put in our code like this - Drew
const firebaseConfig = {
  apiKey: "AIzaSyD5H47l8jzAJeve392CLEPPRVWFad40KJE",
  authDomain: "agrogo-c4f0e.firebaseapp.com",
  projectId: "agrogo-c4f0e",
  storageBucket: "agrogo-c4f0e.firebasestorage.app",
  messagingSenderId: "811174867409",
  appId: "1:811174867409:web:165003e239e8e0cc11f0f0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Auth instance
export const auth = getAuth(app);