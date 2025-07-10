// electron/scripts/init-db.js
const Database = require('better-sqlite3');
const db = new Database('tricks.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS subjects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE
  );
`);

console.log('Database initialized successfully!');
db.close();