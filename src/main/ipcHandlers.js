const { ipcMain } = require('electron/main');
const { storeTimerData, storePhrase } = require('./fileOperations');

function setIpcHandlers() {
  ipcMain.on('timerData', (event, timerData) => storeTimerData(timerData));
  ipcMain.on('phraseInput', (event, phrase) => storePhrase(phrase));
}

module.exports = { setIpcHandlers };