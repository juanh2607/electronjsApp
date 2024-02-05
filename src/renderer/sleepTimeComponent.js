/**
 * Component that lets the user load the following data:
 * * Date / Sleep time / Wake up time / Wake up feeling / Nap? / Morning Feeling
 * / Afternoon feeling / Night feeling / Extra commentary 
 * / What Helps? Array / What didn´t help? Array (para identificar patrones)
 */

class sleepTimeComponent {
  // TODO:
  /*
   * Quiero que me deje modificarlo solo durante el día correspondiente
   * Quiero que cuando cargue la aplicación, me abra un pop up pidiendome los
   * datos del día anterior que falten
   * Por ahora guardalo como un JSON no te mates con eso. 
   */

  constructor() {
    const html = /* html */ `
      <form id="sleepTimeForm" class="sleepTimeForm">
        <label for="wakeUpTime">Hora en que me desperté:</label>
        <input type="time" class="wakeUpTime" name="wakeUpTime">
        <label for="sleepTime">Hora en que me dormí:</label>
        <input type="time" class="sleepTime" name="sleepTime">
        <button id="sleepTimeSubmit" type="submit">Guardar</button>
      </form>
    `
    this.container = document.createElement('div');
    this.container.id = 'sleepTimeFormContainer';
    this.container.className = 'sleepTimeFormContainer';
    this.container.innerHTML = html;

    this.draggableContainer = new DraggableContainer(this.container);

    document.body.appendChild(this.draggableContainer.container);

    this.#setEventListeners();
  }
  
  #setEventListeners() {
    document.getElementById('sleepTimeForm').addEventListener('submit', (event) => {
      event.preventDefault(); // Prevent page refresh;
      const wakeUpTime = event.target.elements['wakeUpTime'].value;
      const sleepTime  = event.target.elements['sleepTime'].value;
    
      if (!wakeUpTime || !sleepTime) {
        const errorMsg = document.createElement('p');
        errorMsg.style.color = 'red';
        errorMsg.textContent = 'Completa todos los datos pibe';
        this.container.appendChild(errorMsg);
        return;
      }

      console.log(`Hora de despertar: ${wakeUpTime}, Hora de dormir: ${sleepTime}`);
      
      this.container.innerHTML = ``;
      this.#standByAnimation();
    });
  }

  #standByAnimation(frame = 0) {
    this.container.textContent = `Hasta un nuevo día${'.'.repeat(frame)}`;

    setTimeout(() => {
      this.#standByAnimation((frame + 1) % 4);
    }, 1000);
  }
}