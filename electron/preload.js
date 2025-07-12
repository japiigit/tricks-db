const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getSubjects: () => ipcRenderer.invoke('get-subjects'),
  getCategories: () => ipcRenderer.invoke('get-categories'),
  getTricks: () => ipcRenderer.invoke('get-tricks'),
  addEntry: (entry) => ipcRenderer.invoke('add-entry', entry),
  updateEntry: (id, entry) => ipcRenderer.invoke('update-entry', id, entry),
  deleteEntry: (id) => ipcRenderer.invoke('delete-entry', id),
});