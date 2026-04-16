import { auth, db } from "./firebase-config.js";

const popup = document.getElementById("myPopup");
document.getElementById("openBtn").onclick = () => popup.style.display = "block";
document.getElementById("closeBtn").onclick = () => popup.style.display = "none";