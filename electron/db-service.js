import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { app } from 'electron';
import path from 'path';
import { z } from 'zod';

const trickSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  category: z.string().min(1, 'Category is required'),
  item: z.string().min(1, 'Item is required'),
  remark: z.string().optional(),
});

let db;

export async function initializeDB() {
  try {
    db = await open({
      filename: path.join(app.getPath('userData'), 'tricks.db'),
      driver: sqlite3.Database,
    });
    
    await db.exec(`
      CREATE TABLE IF NOT EXISTS subjects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE
      );
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE
      );
      CREATE TABLE IF NOT EXISTS entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        subject_id INTEGER,
        category_id INTEGER,
        item TEXT NOT NULL,
        remark TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (subject_id) REFERENCES subjects(id),
        FOREIGN KEY (category_id) REFERENCES categories(id)
      );
    `);
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error.message);
    throw error;
  }
}

export async function getSubjects() {
  if (!db) throw new Error('Database not initialized');
  return db.all('SELECT id, name FROM subjects');
}

export async function getCategories() {
  if (!db) throw new Error('Database not initialized');
  return db.all('SELECT id, name FROM categories');
}

export async function getTricks() {
  if (!db) throw new Error('Database not initialized');
  return db.all(`
    SELECT e.id, s.name as subject, c.name as category, e.item, e.remark, e.created_at
    FROM entries e
    JOIN subjects s ON e.subject_id = s.id
    JOIN categories c ON e.category_id = c.id
  `);
}

export async function addEntry(entry) {
  console.log('[DEBUG] addEntry called with:', JSON.stringify(entry));
  
  if (!db) {
    console.error('[ERROR] Database not initialized in addEntry');
    throw new Error('Database not initialized');
  }

  try {
    console.log('[DEBUG] Validating entry with Zod');
    trickSchema.parse(entry);
    const { subject, category, item, remark } = entry;
    console.log(`[DEBUG] Validation passed: ${subject}/${category}`);
    
    console.log(`[DEBUG] Querying subject: ${subject}`);
    let subjectRow = await db.get('SELECT id FROM subjects WHERE name = ?', subject);
    
    if (!subjectRow) {
      console.log(`[DEBUG] Inserting new subject: ${subject}`);
      const result = await db.run('INSERT INTO subjects (name) VALUES (?)', subject);
      subjectRow = { id: result.lastID };
    }
    const subjectId = subjectRow.id;
    console.log(`[DEBUG] Using subject ID: ${subjectId}`);

    // ... REST OF YOUR ORIGINAL FUNCTION CODE UNCHANGED ...
    // Keep your existing category and entry insertion logic below
    // (Don't change anything after this point)

  } catch (error) {
    console.error('[ERROR] In addEntry:', error.message);
    if (error.issues) console.error('Zod issues:', error.issues);
    throw error;
  }
}
export async function updateEntry(id, entry) {
  if (!db) throw new Error('Database not initialized');
  trickSchema.parse(entry);
  const { subject, category, item, remark } = entry;

  let subjectRow = await db.get('SELECT id FROM subjects WHERE name = ?', subject);
  if (!subjectRow) {
    const result = await db.run('INSERT INTO subjects (name) VALUES (?)', subject);
    subjectRow = { id: result.lastID };
  }
  const subjectId = subjectRow.id;

  let categoryRow = await db.get('SELECT id FROM categories WHERE name = ?', category);
  if (!categoryRow) {
    const result = await db.run('INSERT INTO categories (name) VALUES (?)', category);
    categoryRow = { id: result.lastID };
  }
  const categoryId = categoryRow.id;

  const result = await db.run(
    'UPDATE entries SET subject_id = ?, category_id = ?, item = ?, remark = ? WHERE id = ?',
    subjectId,
    categoryId,
    item,
    remark,
    id
  );

  return result.changes > 0;
}

export async function deleteEntry(id) {
  if (!db) throw new Error('Database not initialized');
  const result = await db.run('DELETE FROM entries WHERE id = ?', id);
  return result.changes > 0;
}