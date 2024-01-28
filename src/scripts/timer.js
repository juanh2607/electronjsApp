// Timer
let seconds = 0, minutes = 1, hours = 0;
let paused = true;
let timerId = null;

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
  seconds = 0, minutes = 1, hours = 0;
  updateTimer();
  if (!paused) {
    startTimer();
  }
});

function startTimer() {
  if (timerId !== null) {
    clearTimeout(timerId); // Eliminate the timeout vinculated to the timer
  }

  timerId = setTimeout(() => {
    seconds--;
    if (seconds < 0) {
      minutes--;
      seconds = 59;
    }
    if (minutes < 0) {
      hours--;
      minutes = 59;
    }
    updateTimer();
    startTimer();
  }, 1000);
}

// TODO: ver como hacer para que el set interval directamente no se llame si el
// temporizador no está activo (es un busy wait)
// TODO: setear el tiempo que quieras y que no pueda pasar de 0 y que mande notificación cuando termina
// TODO: cuando el temporizador está activo setear notificaciones a intervalos aleatorios (entre 15-30 minutos)
// TODO: partir la barra en cuatro (una abajo de la otra)

function updateTimer() {
  timer.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Update progress bar
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;

  const percentage = totalSeconds / 60;
  progress.style.width = `${percentage * 100}%`;

  updateProgressBarColor(percentage);
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
