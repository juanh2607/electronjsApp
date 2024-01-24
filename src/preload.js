const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
  'myAPI', {
    sendPhrase: (channel, data) => {
      const validChannels = ['phraseInput'];
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    }
  }
)