const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "database.json");

function loadDB() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({
      users: {},
      ownership: {},
      purchases: []
    }, null, 2));
  }

  return JSON.parse(fs.readFileSync(DB_PATH));
}

function saveDB(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

function getUser(db, userId) {
  if (!db.users[userId]) {
    db.users[userId] = {
      owned: [],
      purchases: [],
      licenseKeys: []
    };
  }
  return db.users[userId];
}

module.exports = {
  loadDB,
  saveDB,
  getUser
};