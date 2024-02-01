const { Notification } = require('electron/main');
const { loadPhrases } = require('./fileOperations');

module.exports = { showNotification };

/**
 * Show a notification with title and a random message
 * @param {string} title 
 */
function showNotification (title) {
  const data = loadPhrases();
  const phrases = data.split('\n');
  const randomIndex = Math.floor(Math.random() * phrases.length);
  const body = phrases[randomIndex];
  new Notification({ title: title, body: body }).show();
}