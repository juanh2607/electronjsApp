// TODO: agregar marco y título al temporizador
// TODO: convertir en una clase para tener varios temporizadores

// Timer
const STARTING_TIME = 3; // Amount of seconds the timer starts with
let pausedValue = STARTING_TIME; // Amount of seconds the timer had left when paused
let remainingTime = STARTING_TIME;
let unpauseTime = null;
let seconds = STARTING_TIME % 60;
let minutes = Math.floor(STARTING_TIME / 60) % 60;
let hours = Math.floor(STARTING_TIME / 3600);
let paused = true;
let timerId = null; // Id of the timeout

// Get elements
const timer = document.getElementById('timer');
const progress = document.getElementById('timer-progress');
const pauseButton = document.getElementById('timerPause');
const resetButton = document.getElementById('timerReset');
// Initialize elements
timer.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
pauseButton.textContent = paused ? 'Unpause' : 'Pause';

// Set event listeners
pauseButton.addEventListener('click', () => {
  paused = !paused;
  pauseButton.textContent = paused ? 'Unpause' : 'Pause';
  paused ? clearTimeout(timerId) : startTimer();
});

resetButton.addEventListener('click', () => {
  remainingTime = STARTING_TIME;
  pausedValue = STARTING_TIME;
  seconds = STARTING_TIME % 60;
  minutes = Math.floor(STARTING_TIME / 60) % 60;
  hours = Math.floor(STARTING_TIME / 3600);

  if (pauseButton.disabled) pauseButton.disabled = false;

  if (paused) {
    progress.style.backgroundColor = '#0C2D57';
    timer.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    progress.style.width = `100%`;
  } else {
    startTimer();
  }
});

function startTimer() {
  unpauseTime = new Date();
  pausedValue = remainingTime;

  if (timerId !== null) {
    clearTimeout(timerId); // Eliminate the old vinculated to the timer
  }

  updateTimer();
}

// TODO: setear el tiempo que quieras y que no pueda pasar de 0 y que mande notificación cuando termina
// TODO: cuando el temporizador está activo setear notificaciones a intervalos aleatorios (entre 15-30 minutos)
// TODO: partir la barra en cuatro (una abajo de la otra)

function updateTimer() {
  // Calculate elapsed time
  const now = new Date();
  const elapsedTime = now - unpauseTime;

  // Update remaining time
  remainingTime = pausedValue - Math.floor(elapsedTime / 1000);

  seconds = remainingTime % 60;
  minutes = Math.floor(remainingTime / 60) % 60;
  hours = Math.floor(remainingTime / 3600);

  timer.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Update progress bar
  const percentage = 1 - (1 - (remainingTime / STARTING_TIME));
  progress.style.width = `${percentage * 100}%`;

  updateProgressBarColor(percentage);

  if (remainingTime > 0) { // Schedule the next update
    timerId = setTimeout(updateTimer, 1000);
  } else {
    console.log('Alarm!');
    pauseButton.disabled = true;
    // TODO: bloquear el botón de pausado o directamente sacarlo. Arregla un bug cuando termina, apretas el pause y deja de funcionar el reset
    // TODO: mostrar notificación cuando se termina
  }
}

function updateProgressBarColor(percentage) {
  let r, g, b;
  if (percentage < 0.7) { // Transition from navy to peach in the first half
    const p = percentage * 2;
    r = Math.round(12 * (1 - p) + 255 * p);
    g = Math.round(45 * (1 - p) + 176 * p);
    b = Math.round(87 * (1 - p) + 176 * p);
  } else { // Transition from peach to orange in the second half
    const p = (percentage - 0.7) * 0.3;
    r = Math.round(255 * (1 - p) + 252 * p);
    g = Math.round(176 * (1 - p) + 103 * p);
    b = Math.round(176 * (1 - p) + 54 * p);
  }
  progress.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
}

// TODO: voy a querer que varios elementos sean draggable, poner
const container = document.getElementById('timer-container');
let newX = 0, newY = 0, oldX = 0, oldY = 0;

// TODO: revisar bien la liberación de listeners en document.
// TODO: cuando el mouse se va de la ventana se porta raro.
// TODO: agregar un botón desde donde draggear (onda notion)
container.addEventListener('pointerdown', (event) => {
  event.preventDefault();
  // Store old position
  oldX = event.clientX;
  oldY = event.clientY;
  
  document.addEventListener('pointermove', dragItem);
});

container.addEventListener('pointerup', (event) => {
  document.removeEventListener('pointermove', dragItem);
});

function dragItem(event) {
  event.preventDefault();
  newX = oldX - event.clientX;
  newY = oldY - event.clientY;
  oldX = event.clientX;
  oldY = event.clientY;
  container.style.left = (container.offsetLeft - newX) + "px";
  container.style.top  = (container.offsetTop - newY) + "px";
}



