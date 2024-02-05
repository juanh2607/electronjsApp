/**
 * Object responsible for the creation and maintainance of the timer UI
 */
class TimerComponent {
  constructor(title, startingTime, remainingTime, paused, leftOffset, topOffset) {
    this.timer = new tempTimer(startingTime, remainingTime);
    this.timeoutId = null;
    // TODO: si está dentro o no de un draggable container debería ser customizable
    this.draggableContainer = null; 
    // Initialize UI components that need to be remembered
    this.timerContainer = document.createElement('div');
    this.titleElement   = document.createElement('h3');
    this.timerElement   = document.createElement('div');
    this.progressBar    = document.createElement('div');
    this.pauseButton    = document.createElement('button');
    this.resetButton    = document.createElement('button');

    this.#initializeComponents(title, remainingTime);
    this.#setEventListeners();
    this.#buildComponent(leftOffset, topOffset);
  
    this.#updateTimerText(remainingTime);
    this.#updateProgressBar(remainingTime);

    if (!paused) {
      this.#start();
    }
  }

  /**
   * Initialize the atributes of the components
   */
  #initializeComponents(title, remainingTime) {
    // Add classnames
    this.timerContainer.className = 'timer-container';
    this.timerElement.className  = 'timer';
    this.progressBar.className    = 'timer-progress';
    this.pauseButton.className   = 'timer-button';
    this.resetButton.className   = 'timer-button';
    // Set atributes
    this.titleElement.textContent = title;
    this.titleElement.contentEditable = true;

    this.timerElement.textContent = '--:--:--';
    this.pauseButton.textContent = 'Unpause';
    if (remainingTime === 0) {
      this.pauseButton.disabled = true;
    }
    this.resetButton.textContent = 'Restart';
  }

  /**
   * Set the event listeners of the components
   */
  #setEventListeners() {
    this.pauseButton.addEventListener('click', () => {
      if (this.timer.paused) { // Unpause
        this.pauseButton.textContent = 'Pause';
        this.#start();
      } else { // Pause
        this.timer.pause();
        clearTimeout(this.timeoutId);
        this.pauseButton.textContent = 'Unpause';
      }
    });

    this.resetButton.addEventListener('click', () => { this.#reset() });
  }

  // TODO: debería recibir al componente padre para hacer el append no solo en el body
  /**
   * Builds the HTML and appends it to the body
   */
  #buildComponent(leftOffset, topOffset) {
    this.timerContainer.append(this.titleElement);
    this.timerContainer.appendChild(this.timerElement);
    this.timerContainer.appendChild(this.progressBar);
    this.timerContainer.appendChild(this.pauseButton);
    this.timerContainer.appendChild(this.resetButton);
    
    this.draggableContainer = new DraggableContainer(this.timerContainer);
    document.body.appendChild(this.draggableContainer.container);
    this.draggableContainer.setCoordinates(leftOffset, topOffset);
  }

  #start() {
    if (this.timeoutId !== null) { // TODO: no debería ser necesario este checkeo creo
      clearTimeout(this.timeoutId);
    }

    this.timer.start();

    this.#update();
  }

  /**
   * Keeps updating the timer until the tiemout is cleared
   */
  #update() {
    const remainingTime = this.timer.getRemainingTime();
    this.#updateTimerText(remainingTime);
    this.#updateProgressBar(remainingTime);

    if (remainingTime > 0) {
      this.timeoutId = setTimeout(() => this.#update(), 1000);
    } else {
      this.#handleTimerEnd();
    }
  }

  #reset() {
    this.timer.reset();
    if (this.pauseButton.disabled) {
      this.pauseButton.disabled = false;
    }

    if (this.timer.paused) {
      this.#updateTimerText(this.timer.startingTime);
      this.#updateProgressBar(this.timer.startingTime);
    } else {
      this.#start();
    }
  }

  #updateTimerText(remainingTime) {
    const seconds = remainingTime % 60;
    const minutes = Math.floor(remainingTime / 60) % 60;
    const hours   = Math.floor(remainingTime / 3600);
    
    const ss = seconds.toString().padStart(2, '0');
    const mm = minutes.toString().padStart(2, '0');
    const hh = hours.toString().padStart(2, '0');

    this.timerElement.textContent = `${hh}:${mm}:${ss}`;
  }

  #updateProgressBar(remainingTime) {
    const percentage = 1 - (1 - (remainingTime / this.timer.startingTime));
    this.progressBar.style.width = `${percentage * 100}%`;

    let r, g, b;
    if (percentage === 1) {
      this.progressBar.style.backgroundColor = '#0C2D57';
      return;
    } else if (percentage < 0.7) { // Transition from navy to peach in the first half
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
    this.progressBar.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
  }

  #handleTimerEnd() {
    clearTimeout(this.timeoutId); // Isn't necessary I don't think bro
    this.timer.pause();
    this.pauseButton.disabled = true;
    this.pauseButton.textContent = 'Unpause';
  }

  /**
   * @typedef {Object} TimerJSON
   * @property {string} title
   * @property {number} startingTime
   * @property {number} remainingTime 
   * @property {number} leftOffset - Distance from left of parent container
   * @property {number} topOffset - Distance from top of parent container
   */

  /**
   * Retorna un objeto JSON con los datos necesarios para persistir el timer luego de 
   * cerrada la aplicación
   * @param {TimerComponent} timerComponent 
   * @returns {TimerJSON}
   */
  static toJSON(timerComponent) {
    const { left, top } = timerComponent.draggableContainer.getCoordinates();
    const timer = timerComponent.timer;
    return {
      title: timerComponent.titleElement.textContent,
      startingTime: timer.startingTime,
      remainingTime: timer.getRemainingTime(),
      paused: timer.paused,
      leftOffset: left,
      topOffset: top
    }
  }

}