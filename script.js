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
const openBtn1 = document.getElementById("openBtn1");
if (openBtn1) {
    openBtn1.onclick = () => {
        if (popup1) {
            popup1.style.display = "block";
            return;
        }
        window.location.href = "home.html";
    };
}
const closeBtn1 = document.getElementById("closeBtn1");
if (closeBtn1 && popup1) {
    closeBtn1.onclick = () => popup1.style.display = "none";
}
const popup2 = document.getElementById("myPopup2");
const openBtn2 = document.getElementById("openBtn2");
if (openBtn2) {
    openBtn2.onclick = async () => {
        if (popup2) popup2.style.display = "block";
        if (popup1) popup1.style.display = "none";
    };
}
const closeBtn2 = document.getElementById("closeBtn2");
if (closeBtn2 && popup2) {
    closeBtn2.onclick = () => popup2.style.display = "none";
}
const back1 = document.getElementById("back1");
if (back1) {
    back1.onclick = async () => {
        if (popup1) popup1.style.display = "block";
        if (popup2) popup2.style.display = "none";
    };
}
const popup3 = document.getElementById("myPopup3");
const openBtn3 = document.getElementById("openBtn3");
if (openBtn3) {
    openBtn3.onclick = () => {
        if (popup3) popup3.style.display = "block";
        if (popup1) popup1.style.display = "none";
    };
}
const closeBtn3 = document.getElementById("closeBtn3");
if (closeBtn3 && popup3) {
    closeBtn3.onclick = () => popup3.style.display = "none";
}
const back2 = document.getElementById("back2");
if (back2) {
    back2.onclick = async () => {
        if (popup1) popup1.style.display = "block";
        if (popup3) popup3.style.display = "none";
    };
}
if (popup1) popup1.style.display = "none";
if (popup2) popup2.style.display = "none";
if (popup3) popup3.style.display = "none";

let currentUser = auth.currentUser || null;
const navButton = document.getElementById("openBtn1");
let userDetailsButton = document.getElementById("userDetails");
let userDropdown = document.getElementById("userDropdown");
if (!userDetailsButton && navButton) {
    userDetailsButton = document.createElement("button");
    userDetailsButton.id = "userDetails";
    userDetailsButton.className = "user-details";
    userDetailsButton.type = "button";
    userDetailsButton.style.display = "none";
    userDetailsButton.style.whiteSpace = "pre-line";
    userDetailsButton.addEventListener("click", () => {
        if (!userDropdown) return;
        userDropdown.style.display = userDropdown.style.display === "block" ? "none" : "block";
    });

    userDropdown = document.createElement("div");
    userDropdown.id = "userDropdown";
    userDropdown.className = "user-dropdown";
    userDropdown.style.display = "none";

    const logoutBtn = document.createElement("button");
    logoutBtn.id = "logoutBtn";
    logoutBtn.className = "logoutBtn";
    logoutBtn.type = "button";
    logoutBtn.textContent = "Log Out";
    logoutBtn.addEventListener("click", async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            window.location.reload();
        }
    });

    userDropdown.appendChild(logoutBtn);
    navButton.insertAdjacentElement("afterend", userDetailsButton);
    navButton.insertAdjacentElement("afterend", userDropdown);

    document.addEventListener("click", (event) => {
        if (!userDropdown || !userDetailsButton) return;
        if (!userDetailsButton.contains(event.target) && !userDropdown.contains(event.target)) {
            userDropdown.style.display = "none";
        }
    });
}

async function updateNavbarForUser(user) {
    if (!navButton || !userDetailsButton || !userDropdown) return;

    if (!user) {
        navButton.style.display = "inline-block";
        userDetailsButton.style.display = "none";
        userDropdown.style.display = "none";
        return;
    }

    navButton.style.display = "none";
    userDetailsButton.style.display = "inline-flex";
    userDropdown.style.display = "none";

    let displayName = user.displayName || "";
    if (!displayName) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            const data = userDoc.data();
            displayName = [data.fname, data.lname].filter(Boolean).join(" ");
        }
    }

    userDetailsButton.textContent = `${displayName || "User"}\n${user.email || ""}`;
}

const roleSidebarDefinitions = {
    customer: {
        id: "sidebar1",
        title: "CUSTOMER",
        links: [
            { label: "View Menu", href: "menu.html" },
            { label: "Write a Review!", href: "review.html" },
            { label: "Apply for a Job Now!", href: "job.html" }
        ],
        allowedPages: ["home.html", "menu.html", "review.html", "job.html", ""]
    },
    waiter: {
        id: "sidebar2",
        title: "WAITER",
        links: [
            { label: "Create Order", href: "createOrder.html" },
            { label: "Manage Tables", href: "tables.html" },
            { label: "Clock In", href: "clockIn.html" }
        ],
        allowedPages: ["home.html", "createOrder.html", "tables.html", "clockIn.html"]
    },
    chef: {
        id: "sidebar3",
        title: "CHEF",
        links: [
            { label: "Customer Orders", href: "viewOrders.html" },
            { label: "Inventory Management", href: "inventory.html" },
            { label: "Clock In", href: "clockIn.html" }
        ],
        allowedPages: ["home.html", "viewOrders.html", "inventory.html", "clockIn.html"]
    },
    manager: {
        id: "sidebar4",
        title: "MANAGER",
        links: [
            { label: "Accounting", href: "accounting.html" },
            { label: "Staff Management", href: "staff.html" },
            { label: "Job Applicants", href: "applicant.html" },
            { label: "Inventory Management", href: "inventory.html" },
            { label: "Clock In", href: "clockIn.html" }
        ],
        allowedPages: ["home.html", "accounting.html", "staff.html", "applicant.html", "inventory.html", "clockIn.html"]
    },
    owner: {
        id: "sidebar5",
        title: "OWNER",
        links: [
            { label: "Accounting", href: "accounting.html" },
            { label: "Staff Management", href: "staff.html" },
            { label: "Job Applicants", href: "applicant.html" },
            { label: "Inventory Management", href: "inventory.html" }
        ],
        allowedPages: ["home.html", "accounting.html", "staff.html", "applicant.html", "inventory.html"]
    }
};
let currentRole = "customer";

function injectSharedStyles() {
    if (document.getElementById("navbar-user-styles")) return;
    const style = document.createElement("style");
    style.id = "navbar-user-styles";
    style.textContent = `
.nav-alignment2 { position: relative; }
.user-details {
    font-family: "Bpmf Huninn", cursive;
    color: white;
    background: transparent;
    border: 1px solid white;
    border-radius: 0.5rem;
    padding: 0.35rem 0.8rem;
    text-align: center;
    white-space: pre-line;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    line-height: 1.2;
    cursor: pointer;
}
.user-dropdown {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    background: #761B1B;
    border: 1px solid white;
    border-radius: 0.5rem;
    display: none;
    min-width: 120px;
    z-index: 1001;
}
.logoutBtn {
    width: 100%;
    color: white;
    background: transparent;
    border: none;
    padding: 0.8rem;
    text-align: left;
    font-family: "Bpmf Huninn", cursive;
    cursor: pointer;
}
.logoutBtn:hover {
    background: rgba(255, 255, 255, 0.12);
}
.sidebar {
    width: 250px;
    height: 100vh;
    background-color: #761B1B;
    position: fixed;
    top: 0;
    left: -251px;
    transition: left 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-right: 1px solid white;
    z-index: 1000;
}
.side-container {
    display: flex;
    flex-direction: column;
    gap: 100px;
    margin-top: 50px;
}
.sbTitle {
    font-family: "Dancing Script", cursive;
    font-weight: 400;
    font-size: 40px;
    color: white;
    margin-top: 30px;
}
.path {
    font-family: "Dancing Script", cursive;
    font-weight: 400;
    font-size: 22px;
    color: white;
    background-color: transparent;
    border: none;
    display: flex;
    cursor: pointer;
    width: 230px;
    justify-content: space-between;
    border-bottom: 1px solid white;
    padding: 10px;
}
.close-sidebar {
    position: absolute;
    top: 15px;
    right: 15px;
    width: 24px;
    cursor: pointer;
}
`;
    document.head.appendChild(style);
}

injectSharedStyles();

function removeStaticSidebars() {
    document.querySelectorAll(".sidebar").forEach((el) => el.remove());
}

function createRoleSidebars() {
    if (document.getElementById("roleSidebarContainer")) return;
    removeStaticSidebars();

    const container = document.createElement("div");
    container.id = "roleSidebarContainer";

    Object.values(roleSidebarDefinitions).forEach((role) => {
        const sidebar = document.createElement("div");
        sidebar.className = "sidebar";
        sidebar.id = role.id;

        const title = document.createElement("p");
        title.className = "sbTitle";
        title.textContent = role.title;
        sidebar.appendChild(title);

        const closeImg = document.createElement("img");
        closeImg.src = "assets/exit.png";
        closeImg.alt = "Close";
        closeImg.className = "close-sidebar";
        closeImg.addEventListener("click", hideAllSidebars);
        sidebar.appendChild(closeImg);

        const sideContainer = document.createElement("div");
        sideContainer.className = "side-container";

        role.links.forEach((link) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "path";
            btn.textContent = link.label;
            btn.addEventListener("click", () => {
                window.location.href = link.href;
            });
            sideContainer.appendChild(btn);
        });

        sidebar.appendChild(sideContainer);
        container.appendChild(sidebar);
    });

    document.body.appendChild(container);
}

function hideAllSidebars() {
    Object.values(roleSidebarDefinitions).forEach((role) => {
        const sidebar = document.getElementById(role.id);
        if (sidebar) sidebar.style.left = "-251px";
    });
}

function showSidebarForRole(role) {
    hideAllSidebars();
    const sidebar = document.getElementById(roleSidebarDefinitions[role]?.id);
    if (sidebar) sidebar.style.left = "0";
}

async function getUserRole(user) {
    if (!user || !user.email) return "customer";
    try {
        const employeesQuery = query(collection(db, "employees"), where("email", "==", user.email));
        const querySnapshot = await getDocs(employeesQuery);
        if (!querySnapshot.empty) {
            const data = querySnapshot.docs[0].data();
            return data.title?.toLowerCase() || "customer";
        }
    } catch (error) {
        console.error("Error fetching employee role:", error);
    }
    return "customer";
}

function enforceRoleAccess(role) {
    const pageName = window.location.pathname.split("/").pop();
    const allowed = roleSidebarDefinitions[role]?.allowedPages || roleSidebarDefinitions.customer.allowedPages;
    if (!allowed.includes(pageName)) {
        window.location.href = "home.html";
    }
}

function capitalize(text) {
    if (!text || typeof text !== "string") return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function canTerminateEmployee(targetEmail, targetTitle) {
    if (!currentUser) return false;
    const lowerTitle = String(targetTitle || "").toLowerCase();
    if (currentRole === "owner") {
        return currentUser.email !== targetEmail;
    }
    if (currentRole === "manager") {
        return lowerTitle !== "owner";
    }
    return false;
}

const openSidebar = document.getElementById("open-sidebar") || document.getElementById("burgerMenu");
if (openSidebar) {
    openSidebar.onclick = async () => {
        if (!currentUser) {
            if (popup1) {
                popup1.style.display = "block";
                return;
            }
            window.location.href = "home.html";
            return;
        }
        createRoleSidebars();
        showSidebarForRole(currentRole);
    };
}

//Google SignIn
const provider = new GoogleAuthProvider();
function setupGoogleSignIn() {
    const signInButton = document.getElementById("google");
    if (!signInButton) return;

    signInButton.addEventListener("click", async () => {
        try {
            await signInWithPopup(auth, provider);
            window.location.reload();
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
        window.location.reload();
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
        window.location.reload();
      } catch (error) {
        alert("Error logging in: " + error.message);
        console.error("Login error:", error);
      }
    });
  });

document.addEventListener("DOMContentLoaded", () => {
    setupGoogleSignIn();

    const applicationForm = document.getElementById("apply");
    if (applicationForm) {
      applicationForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!currentUser) {
          alert("Please sign in on the home page before applying.");
          return;
        }

        const position = document.getElementById("positions")?.value;
        const qualifications = document.getElementById("qual")?.value?.trim();

        if (!position) {
          alert("Field required");
          return;
        }

        if (!qualifications) {
          alert("Field required");
          return;
        }

        let applicantName = currentUser.displayName || "";
        if (!applicantName) {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            applicantName = [data.fname, data.lname].filter(Boolean).join(" ");
          }
        }

        if (!applicantName) {
          applicantName = currentUser.email || "Unknown User";
        }

        try {
          const applicationData = {
            email: currentUser.email,
            name: applicantName,
            title: position,
            experience: qualifications,
            createdAt: serverTimestamp()
          };

          await addDoc(collection(db, "applications"), applicationData);

          alert("Application submitted successfully.");
          applicationForm.reset();
        } catch (error) {
          console.error("Application submission failed:", error);
          alert("There was an error submitting your application. Please try again.");
        }
      });
    }

    const applicantList = document.getElementById("applicantList");
    if (applicantList) {
      const renderApplicants = (docs) => {
        applicantList.innerHTML = "";
        docs.forEach((docSnapshot) => {
          const applicant = docSnapshot.data();
          const item = document.createElement("div");
          item.className = "applicantItem";

          const card = document.createElement("div");
          card.className = "employee_card";
          const nameSpan = document.createElement("span");
          nameSpan.textContent = `Name: ${applicant.name || applicant.email || "Unknown"}`;
          const experienceSpan = document.createElement("span");
          experienceSpan.textContent = `Experience: ${applicant.experience || ""}`;
          const positionSpan = document.createElement("span");
          positionSpan.textContent = `Position: ${applicant.title || ""}`;
          card.appendChild(nameSpan);
          card.appendChild(experienceSpan);
          card.appendChild(positionSpan);

          const actionRow = document.createElement("div");
          actionRow.className = "h_r";
          const hireButton = document.createElement("button");
          hireButton.className = "hire_rej";
          hireButton.textContent = "Hire Applicant";
          const rejectButton = document.createElement("button");
          rejectButton.className = "hire_rej";
          rejectButton.textContent = "Reject Applicant";

          hireButton.addEventListener("click", async () => {
            try {
              await addDoc(collection(db, "employees"), {
                email: applicant.email || "",
                experience: applicant.experience || "",
                hiredAt: serverTimestamp(),
                name: applicant.name || applicant.email || "",
                title: applicant.title || ""
              });
              await deleteDoc(doc(db, "applications", docSnapshot.id));
            } catch (error) {
              console.error("Hire applicant failed:", error);
              alert("Unable to hire applicant. Please try again.");
            }
          });

          rejectButton.addEventListener("click", async () => {
            try {
              await deleteDoc(doc(db, "applications", docSnapshot.id));
            } catch (error) {
              console.error("Reject applicant failed:", error);
              alert("Unable to delete applicant. Please try again.");
            }
          });

          actionRow.appendChild(hireButton);
          actionRow.appendChild(rejectButton);
          item.appendChild(card);
          item.appendChild(actionRow);
          applicantList.appendChild(item);
        });
      };

      const applicationsCollection = collection(db, "applications");
      onSnapshot(applicationsCollection, (snapshot) => {
        renderApplicants(snapshot.docs);
      }, (error) => {
        console.error("Application snapshot failed:", error);
      });
    }

    const orderList = document.getElementById("orderList");
    if (orderList) {
      const formatOrderTime = (timestamp) => {
        if (!timestamp) return "Ordered just now";
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const diffMinutes = Math.floor((Date.now() - date.getTime()) / 60000);
        if (diffMinutes < 1) return "Ordered just now";
        if (diffMinutes < 60) return `Ordered ${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;
        const diffHours = Math.floor(diffMinutes / 60);
        if (diffHours < 24) return `Ordered ${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
        const diffDays = Math.floor(diffHours / 24);
        return `Ordered ${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
      };

      const renderOrders = (docs) => {
        orderList.innerHTML = "";
        if (!docs.length) {
          const empty = document.createElement("p");
          empty.className = "empty-order";
          empty.textContent = "No orders have been created yet.";
          orderList.appendChild(empty);
          return;
        }

        docs.forEach((docSnapshot, index) => {
          const order = docSnapshot.data();
          const card = document.createElement("div");
          card.className = "order_card";

          const top = document.createElement("div");
          top.className = "top";

          const orderNumber = document.createElement("span");
          orderNumber.className = "tableNum";
          orderNumber.textContent = `Order #${index + 1}`;

          const info = document.createElement("span");
          info.className = "orderInfo";
          const itemLines = (order.items || []).map((item) => `${item.name} x${item.quantity}`).join("<br>");
          info.innerHTML = `Order:<br>${itemLines || "No items"}`;

          top.appendChild(orderNumber);
          top.appendChild(info);
          card.appendChild(top);

          const time = document.createElement("p");
          time.className = "time";
          time.textContent = formatOrderTime(order.createdAt);
          card.appendChild(time);

          orderList.appendChild(card);
        });
      };

      const ordersCollection = collection(db, "orders");
      onSnapshot(ordersCollection, (snapshot) => {
        renderOrders(snapshot.docs);
      }, (error) => {
        console.error("Orders snapshot failed:", error);
      });
    }

    const orderSidebar = document.getElementById("orderReceiptSidebar");
    const orderItemsElement = document.getElementById("orderItems");
    const orderTotalElement = document.getElementById("orderTotal");
    const submitOrderBtn = document.getElementById("submitOrderBtn");
    const closeOrderSidebarBtn = document.getElementById("closeOrderSidebar");
    const menuCards = document.querySelectorAll(".menuCard");

    let orderState = {};

    function formatPrice(value) {
      return Number(value || 0).toFixed(2);
    }

    function updateOrderDisplay() {
      const items = Object.values(orderState);
      const total = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
      if (orderTotalElement) orderTotalElement.textContent = formatPrice(total);

      if (!orderItemsElement) return;
      orderItemsElement.innerHTML = "";
      if (!items.length) {
        const empty = document.createElement("p");
        empty.className = "empty-order";
        empty.textContent = "Select items to build the order.";
        orderItemsElement.appendChild(empty);
        return;
      }

      items.forEach((item) => {
        const row = document.createElement("div");
        row.className = "receipt-item";

        const details = document.createElement("div");
        details.style.display = "flex";
        details.style.flexDirection = "column";
        details.style.gap = "6px";

        const nameEl = document.createElement("div");
        nameEl.className = "receipt-item-name";
        nameEl.textContent = item.name;

        const priceEl = document.createElement("div");
        priceEl.className = "item-price";
        priceEl.textContent = `$${formatPrice(item.unitPrice * item.quantity)}`;

        details.appendChild(nameEl);
        details.appendChild(priceEl);

        const controls = document.createElement("div");
        controls.className = "receipt-item-controls";

        const minus = document.createElement("button");
        minus.type = "button";
        minus.className = "quantity-button";
        minus.textContent = "-";
        minus.addEventListener("click", () => adjustOrderQuantity(item.name, -1));

        const qty = document.createElement("div");
        qty.className = "quantity-value";
        qty.textContent = item.quantity;

        const plus = document.createElement("button");
        plus.type = "button";
        plus.className = "quantity-button";
        plus.textContent = "+";
        plus.addEventListener("click", () => adjustOrderQuantity(item.name, 1));

        controls.appendChild(minus);
        controls.appendChild(qty);
        controls.appendChild(plus);

        row.appendChild(details);
        row.appendChild(controls);
        orderItemsElement.appendChild(row);
      });
    }

    function openOrderSidebar() {
      if (!orderSidebar) return;
      orderSidebar.classList.add("open");
    }

    function closeOrderSidebar() {
      if (!orderSidebar) return;
      orderSidebar.classList.remove("open");
    }

    function adjustOrderQuantity(name, delta) {
      const item = orderState[name];
      if (!item) return;
      item.quantity += delta;
      if (item.quantity <= 0) {
        delete orderState[name];
      }
      updateOrderDisplay();
    }

    function addItemToOrder(name, unitPrice) {
      if (!orderState[name]) {
        orderState[name] = { name, unitPrice, quantity: 0 };
      }
      orderState[name].quantity += 1;
      updateOrderDisplay();
      openOrderSidebar();
    }

    menuCards.forEach((card) => {
      card.addEventListener("click", () => {
        const nameEl = card.querySelector(".item_name");
        const priceEl = card.querySelector(".item_price");
        const name = nameEl?.textContent?.trim() || "Item";
        const priceText = priceEl?.textContent?.trim() || "0";
        const unitPrice = parseFloat(priceText.replace(/[^0-9.]/g, "")) || 0;
        addItemToOrder(name, unitPrice);
      });
    });

    if (closeOrderSidebarBtn) {
      closeOrderSidebarBtn.addEventListener("click", closeOrderSidebar);
    }

    if (submitOrderBtn) {
      submitOrderBtn.addEventListener("click", async () => {
        const items = Object.values(orderState);
        if (!items.length) {
          alert("Add items before submitting the order.");
          return;
        }

        const orderPayload = {
          createdAt: serverTimestamp(),
          items: items.map((item) => ({ name: item.name, quantity: item.quantity })),
          total: Number(orderTotalElement?.textContent) || 0,
          waiterEmail: currentUser?.email || auth.currentUser?.email || ""
        };

        try {
          await addDoc(collection(db, "orders"), orderPayload);
          orderState = {};
          updateOrderDisplay();
          closeOrderSidebar();
          alert("Order saved successfully.");
        } catch (error) {
          console.error("Order submission failed:", error);
          alert("Unable to submit order. Please try again.");
        }
      });
    }

    const employeeCount = document.getElementById("employeeCount");
    const employeeContainer = document.getElementById("employeeContainer");
    if (employeeContainer) {
      const renderEmployees = (docs) => {
        employeeContainer.innerHTML = "";
        const count = docs.length;
        if (employeeCount) employeeCount.textContent = `${count} People`;

        docs.forEach((docSnapshot) => {
          const employee = docSnapshot.data();
          const card = document.createElement("div");
          card.className = "employee_card";

          const img = document.createElement("img");
          img.className = "user";
          img.src = "assets/profile.png";
          img.alt = "userpfp";

          const nameP = document.createElement("p");
          nameP.textContent = employee.name || employee.email || "Unknown";

          const titleP = document.createElement("p");
          titleP.textContent = capitalize(employee.title || "");

          const allP = document.createElement("p");
          allP.textContent = "All";

          const terminateButton = document.createElement("button");
          terminateButton.className = "fire";
          terminateButton.type = "button";
          terminateButton.textContent = "Terminate";
          const allowed = canTerminateEmployee(employee.email, employee.title);
          if (!allowed) {
            terminateButton.disabled = true;
            terminateButton.style.opacity = "0.5";
            if (currentRole !== "owner" && currentRole !== "manager") {
              terminateButton.style.cursor = "not-allowed";
            }
          }

          terminateButton.addEventListener("click", async () => {
            if (!canTerminateEmployee(employee.email, employee.title)) return;
            try {
              await deleteDoc(doc(db, "employees", docSnapshot.id));
            } catch (error) {
              console.error("Terminate employee failed:", error);
              alert("Unable to terminate employee. Please try again.");
            }
          });

          card.appendChild(img);
          card.appendChild(nameP);
          card.appendChild(titleP);
          card.appendChild(allP);
          card.appendChild(terminateButton);
          employeeContainer.appendChild(card);
        });
      };

      const employeesCollection = collection(db, "employees");
      onSnapshot(employeesCollection, (snapshot) => {
        renderEmployees(snapshot.docs);
      }, (error) => {
        console.error("Employee snapshot failed:", error);
      });
    }

    onAuthStateChanged(auth, async (user) => {
        currentUser = user;
        await updateNavbarForUser(user);
        currentRole = await getUserRole(user);
        createRoleSidebars();
        enforceRoleAccess(currentRole);
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
