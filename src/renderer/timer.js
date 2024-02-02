/**
 * Object with the logic of a timer, with no UI
 */
class tempTimer {
  constructor(startingTime, remainingTime) {
    this.startingTime = startingTime;
    this.remainingTime = remainingTime;
    this.lastUnpauseDate = null; // If null, it means the timer is paused
    this.paused = true; // Added for easier use when being used on other files
  }

  start() {
    this.lastUnpauseDate = new Date();
    this.paused = false;
  }

  pause() {
    // Update remaining time
    this.remainingTime = this.getRemainingTime();
    this.lastUnpauseDate = null;
    this.paused = true;
  }

  reset() {
    this.remainingTime = this.startingTime;
    this.lastUnpauseDate = null;
    // No need to update pause value
  }

  /**
   * @returns {number} - Amount of seconds left on timer
   */
  getRemainingTime() {
    if (!this.paused) { // Update remaining time
      const now = new Date();
      const elapsedTime = Math.floor((now - this.lastUnpauseDate) / 1000);
      return this.remainingTime - elapsedTime;
    }
    return this.remainingTime;
  }
}
