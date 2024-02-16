// Global Variables
let now = new Date(); // Used to know when to reload data.
let nextDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
let msUntilNextRefresh = nextDay.getTime() - now.getTime();
// Objects
let timers = new Array();
new sleepTimeComponent();

setTimeout(refreshApp, 20000);

/**
 * Sends the necessary data to main and reloads time-based resources like 
 * timers, sleep time update, etc
 * Sets a new timeout for the next refresh
 */
function refreshApp() {
  window.myAPI.sendComponentData('timerData', timers.map(TimerComponent.toJSON));
  timers.forEach((t) => t.resetTimer());

  now = new Date();
  nextDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  // Still necessary because of computer sleep mode. refreshApp may be called any hour
  msUntilNextRefresh = nextDay.getTime() - now.getTime();
  setTimeout(refreshApp, msUntilNextRefresh); 
  // TODO: volver a activar el coso de cargar horario sueño
}

/*document.getElementById('phraseForm').addEventListener('submit', (event) => {
  event.preventDefault(); // To prevent the form from refreshing the page
  const phraseInput = document.getElementById('phraseInput');
  window.myAPI.sendPhrase('phraseInput', phraseInput.value);
  phraseInput.value = '';
});*/

// TODO: factorizar mejor (como en main). Agregar un .js para los handlers
// Deja este archivo para recibir los datos, instanciar los objetos y para
// guardar todo cuando cerras la ventana.
// TODO: mostrar gráfico con el tiempo guardado de los timers.

// Initial Data Loading
window.myAPI.receiveComponentData('timerData', (data) => {
  const timerData = JSON.parse(data);

  timerData.forEach((item) => {
    const timer = new TimerComponent(  
      item.title,
      item.startingTime,
      item.remainingTime,
      item.paused,
      item.leftOffset,
      item.topOffset
    );
    timers.push(timer);
  });
});

// Modal
const myDialog = document.getElementById('myDialog');
const openButton = document.getElementById('add');
const closeButton = document.getElementById('closeButton');

openButton.addEventListener('click', () => {
  myDialog.showModal();
});

closeButton.addEventListener('click', () => {
  myDialog.close();
});

// New Timer Form
const newTimerForm = document.getElementById('newTimerForm');
const newDurationInput = document.getElementById('newDurationInput');

newTimerForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (newDurationInput.value) {
    const timer = new TimerComponent('New Timer', newDurationInput.value, newDurationInput.value, 0, 0);
    timers.push(timer);
    myDialog.close();
  }
});

// Before Unload
// TODO: el remainingTime no se está guardando bien si el temporizador no se pausa antes de llamar a toJSON
window.addEventListener('beforeunload', () => {
  const timerData = timers.map(TimerComponent.toJSON);
  window.myAPI.sendComponentData('timerData', timerData);
});

