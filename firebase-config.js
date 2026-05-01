import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: import.meta.env?.VITE_FIREBASE_API_KEY || "AIzaSyB0wi6vKhtdLuaDIk7v2HqrrBQIH-5QKvg",
    authDomain: import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN || "jerseyjerkchicken.firebaseapp.com",
    projectId: import.meta.env?.VITE_FIREBASE_PROJECT_ID || "jerseyjerkchicken",
    storageBucket: import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET || "jerseyjerkchicken.firebasestorage.app",
    messagingSenderId: import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID || "583518788001",
    appId: import.meta.env?.VITE_FIREBASE_APP_ID || "1:583518788001:web:ce25f7e4f5c7dc24d413e0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };