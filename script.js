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
  // Use event delegation on a parent container
  const starsContainer = document.querySelector(".stars_container"); // or another parent
  
  if (starsContainer) {
    starsContainer.addEventListener("click", (e) => {
      const star = e.target.closest(".star");
      if (!star) return;

      const currentSrc = star.getAttribute("src");
      
      if (!currentSrc) {
        console.warn("Star element has no src attribute");
        return;
      }

      // Toggle the star's image
      const newSrc = currentSrc.includes("blank.svg") 
        ? "assets/stars/yellow.svg" 
        : "assets/stars/blank.svg";
      
      star.setAttribute("src", newSrc);
    });
  }
});