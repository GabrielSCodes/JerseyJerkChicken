import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyB0wi6vKhtdLuaDIk7v2HqrrBQIH-5QKvg",
    authDomain: "jerseyjerkchicken.firebaseapp.com",
    projectId: "jerseyjerkchicken",
    storageBucket: "jerseyjerkchicken.firebasestorage.app",
    messagingSenderId: "583518788001",
    appId: "1:583518788001:web:ce25f7e4f5c7dc24d413e0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };