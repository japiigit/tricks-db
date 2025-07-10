const { contextBridge, ipcRenderer } = require('electron');
console.log('Preload script loaded successfully!');

contextBridge.exposeInMainWorld('electronAPI', {
  getSubjects: () => ipcRenderer.invoke('get-subjects')
});