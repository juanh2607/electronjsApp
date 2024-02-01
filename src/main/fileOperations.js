// Archivo para abstraerse de los paths y la lógica del filesystem.
const fs = require('fs');
const path = require('node:path');

// Used Paths
const tempPath = path.join(__dirname, '../../temp');
const timerDataPath   = path.join(tempPath, 'timerData.json');
const phrasesFilePath = path.join(tempPath, 'phrases.txt');

module.exports = { storeTimerData, storePhrase, setTempFiles };

/**
 * Stores the data from timers in JSON format.
 * Warning: it completely re-writes de timer data stored
 * @param {*} timerData 
 */
function storeTimerData(timerData) {
  // TODO: esto es muy ineficiente. No jode por ahora pero no va a escalar nada 
  // bien (lo arreglas cuando agregues una base de datos)
  const data = JSON.stringify(timerData, null, 2);
  fs.writeFile(timerDataPath, data, (err) => handleError(err));
}

/**
 * Stores the phrase by appending it to phrase.txt
 * @param {string} phrase 
 */
function storePhrase(phrase) {
  fs.appendFile(phrasesFilePath, phrase + '\n', (err) => handleError(err));
}

// TODO: considerar manejo de errores. No es prioritario ahora
function handleError(err) {
  if (err) throw err;
}

/**
 * Checks if temporary files are created. If not it creates them
 */
function setTempFiles() {
  if (!fs.existsSync(tempPath)) {
    fs.mkdirSync(tempPath);  
  }
  createFileIfNotExists(phrasesFilePath);
  createFileIfNotExists(timerDataPath);
}

/**
 * Creates a file at 'pathname' if it does not exist
 * @param {string} pathname 
 */
function createFileIfNotExists(pathname) {
  if (!fs.existsSync(pathname)) {
    fs.open(pathname, 'a', (err, fd) => {
      if (err) throw err;

      fs.close(fd, (err) => {
        if (err) throw err;
      });
    });
  }
}
