// TODO: separa la lógica del componente de la lógica del timer en si
class Timer {
  constructor(title, startingTime, remainingTime, leftOffset, topOffset) {
    this.title = title;
    // For measuring time
    this.startingTime    = startingTime;
    this.lastPausedValue = startingTime;
    this.remainingTime   = remainingTime;
    this.unpauseTime = null; // Where the date of the last unpause is stored
    // Time
    this.seconds = startingTime % 60;
    this.minutes = Math.floor(startingTime / 60) % 60;
    this.hours   = Math.floor(startingTime / 3600);

    this.paused = true;
    this.timeoutId = null;
    this.draggableContainer = null;
    
    this.#buildTimer();
    this.draggableContainer.setCoordinates(leftOffset, topOffset);
    
    // Set event listeners
    this.pauseButton.addEventListener('click', () => this.togglePause());
    this.resetButton.addEventListener('click', () => this.reset());
  }

  /**
   * Create the HTML component
   */
  #buildTimer() {
    // Create DOM elements
    const timerContainer  = document.createElement('div');
    const timerTitle      = document.createElement('h3');
    const timerElement    = document.createElement('div');
    const progressElement = document.createElement('div');
    const pauseElement    = document.createElement('button');
    const resetElement    = document.createElement('button');
    // Add classnames
    timerContainer.className = 'timer-container';
    timerElement.className = 'timer';
    progressElement.className = 'timer-progress';
    pauseElement.className = 'timer-button';
    resetElement.className = 'timer-button';
    // Initialize values
    timerTitle.textContent = this.title;
    timerTitle.contentEditable = true;
    timerElement.textContent = '--:--:--';
    pauseElement.textContent = 'Unpause';
    resetElement.textContent = 'Restart';
    // 'Build' timer
    timerContainer.append(timerTitle);
    timerContainer.appendChild(timerElement);
    timerContainer.appendChild(progressElement);
    timerContainer.appendChild(pauseElement);
    timerContainer.appendChild(resetElement);

    // Wrap in a DraggableContainer
    this.draggableContainer = new DraggableContainer(timerContainer);

    document.body.appendChild(this.draggableContainer.container);

    this.timer = timerElement;
    this.progress = progressElement;
    this.pauseButton = pauseElement;
    this.pauseButton.textContent = 'Paused';
    this.resetButton = resetElement;

    this.timer.textContent = `${this.hours.toString().padStart(2, '0')}:${this.minutes.toString().padStart(2, '0')}:${this.seconds.toString().padStart(2, '0')}`;
  }

  togglePause() {
    this.paused = !this.paused;
    this.pauseButton.textContent = this.paused ? 'Unpause' : 'Pause';
    this.paused ? clearTimeout(this.timeoutId) : this.start();
  }

  reset() {
    this.remainingTime = this.startingTime;
    this.pausedValue   = this.startingTime;
    this.seconds = this.startingTime % 60;
    this.minutes = Math.floor(this.startingTime / 60) % 60;
    this.hours = Math.floor(this.startingTime / 3600);

    if (this.pauseButton.disabled) this.pauseButton.disabled = false;

    if (this.paused) {
      this.progress.style.backgroundColor = '#0C2D57';
      this.timer.textContent = `${this.hours.toString().padStart(2, '0')}:${this.minutes.toString().padStart(2, '0')}:${this.seconds.toString().padStart(2, '0')}`;
      this.progress.style.width = `100%`;
    } else {
      this.start();
    }
  }

  start() {
    this.unpauseTime = new Date();
    this.pausedValue = this.remainingTime;

    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
    }

    this.update();
  }

  update() {
    const now = new Date();
    const elapsedTime = now - this.unpauseTime;

    this.remainingTime = this.pausedValue - Math.floor(elapsedTime / 1000);

    this.seconds = this.remainingTime % 60;
    this.minutes = Math.floor(this.remainingTime / 60) % 60;
    this.hours = Math.floor(this.remainingTime / 3600);

    this.timer.textContent = `${this.hours.toString().padStart(2, '0')}:${this.minutes.toString().padStart(2, '0')}:${this.seconds.toString().padStart(2, '0')}`;

    const percentage = 1 - (1 - (this.remainingTime / this.startingTime));
    this.progress.style.width = `${percentage * 100}%`;

    this.updateProgressBarColor(percentage);

    if (this.remainingTime > 0) {
      this.timeoutId = setTimeout(() => this.update(), 1000);
    } else {
      this.handleTimerEnd();
    }
  }

  handleTimerEnd() {
    this.paused = true;
    this.pauseButton.disabled = true;
    this.pauseButton.textContent = 'Unpause';
  }

  updateProgressBarColor(percentage) {
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
    this.progress.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
  }

  // STATIC METHODS
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
   * @param {Timer} timer 
   * @returns {TimerJSON}
   */
  static toJSON(timer) {
    const { left, top } = timer.draggableContainer.getCoordinates();
    
    return {
      title: timer.title,
      startingTime: timer.startingTime,
      remainingTime: timer.remainingTime,
      leftOffset: left,
      topOffset: top
    }
  }

}
