const { app, BrowserWindow, Notification, ipcMain } = require('electron/main');
const path = require('node:path'); // Utilities for working with file and directory paths
const enableAutoLaunch = require('./autolaunch.js');
const fs = require('fs');
const filePath = path.join(__dirname, '../temp/phrases.txt');
const tempPath = path.join(__dirname, '../temp');

app.whenReady().then(() => {
  enableAutoLaunch();
  setTempFiles();
  createWindow();
  showNotification('Welcome back...');

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// TODO: va a haber que empezar a factorizar mejor esto
ipcMain.on('phraseInput', (event, phrase) => {
  fs.appendFile(filePath, phrase + '\n', (err) => {
    if (err) throw err;
  });
});

function createWindow() {
  const window = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true // Protect against prototype pollution
    }
  });

  window.loadFile('src/pages/index.html');
}

/**
 * Checks if temporary files are created. If not it creates them
 */
function setTempFiles() {
  if (!fs.existsSync(tempPath)) {
    fs.mkdirSync(tempPath);
  }
  fs.open(filePath, 'a', (err, fd) => {
    if (err) throw err;
    fs.close(fd, (err) => {
      if (err) throw err;
    });
  });
}

/**
 * Show a notification with title and a random message
 * @param {string} title 
 */
function showNotification (title) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) throw err;
    const phrases = data.split('\n');
    const randomIndex = Math.floor(Math.random() * phrases.length);
    const body = phrases[randomIndex];
    new Notification({ title: title, body: body }).show();
  });
}

// TODO: agregar un botón que te permita habilitar notificaciones random por
// un periodo de tiempo o hasta desabilitarlo
// TODO: guardar las frases de forma persistente, por ahora lo más sencillo
// que puedas.
// TODO: timer para controlar el tiempo que estuviste trabajando (para vos)