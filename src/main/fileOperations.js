// Archivo para abstraerse de los paths y la lógica del filesystem.
const fs = require('fs');
const path = require('node:path');

// TODO: (largo plazo): sustituir por una base de datos. Ver si se justifica usar MongoDB o es overkill.
// TODO: cuando puedas visualizar los datos en la aplicación, ver de guardar
// las cosas en binario y comunicarlas entre renderer y main en binario.
// Creo que igual con el json.stringify ya lo estás mandando en binario?

// TODO: ver de convertir el .json en un component.json genérico
// TODO: crear un csv para los datos de sleeping time

// TODO: buscar como guardar en BSON (binario y más estricto con los tipos de datos)

// BUG: no funciona correctamente en el siguiente escenario: al terminar el día
// no apagaste la computadora del todo y al día siguiente retomás de donde dejaste.
// Cuando cierres la aplicación va a poner el update date como ese día por lo que
// ni se va a guardar ni reiniciar el temporizador (como si el día tuviese +24 horas)

// Used Paths
const tempPath         = path.join(__dirname, '../../temp');
const timerDataPath    = path.join(tempPath, 'timerData.json');
const timerHistoryPath = path.join(tempPath, 'timerHist.csv')
const phrasesFilePath  = path.join(tempPath, 'phrases.txt');

module.exports = {
  storeTimerData, loadTimerData, //Timer 
  storePhrase, loadPhrases,      // Phrase
  setTempFiles                   // Files 
};

// TODO: ver si conviene hacerlo asyncrónico

/**
 * Stores the data from timers in JSON format.
 * Warning: it completely re-writes de timer data stored
 * @param {JSON} timerData 
 */
function storeTimerData(timerData) {
  const formatedData = {
    timerData: timerData,
    lastReset: new Date()
  }

  // Check if history should be saved
  const fileData = fs.readFileSync(timerDataPath, (err) => handleError(err));
  const fileDataJSON = JSON.parse(fileData.toString());

  if(!updatedToday(fileDataJSON.lastReset)) {
    writeTimerHistory(fileDataJSON.timerData, fileDataJSON.lastReset);
  }

  const data = JSON.stringify(formatedData, null, 2);
  
  fs.writeFile(timerDataPath, data, (err) => handleError(err));
}

/**
 * Reads the timer data and returns a JSON string. If the data wasn´t updated today,
 * it uploads the timerData to timerHist.csv and then resets the timers.
 * @returns {string} - String containing the json data.
 */
function loadTimerData() {
  const data = fs.readFileSync(timerDataPath, (err) => handleError(err));
  const dataJSON = JSON.parse(data.toString());

  if (!updatedToday(dataJSON.lastReset)) {
    writeTimerHistory(dataJSON.timerData, dataJSON.lastReset);
    // Reset timers
    dataJSON.timerData.forEach((item) => {
      item.remainingTime = item.startingTime;
    });
    dataJSON.lastReset = new Date();
  }
  // TODO: no estas revisando que exista la data, te va a dar error si es la primera vez
  return JSON.stringify(dataJSON.timerData, null, 2);
}

/**
 * Returns true if lastUpdateDate happened today, false if not 
 * @param {string} lastUpdated
 */
function updatedToday(lastUpdated) {
  const currentDate = new Date();
  const lastUpdatedDate = new Date(lastUpdated);

  return (
    currentDate.getDate() === lastUpdatedDate.getDate() &&
    currentDate.getMonth() === lastUpdatedDate.getMonth() &&
    currentDate.getFullYear() === lastUpdatedDate.getFullYear()
  )
}

/**
 * Writes the timer data to a history file async
 * @param {Array} timerData 
 * @param {string} date 
 */
function writeTimerHistory(timerData, date) {
  // TODO: si pasa más de un día en que se uso la aplicación, repite el último día guardado
  // ver timerHist para entenderlo bien.
  // TODO: no guardar historial de campos con remaining time = 0, son irrelevantes
  const historyData = timerData.map(({ title, startingTime, remainingTime }) => ({
    date: new Date(date).toISOString().split('T')[0], // YYYY-MM-DD format
    title: title,
    timeElapsed: startingTime - remainingTime
  }));

  const csvData = historyData.map(({ date, title, timeElapsed }) => `${date};${title};${timeElapsed}`).join('\n');

  fs.appendFile(timerHistoryPath, csvData + '\n', (err) => handleError(err));
}

/**
 * Stores the phrase by appending it to phrase.txt
 * @param {string} phrase 
 */
function storePhrase(phrase) {
  fs.appendFile(phrasesFilePath, phrase + '\n', (err) => handleError(err));
}

/**
 * Reads the phrases data and returns a string with all phrases
 * @returns {string}
 */
function loadPhrases() {
  const data = fs.readFileSync(phrasesFilePath, 'utf8', (err) => handleError(err));
  return data;
}

// TODO: considerar un mejor manejo de errores. No es prioritario ahora
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
  createFileIfNotExists(timerHistoryPath);
}

/**
 * Creates a file at 'pathname' if it does not exist
 * @param {string} pathname 
 */
function createFileIfNotExists(pathname) {
  if (!fs.existsSync(pathname)) {
    fs.open(pathname, 'a', (err, fd) => {
      handleError(err);

      fs.close(fd, (err) => handleError(err));
    });
  }
}
