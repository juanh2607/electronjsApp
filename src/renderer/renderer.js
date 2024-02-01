/*document.getElementById('phraseForm').addEventListener('submit', (event) => {
  event.preventDefault(); // To prevent the form from refreshing the page
  const phraseInput = document.getElementById('phraseInput');
  window.myAPI.sendPhrase('phraseInput', phraseInput.value);
  phraseInput.value = '';
});*/

let timers = new Array();

// Initial Data Loading
window.myAPI.receiveComponentData('timerData', (data) => {
  const timerData = JSON.parse(data);
  timerData.forEach((item) => {
    const timer = new Timer(  
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
    const timer = new Timer('New Timer', newDurationInput.value, newDurationInput.value, 0, 0);
    timers.push(timer);
    myDialog.close();
  }
});

// Before Unload
window.addEventListener('beforeunload', (event) => {
  const timerData = timers.map(Timer.toJSON);
  window.myAPI.sendComponentData('timerData', timerData);
});
