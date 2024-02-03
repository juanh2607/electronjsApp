/*document.getElementById('phraseForm').addEventListener('submit', (event) => {
  event.preventDefault(); // To prevent the form from refreshing the page
  const phraseInput = document.getElementById('phraseInput');
  window.myAPI.sendPhrase('phraseInput', phraseInput.value);
  phraseInput.value = '';
});*/

let timers = new Array();

// TODO: factorizar mejor (como en main). Agregar un .js para los handlers
// Deja este archivo para recibir los datos, instanciar los objetos y para
// guardar todo cuando cerras la ventana.
// TODO: mostrar gráfico con el tiempo guardado de los timers.

// Initial Data Loading
window.myAPI.receiveComponentData('timerData', (data) => {
  const timerData = JSON.parse(data);
  // TODO: el front no debería tener que preocuparse por el reseteo de los timers
  // esto es lógica del backend

  timerData.forEach((item) => {
    const timer = new TimerComponent(  
      item.title,
      item.startingTime,
      item.remainingTime,
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
window.addEventListener('beforeunload', (event) => {
  // TODO: el remainingTime no se está guardando bien si el temporizador no se pausa antes de llamar a toJSON
  const timerData = timers.map(TimerComponent.toJSON);
  window.myAPI.sendComponentData('timerData', timerData);
});

new sleepTimeComponent();