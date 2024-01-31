const { app, BrowserWindow, Notification, ipcMain } = require('electron/main');
const path = require('node:path'); // Utilities for working with file and directory paths
const enableAutoLaunch = require('./autolaunch.js');

const fs = require('fs');
const electronSquirrelStartup = require('electron-squirrel-startup');
const phrasesFilePath = path.join(__dirname, '../temp/phrases.txt');
const timerDataPath   = path.join(__dirname, '../temp/timerData.json');
const tempPath = path.join(__dirname, '../temp');

let window = null;

function createWindow() {
  window = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
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
ipcMain.on('phraseInput', (event, phrase) => {
  fs.appendFile(phrasesFilePath, phrase + '\n', (err) => {
    if (err) throw err;
  });
});

ipcMain.on('timerData', (event, timerData) => {
  // TODO: esto es muy ineficiente, por como funcionan los JSON, parece que no podés
  // o no es fácil hacer un append directamente al archivo. Ahora estás leyendo todo 
  // el punto JSON, parseandolo, haciendo el append y escribiendo todo en el archivo.
  // No jode por ahora pero no va a escalar nada bien (lo arreglas cuando agregues una base de datos)
  fs.readFile(timerDataPath, (err, data) => {
    if (err) throw err;
    // Parse the existing array of timers, or start with an empty array if the file is new
    let timers = data.toString() ? JSON.parse(data.toString()) : [];
    timers.push(timerData);
    
    fs.writeFile(timerDataPath, JSON.stringify(timers, null, 2), (err) => {
      if (err) throw err;
      console.log('Data successfully written to file');
    });
  });
});

// TODO: crear script para manejo de archivos
// TODO: separar en carpetas de "front" y "back"

/**
 * Checks if temporary files are created. If not it creates them
 */
function setTempFiles() {
  // TODO: mejorar esto, funciona pero es cualquier cosa
  if (!fs.existsSync(tempPath)) {
    fs.mkdirSync(tempPath);
  }
  fs.open(phrasesFilePath, 'a', (err, fd) => {
    if (err) throw err;
    fs.close(fd, (err) => {
      if (err) throw err;
    });
  });
  fs.open(timerDataPath, 'a', (err, fd) => {
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