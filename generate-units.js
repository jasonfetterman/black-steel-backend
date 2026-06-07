const fs = require("fs");

// 🔥 PUT YOUR 51 FIREBASE IDS HERE (ADD THE REST LATER IF NEEDED)
const units = [
  "obs-air-warden",
  "obs-air-beacon",
  "obs-air-drop",
  "obs-air-iris",
  "obs-air-sentinel",
  "obs-air-scout-eye",
  "obs-air-inspect",
  "obs-air-lidar",
  "obs-air-lifeline",
  "obs-air-link",
  "obs-air-locator",
  "obs-air-cartographer",
  "obs-air-mesh",
  "obs-air-nightguard",
  "obs-air-overseer",
  "obs-air-trailblazer",
  "obs-air-relay",
  "obs-air-response",
  "obs-air-sar",
  "obs-air-scout",
  "obs-air-nexusgrid",
  "obs-air-spotter",
  "obs-air-survey",
  "obs-air-terrain",
  "obs-air-thermal",
  "obs-air-tracker",
  "obs-air-vector",
  "obs-air-watchtower",

  "obs-com-archive",
  "obs-com-worldmap",
  "obs-com-command",
  "obs-com-fusion",
  "obs-com-core",
  "obs-com-insight",

  "obs-ex-echo",
  "obs-ex-nullpoint",
  "obs-ex-specter",
  "obs-ex-shadowgrid",

  "obs-grd-bulldog",
  "obs-grd-forge",
  "obs-grd-hammer",
  "obs-grd-ironwalker",
  "obs-grd-mule",
  "obs-grd-patrol",
  "obs-grd-rescue",
  "obs-grd-scout",
  "obs-grd-sentinel",

  "obs-sea-current",
  "obs-sea-rescue",
  "obs-sea-scout",
  "obs-sea-sonar"
];

// 🔥 TEMPLATE (AEGIS STYLE)
function buildPage(id) {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>${id.toUpperCase()}</title>

<style>
body {
    margin:0;
    background:#0b0f14;
    color:#e6e6e6;
    font-family:Arial, sans-serif;
}

.container {
    padding:40px;
}

.card {
    background:#0f151c;
    border:1px solid #1f2a35;
    padding:20px;
    max-width:700px;
}

.status {
    margin-top:15px;
    display:flex;
    align-items:center;
    gap:8px;
}

.dot {
    width:10px;
    height:10px;
    border-radius:50%;
}

.online { background:#2cff88; }
.offline { background:#ff4f4f; }
.maintenance { background:#ffd24f; }
.degraded { background:#ff9f2c; }
</style>
</head>

<body>

<div class="container">
    <div class="card" id="unitCard">Loading...</div>
</div>

<script type="module">
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "YOUR_KEY",
    authDomain: "YOUR_DOMAIN",
    projectId: "black-steel-6a724"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const id = "${id}";

function norm(v){
    return (v || "").toString().trim().toLowerCase();
}

async function load(){
    const ref = doc(db, "fleetUnits", id);
    const snap = await getDoc(ref);

    if(!snap.exists()){
        document.getElementById("unitCard").innerHTML = "UNIT NOT FOUND";
        return;
    }

    const d = snap.data();

    const status = norm(d.status);

    document.getElementById("unitCard").innerHTML = \`
        <h2>\${id.toUpperCase()}</h2>

        <div>NAME: \${d.name || "N/A"}</div>
        <div>TYPE: \${d.type || "N/A"}</div>

        <div class="status">
            <span class="dot \${status}"></span>
            \${status.toUpperCase()}
        </div>

        <hr>

        <div>\${d.description || ""}</div>

        <h4>CAPABILITIES</h4>
        <ul>
            \${(d.capabilities || []).map(c => \`<li>\${c}</li>\`).join("")}
        </ul>

        <h4>BASE COST</h4>
        $ \${d.baseCost || 0} / hour
    \`;
}

load();
</script>

</body>
</html>`;
}

// 🔥 GENERATE FILES
units.forEach(id => {
  fs.writeFileSync(`${id}.html`, buildPage(id));
});

console.log("DONE: 51 unit pages generated");