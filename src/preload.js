const { contextBridge, ipcRenderer } = require('electron');

// TODO: fijate de como armar un buen protocolo escalable
// TODO: en vez de hacer un sendData hacer un requestData (o ambas?)
contextBridge.exposeInMainWorld(
  'myAPI', {
    sendPhrase: (channel, data) => {
      const validChannels = ['phraseInput'];
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
    sendComponentData: (channel, data) => {
      const validChannels = ['timerData', 'componentsData'];
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
    receiveComponentData: (channel, func) => {
      const validChannels = ['timerData', 'componentsData'];
      if (validChannels.includes(channel)) {
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    }
  }
)