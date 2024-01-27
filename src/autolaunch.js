const { app } = require('electron');
const AutoLaunch = require('auto-launch');

// TODO: debería ser un setting fácil para el usuario de activar/desactivar
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

module.exports = enableAutoLaunch;