/*document.getElementById('phraseForm').addEventListener('submit', (event) => {
  event.preventDefault(); // To prevent the form from refreshing the page
  const phraseInput = document.getElementById('phraseInput');
  window.myAPI.sendPhrase('phraseInput', phraseInput.value);
  phraseInput.value = '';
});*/

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
    Timer.createTimer(newDurationInput.value);
    myDialog.close();
  }
});
