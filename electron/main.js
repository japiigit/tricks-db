import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  initializeDB,
  getSubjects,
  getCategories,
  getTricks,
  addEntry,
  updateEntry,
  deleteEntry,
} from './db-service.js';

// Fix __dirname replacement
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3001');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(async () => {
  try {
    await initializeDB();
    createWindow();
  } catch (error) {
    console.error('Failed to initialize app:', error);
    app.quit();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// IPC Handlers
ipcMain.handle('get-subjects', async () => {
  try {
    return await getSubjects();
  } catch (error) {
    console.error('Failed to get subjects:', error);
    return [];
  }
});

ipcMain.handle('get-categories', async () => {
  try {
    return await getCategories();
  } catch (error) {
    console.error('Failed to get categories:', error);
    return [];
  }
});

ipcMain.handle('get-tricks', async () => {
  try {
    return await getTricks();
  } catch (error) {
    console.error('Failed to get tricks:', error);
    return [];
  }
});

// ===== ADDED MISSING HANDLER =====
ipcMain.handle('add-entry', async (event, entry) => {
  try {
    console.log('[main] Received add-entry request');
    const result = await addEntry(entry);
    return result;
  } catch (error) {
    console.error('Error adding entry:', error);
    return { error: error.message };
  }
});
// ===== END OF ADDED HANDLER =====

ipcMain.handle('update-entry', async (event, id, entry) => {
  try {
    return await updateEntry(id, entry);
  } catch (error) {
    console.error('Error updating entry:', error);
    return { error: error.message };
  }
});

ipcMain.handle('delete-entry', async (event, id) => {
  try {
    return await deleteEntry(id);
  } catch (error) {
    console.error('Error deleting entry:', error);
    return { error: error.message };
  }
});

// Optional: Verification of handlers (can remove later)
console.log('Registered IPC handlers:');
console.log(ipcMain.eventNames());