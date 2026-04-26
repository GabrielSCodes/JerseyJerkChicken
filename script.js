import { auth, db } from "./firebase-config.js";
import {
    GoogleAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,  
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

//Login
const popup1 = document.getElementById("myPopup1");
document.getElementById("openBtn1").onclick = () => popup1.style.display = "block";
document.getElementById("closeBtn1").onclick = () => popup1.style.display = "none";
const popup2 = document.getElementById("myPopup2");
document.getElementById("openBtn2").onclick = async () => { popup2.style.display = "block"; popup1.style.display = "none";};
document.getElementById("closeBtn2").onclick = () => popup2.style.display = "none";
document.getElementById("back1").onclick = async () => { popup1.style.display = "block"; popup2.style.display = "none";};
const popup3 = document.getElementById("myPopup3");
document.getElementById("openBtn3").onclick = () =>  { popup3.style.display = "block"; popup1.style.display = "none";};
document.getElementById("closeBtn3").onclick = () => popup3.style.display = "none";
document.getElementById("back2").onclick = async () => { popup1.style.display = "block"; popup3.style.display = "none";};
popup1.style.display = "none";
popup2.style.display = "none";
popup3.style.display = "none";

//Sidebars
const sidebar1 = document.getElementById("sidebar1");
document.getElementById("open-sidebar").onclick = () => sidebar1.style.left = "0";
document.getElementById("close-sidebar").onclick = () => sidebar1.style.left = "-251px";


//Google SignIn
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
//Signup
document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("signupForm");
    if (!signupForm) return;
  
    signupForm.addEventListener("submit", async (event) => {
      event.preventDefault();
  
      
      const email = document.getElementById("emailInput1").value;
      const password = document.getElementById("passwordInput1").value;
      const fname = document.getElementById("fname").value;
      const lname = document.getElementById("lname").value;
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
  
        // Save user info to Firestore
        await setDoc(doc(db, "users", user.uid), {
            email: email,
            fname: fname,
            lname: lname,
            createdAt: serverTimestamp()
        });
  
        alert("User signed up successfully!");
        window.location.href = "menu.html";
      } catch (error) {
        alert("Error signing up: " + error.message);
        console.error("Signup error:", error);
      }
    });
  });
//Login
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    if (!loginForm) return;
  
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
  
      const email = document.getElementById("emailInput2").value;
      const password = document.getElementById("passwordInput2").value;
  
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        alert("Logged in successfully!");
        window.location.href = "menu.html";
      } catch (error) {
        alert("Error logging in: " + error.message);
        console.error("Login error:", error);
      }
    });
  });

document.addEventListener("DOMContentLoaded", () => {
    setupGoogleSignIn();
    
    onAuthStateChanged(auth, (user) => {
        
    });
});

// Rate Stars onClick Function
document.addEventListener("DOMContentLoaded", () => {
    const stars = document.querySelectorAll('.star');
    let currentRating = 0;

    stars.forEach(star => {
        star.addEventListener('click', () => {
            currentRating = parseInt(star.dataset.index);
            updateStars();
        });

        star.addEventListener('mouseover', () => {
            const hoverValue = parseInt(star.dataset.index);
            updateStars(hoverValue);
        });

        star.addEventListener('mouseout', () => {
            updateStars();
        });
    });

    function updateStars(hoverValue = 0) {
        stars.forEach((s, i) => {
            const index = i + 1;
            s.src = index <= (hoverValue || currentRating)
                ? "assets/stars/yellow.svg"
                : "assets/stars/blank.svg";
        });
    }
});

/*
// ------------------------------
// Firebase Imports
// ------------------------------
import { auth, db } from "./firebase-config.js";
import {
    GoogleAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
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


// ------------------------------
// SAFE DOM HELPER
// ------------------------------
function on(id, event, handler) {
    const el = document.getElementById(id);
    if (el) el.addEventListener(event, handler);
    return el;
}


// ------------------------------
// LOGIN POPUPS (SAFE)
// ------------------------------
const popup1 = document.getElementById("myPopup1");
const popup2 = document.getElementById("myPopup2");
const popup3 = document.getElementById("myPopup3");

on("openBtn1", "click", () => popup1 && (popup1.style.display = "block"));
on("closeBtn1", "click", () => popup1 && (popup1.style.display = "none"));

on("openBtn2", "click", () => {
    if (popup1 && popup2) {
        popup1.style.display = "none";
        popup2.style.display = "block";
    }
});
on("closeBtn2", "click", () => popup2 && (popup2.style.display = "none"));
on("back1", "click", () => {
    if (popup1 && popup2) {
        popup2.style.display = "none";
        popup1.style.display = "block";
    }
});

on("openBtn3", "click", () => {
    if (popup1 && popup3) {
        popup1.style.display = "none";
        popup3.style.display = "block";
    }
});
on("closeBtn3", "click", () => popup3 && (popup3.style.display = "none"));
on("back2", "click", () => {
    if (popup1 && popup3) {
        popup3.style.display = "none";
        popup1.style.display = "block";
    }
});


// ------------------------------
// SIDEBAR (SAFE)
// ------------------------------
const sidebar1 = document.getElementById("sidebar1");

on("open-sidebar", "click", () => sidebar1 && (sidebar1.style.left = "0"));
on("close-sidebar", "click", () => sidebar1 && (sidebar1.style.left = "-251px"));


// ------------------------------
// GOOGLE SIGN-IN (SAFE)
// ------------------------------
const provider = new GoogleAuthProvider();

function setupGoogleSignIn() {
    const googleBtn = document.getElementById("google");
    if (!googleBtn) return;

    googleBtn.addEventListener("click", async () => {
        try {
            await signInWithPopup(auth, provider);
            window.location.href = "menu.html";
        } catch (error) {
            console.error("Google sign-in failed:", error);
            alert("Google sign-in failed. Please try again.");
        }
    });
}


// ------------------------------
// SIGNUP FORM (SAFE)
// ------------------------------
on("signupForm", "submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("emailInput1")?.value;
    const password = document.getElementById("passwordInput1")?.value;
    const fname = document.getElementById("fname")?.value;
    const lname = document.getElementById("lname")?.value;

    if (!email || !password) return;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
            email,
            fname,
            lname,
            createdAt: serverTimestamp()
        });

        alert("User signed up successfully!");
        window.location.href = "menu.html";
    } catch (error) {
        alert("Error signing up: " + error.message);
    }
});


// ------------------------------
// LOGIN FORM (SAFE)
// ------------------------------
on("loginForm", "submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("emailInput2")?.value;
    const password = document.getElementById("passwordInput2")?.value;

    if (!email || !password) return;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Logged in successfully!");
        window.location.href = "menu.html";
    } catch (error) {
        alert("Error logging in: " + error.message);
    }
});


// ------------------------------
// STAR RATING SYSTEM (SAFE)
// ------------------------------
document.addEventListener("DOMContentLoaded", () => {
    const stars = document.querySelectorAll(".star");
    if (!stars.length) return; // No stars on this page

    let currentRating = 0;

    stars.forEach(star => {
        star.addEventListener("click", () => {
            currentRating = parseInt(star.dataset.index);
            updateStars();
        });

        star.addEventListener("mouseover", () => {
            updateStars(parseInt(star.dataset.index));
        });

        star.addEventListener("mouseout", () => {
            updateStars();
        });
    });

    function updateStars(hoverValue = 0) {
        stars.forEach((s, i) => {
            const index = i + 1;
            s.src = index <= (hoverValue || currentRating)
                ? "assets/stars/yellow.svg"
                : "assets/stars/blank.svg";
        });
    }
});


// ------------------------------
// INIT
// ------------------------------
document.addEventListener("DOMContentLoaded", () => {
    setupGoogleSignIn();
    onAuthStateChanged(auth, () => {});
});
*/
