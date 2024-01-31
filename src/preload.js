const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
  'myAPI', {
    sendPhrase: (channel, data) => {
      const validChannels = ['phraseInput'];
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
    sendComponentData: (channel, data) => {
      const validChannels = ['timerData'];
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
    receiveComponentData: (channel, func) => {
      const validChannels = ['timerData'];
      if (validChannels.includes(channel)) {
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    }
  }
)