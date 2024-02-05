const { app, BrowserWindow } = require('electron/main');
const path = require('node:path'); // Utilities for working with file and directory paths
const enableAutoLaunch = require('./autolaunch.js');
const { setIpcHandlers } = require('./ipcHandlers.js');
const { setTempFiles, loadTimerData } = require('./fileOperations.js');
const { showNotification } = require('./notification.js');

let window = null;

// TODO: ver como hacer para que esté todo en strict mode

function createWindow() {
  window = new BrowserWindow({
    webPreferences: {
      width: 1200,
      height: 800,
      preload: path.join(__dirname, '../preload.js'),
      contextIsolation: true // Protect against prototype pollution
    }
  });

  window.loadFile('src/renderer/pages/index.html');
  //window.maximize();
}

app.whenReady().then(() => {
  enableAutoLaunch();
  setTempFiles();
  setIpcHandlers();
  createWindow();
  showNotification('Welcome back...');
  
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  window.webContents.on('did-finish-load', () => {
    const data = loadTimerData(); // TODO: Separar lógica en un initializer.js cuando esto crezca
    window.webContents.send('timerData', data);
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// TODO: agregar un botón que te permita habilitar notificaciones random por
// un periodo de tiempo o hasta desabilitarlo