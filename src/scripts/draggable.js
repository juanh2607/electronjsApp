class DraggableContainer {
  constructor(child) {
    // Draggaable Container
    this.container = document.createElement('div');
    this.container.className = 'draggableContainer';
    this.container.draggable = true;
    // Drag Button
    this.dragButton = document.createElement('button');
    this.dragButton.className = 'dragButton';
    this.dragButton.textContent = 'Drag';
    this.dragButton.style.display = 'none';
    // Build container
    this.container.appendChild(this.dragButton);
    this.container.appendChild(child);

    this.oldX = 0;
    this.oldY = 0;
    // Bind only once to avoid hard to find bugs
    this.boundDragItem = this.#dragItem.bind(this);
    // Set event listeners
    this.container.addEventListener('mouseover', () => {
      this.dragButton.style.display = 'block';
    });

    this.container.addEventListener('mouseout', () => {
      this.dragButton.style.display = 'none';
    });

    this.dragButton.addEventListener('pointerdown', (event) => {
      event.preventDefault();
      this.oldX = event.clientX - this.container.getBoundingClientRect().left;
      this.oldY = event.clientY - this.container.getBoundingClientRect().top;
      document.addEventListener('pointermove', this.boundDragItem);
    });

    this.dragButton.addEventListener('pointerup', () => {
      document.removeEventListener('pointermove', this.boundDragItem);
    });
  }

  #dragItem(event) {
    event.preventDefault();
    this.container.style.left = (event.clientX - this.oldX) + "px";
    this.container.style.top  = (event.clientY - this.oldY) + "px";
  }

  /**
   * 
   * @param {number} left - Pixels from the left side of the window 
   * @param {number} top  - Pixels from the top side of the window
   */
  setCoordinates(left, top) {
    this.container.style.left = left + "px";
    this.container.style.top  = top  + "px";
  }

  getCoordinates() {
    return {
      left: this.container.offsetLeft,
      top:  this.container.offsetTop
    }
  }
}
