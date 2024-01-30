/*document.getElementById('phraseForm').addEventListener('submit', (event) => {
  event.preventDefault(); // To prevent the form from refreshing the page
  const phraseInput = document.getElementById('phraseInput');
  window.myAPI.sendPhrase('phraseInput', phraseInput.value);
  phraseInput.value = '';
});*/

/*const timer = new Timer(5,
  document.getElementById('timer'),
  document.getElementById('timer-progress'),
  document.getElementById('timerPause'),
  document.getElementById('timerReset')
);*/

const timer = Timer.create(10);