import { auth, db } from "./firebase-config.js";

const popup1 = document.getElementById("myPopup1");
document.getElementById("openBtn1").onclick = () => popup1.style.display = "block";
document.getElementById("closeBtn1").onclick = () => popup1.style.display = "none";
const popup2 = document.getElementById("myPopup2");
document.getElementById("openBtn2").onclick = async () => { popup2.style.display = "block"; popup1.style.display = "none";};
document.getElementById("closeBtn2").onclick = () => popup2.style.display = "none";

import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import {
    addDoc,
    collection,
    query,
    where,
    getDocs,
    updateDoc,
    doc,
    serverTimestamp,
    arrayUnion,
    onSnapshot,
    getDoc,
    setDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const provider = new GoogleAuthProvider();
function setupGoogleSignIn() {
    const signInButton = document.getElementById("google");
    if (!signInButton) return;

    signInButton.addEventListener("click", async () => {
        try {
            await signInWithPopup(auth, provider);
            window.location.href = "menu.html";
        } catch (error) {
            console.error("Google sign-in failed:", error);
            alert("Google sign-in failed. Please try again.");
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    setupGoogleSignIn();

    onAuthStateChanged(auth, (user) => {
       
    });
});

