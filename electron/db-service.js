import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Create database connection
const db = await open({
  filename: 'tricks.db',
  driver: sqlite3.Database
});

// Initialize database schema
await db.exec(`
  CREATE TABLE IF NOT EXISTS subjects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE
  );
`);

// Function to get subjects
export const getSubjects = async () => {
  return db.all('SELECT id, name FROM subjects');
};