const draggableContainer = document.getElementById('draggableContainer');
const dragButton = document.getElementById('dragButton');
let oldX = 0, oldY = 0;

draggableContainer.addEventListener('mouseover', (event) => {
  dragButton.style.display = 'block';
});

draggableContainer.addEventListener('mouseout', (event) => {
  dragButton.style.display = 'none';
});

// TODO: revisar bien la liberación de listeners en document.
// TODO: cuando el mouse se va de la ventana se porta raro.
dragButton.addEventListener('pointerdown', (event) => {
  event.preventDefault();
  // Remember position of cursor and container to move it on dragItem
  oldX = event.clientX - draggableContainer.getBoundingClientRect().left;
  oldY = event.clientY - draggableContainer.getBoundingClientRect().top;
  
  document.addEventListener('pointermove', dragItem);
});

dragButton.addEventListener('pointerup', (event) => {
  document.removeEventListener('pointermove', dragItem);
});

function dragItem(event) {
  event.preventDefault();
  draggableContainer.style.left = (event.clientX - oldX) + "px";
  draggableContainer.style.top  = (event.clientY - oldY) + "px";
}