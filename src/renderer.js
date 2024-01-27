document.getElementById('phraseForm').addEventListener('submit', (event) => {
  event.preventDefault(); // To prevent the form from refreshing the page
  const phraseInput = document.getElementById('phraseInput');
  window.myAPI.sendPhrase('phraseInput', phraseInput.value);
  phraseInput.value = '';
});

// Cronometer
let seconds = 0, minutes = 1, hours = 0;
let paused = false;
// Get elements
const timer = document.getElementById('timer');
const progress = document.getElementById('timer-progress');
const pauseButton = document.getElementById('timerPause');
const resetButton = document.getElementById('timerReset');
// Set event listeners
pauseButton.addEventListener('click', () => {
  paused = !paused;
  pauseButton.textContent = paused ? 'Unpause' : 'Pause';
});

resetButton.addEventListener('click', () => {
  seconds = 0, minutes = 1, hours = 0;
  updateTimer();
});

// TODO: ver como hacer para que el set interval directamente no se llame si el
// temporizador no está activo (es un busy wait)
setInterval(() => {
  if (!paused) {
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
  }
}, 1000);

function updateTimer() {
  timer.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Update progress bar
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  const percentage = totalSeconds / 60;
  progress.style.width = `${percentage * 100}%`;
  const colorValue = Math.round(255 * (1 - percentage));
  progress.style.backgroundColor = `rgb(${colorValue}, ${Math.round(255 * percentage)}, ${Math.round(255 * percentage)})`;
}