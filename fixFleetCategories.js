import admin from "firebase-admin";
import fs from "fs";

const serviceAccount = JSON.parse(
  fs.readFileSync("./serviceAccountKey.json", "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

function detectCategory(id) {
  id = id.toLowerCase();

  if (id.startsWith("obs-air-")) return "air";
  if (id.startsWith("obs-grd-")) return "grd";
  if (id.startsWith("obs-sea-")) return "sea";
  if (id.startsWith("obs-com-")) return "com";
  if (id.startsWith("obs-ex-")) return "ex";

  return "unknown";
}

async function fix() {
  try {
    const snap = await db.collection("fleetUnits").get();

    let updated = 0;

    for (const doc of snap.docs) {
      const id = doc.id;
      const data = doc.data();

      const correct = detectCategory(id);

      if (data.category !== correct) {
        await doc.ref.set(
          { category: correct },
          { merge: true }
        );

        console.log(`FIXED: ${id} → ${correct}`);
        updated++;
      }
    }

    console.log(`DONE. Total fixed: ${updated}`);
    process.exit(0);

  } catch (err) {
    console.error("FAILED:", err.message);
    process.exit(1);
  }
}

fix();