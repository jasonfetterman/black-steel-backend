import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCbaJCjjzU9DdJFY28MXW3LYesDdYfzyqg",
    authDomain: "black-steel-6a724.firebaseapp.com",
    projectId: "black-steel-6a724"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function render(el, status) {
    if (!el) return;

    el.innerHTML = status
        ? `<span class="dot ${status}"></span> ${status.toUpperCase()}`
        : "";
}

async function load(docName, elId) {
    const ref = doc(db, "systemStatus", docName);
    const snap = await getDoc(ref);

    const data = snap.exists() ? snap.data() : null;
    const status = data?.status || null;

    render(document.getElementById(elId), status);
}

async function refresh() {
    await load("fleet", "fleetStatus");
    await load("technology", "techStatus");
    await load("services", "servicesStatus");
    await load("dashboard", "dashStatus");
}

refresh();
setInterval(refresh, 10000);