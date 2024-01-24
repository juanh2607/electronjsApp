const { app, BrowserWindow, Notification, ipcMain } = require('electron/main');
const path = require('node:path'); // Utilities for working with file and directory paths
const AutoLaunch = require('auto-launch');

const createWindow = () => {
  const window = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true // Protect against prototype pollution
    }
  });

  window.loadFile('pages/index.html');
}

function showNotification (title, body) {
  new Notification({ title: title, body: body }).show()
}

const enableAutoLaunch = () => {
  let autoLauncher = new AutoLaunch({
    name: 'electronjsapp',
    path: app.getPath('exe')
  });

  autoLauncher.isEnabled().then((isEnabled) => {
    if (isEnabled) {
      return;
    }
    autoLauncher.enable();
  })
  .catch((err) => {
    console.error(err);
  })
}

app.whenReady().then(() => {
  enableAutoLaunch();
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
  showNotification(phrase);
});

// TODO: agregar un botón que te permita habilitar notificaciones random por
// un periodo de tiempo o hasta desabilitarlo
// TODO: guardar las frases de forma persistente, por ahora lo más sencillo
// que puedas.
// TODO: timer para controlar el tiempo que estuviste trabajando (para vos)