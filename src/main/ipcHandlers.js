const { ipcMain } = require('electron/main');
const { storeTimerData, storePhrase, storeComponentsData } = require('./fileOperations');

// TODO: separa las responsabilidades (lo vinculado al filesystem separalo de cosas
// como resetear tiempos)

// TODO: eliminar el uso de timerData

function setIpcHandlers() {
  ipcMain.on('componentsData', (event, data) => storeComponentsData(data));
  ipcMain.on('timerData', (event, timerData) => storeTimerData(timerData));
  ipcMain.on('phraseInput', (event, phrase) => storePhrase(phrase));
}

module.exports = { setIpcHandlers };