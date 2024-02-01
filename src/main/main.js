const { app, BrowserWindow, Notification, ipcMain } = require('electron/main');
const path = require('node:path'); // Utilities for working with file and directory paths
const enableAutoLaunch = require('../autolaunch.js');
const fs = require('fs');
const phrasesFilePath = path.join(__dirname, '../../temp/phrases.txt');
const timerDataPath   = path.join(__dirname, '../../temp/timerData.json');
const tempPath = path.join(__dirname, '../../temp');
const { setIpcHandlers } = require('./ipcHandlers.js');
const { setTempFiles } = require('./fileOperations.js');

let window = null;

function createWindow() {
  window = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, '../preload.js'),
      contextIsolation: true // Protect against prototype pollution
    }
  });

  window.loadFile('src/pages/index.html');
  window.maximize();
}

app.whenReady().then(() => {
  enableAutoLaunch();
  setTempFiles();
  createWindow();
  showNotification('Welcome back...');
  setIpcHandlers();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  window.webContents.on('did-finish-load', () => {
    fs.readFile(timerDataPath, (err, data) => {
      if (err) throw err;

      window.webContents.send('timerData', data.toString());
    });
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// TODO: va a haber que empezar a factorizar mejor esto

// TODO: crear script para manejo de archivos
// TODO: separar en carpetas de "front" y "back"

/**
 * Show a notification with title and a random message
 * @param {string} title 
 */
function showNotification (title) {
  fs.readFile(phrasesFilePath, 'utf8', (err, data) => {
    if (err) throw err;
    const phrases = data.split('\n');
    const randomIndex = Math.floor(Math.random() * phrases.length);
    const body = phrases[randomIndex];
    new Notification({ title: title, body: body }).show();
  });
}

// TODO: agregar un botón que te permita habilitar notificaciones random por
// un periodo de tiempo o hasta desabilitarlo