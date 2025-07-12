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
  console.log('[getTricks] Fetching tricks from database');
  
  if (!db) {
    console.error('[getTricks] Database not initialized!');
    throw new Error('Database not initialized');
  }
  
  try {
    const tricks = await db.all(`
      SELECT e.id, s.name as subject, c.name as category, e.item, e.remark, e.created_at
      FROM entries e
      JOIN subjects s ON e.subject_id = s.id
      JOIN categories c ON e.category_id = c.id
    `);
    
    console.log(`[getTricks] Found ${tricks.length} tricks`);
    if (tricks.length > 0) {
      console.log('[getTricks] First trick:', JSON.stringify(tricks[0]));
    }
    
    return tricks;
  } catch (error) {
    console.error('[getTricks] Error:', error.message);
    return [];
  }
}

export async function addEntry(entry) {
  console.log('[addEntry] Starting with entry:', JSON.stringify(entry));
  
  if (!db) {
    console.error('[addEntry] Database not initialized!');
    throw new Error('Database not initialized');
  }
  
  try {
    console.log('[addEntry] Validating entry with Zod');
    trickSchema.parse(entry);
    const { subject, category, item, remark = '' } = entry;
    console.log('[addEntry] Validation passed');

    console.log(`[addEntry] Looking up subject: ${subject}`);
    let subjectRow = await db.get('SELECT id FROM subjects WHERE name = ?', subject);
    if (!subjectRow) {
      console.log(`[addEntry] Subject "${subject}" not found, inserting...`);
      const result = await db.run('INSERT INTO subjects (name) VALUES (?)', subject);
      subjectRow = { id: result.lastID };
      console.log(`[addEntry] Inserted subject with id: ${subjectRow.id}`);
    } else {
      console.log(`[addEntry] Found subject with id: ${subjectRow.id}`);
    }
    const subjectId = subjectRow.id;

    console.log(`[addEntry] Looking up category: ${category}`);
    let categoryRow = await db.get('SELECT id FROM categories WHERE name = ?', category);
    if (!categoryRow) {
      console.log(`[addEntry] Category "${category}" not found, inserting...`);
      const result = await db.run('INSERT INTO categories (name) VALUES (?)', category);
      categoryRow = { id: result.lastID };
      console.log(`[addEntry] Inserted category with id: ${categoryRow.id}`);
    } else {
      console.log(`[addEntry] Found category with id: ${categoryRow.id}`);
    }
    const categoryId = categoryRow.id;

    console.log(`[addEntry] Inserting entry with: subjectId=${subjectId}, categoryId=${categoryId}, item=${item}, remark=${remark}`);
    const result = await db.run(
      'INSERT INTO entries (subject_id, category_id, item, remark) VALUES (?, ?, ?, ?)',
      subjectId,
      categoryId,
      item,
      remark
    );
    console.log(`[addEntry] Insert result:`, result);
    console.log(`[addEntry] New entry ID: ${result.lastID}`);

    // Verify insertion by immediately querying
    const newEntry = await db.get('SELECT * FROM entries WHERE id = ?', result.lastID);
    console.log(`[addEntry] Verification query:`, newEntry ? 'Success' : 'Failed');

    return {
      id: result.lastID,
      subject,
      category,
      item,
      remark,
    };
    
  } catch (error) {
    console.error('[addEntry] Error:', error.message);
    console.error(error.stack);
    throw error;
  }
}

// KEEP YOUR EXISTING updateEntry FUNCTION BELOW
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