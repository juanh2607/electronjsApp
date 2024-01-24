const { app, BrowserWindow, Notification } = require('electron/main');
const AutoLaunch = require('auto-launch');

const createWindow = () => {
  const window = new BrowserWindow({
    width: 1200,
    height: 800
  });

  window.loadFile('pages/index.html');
}

const NOTIFICATION_TITLE = 'Basic Notification';
const NOTIFICATION_BODY = 'Notification from the Main process';

function showNotification () {
  new Notification({ title: NOTIFICATION_TITLE, body: NOTIFICATION_BODY }).show()
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
  showNotification();

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