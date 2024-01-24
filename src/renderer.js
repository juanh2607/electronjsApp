document.getElementById('phraseForm').addEventListener('submit', (event) => {
  event.preventDefault(); // To prevent the form from refreshing the page
  const phraseInput = document.getElementById('phraseInput');
  window.myAPI.sendPhrase('phraseInput', phraseInput.value);
  phraseInput.value = '';
});