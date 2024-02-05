/**
 * Component that lets the user load the following data:
 * * Date / Sleep time / Wake up time / Wake up feeling / Nap? / Morning Feeling
 * / Afternoon feeling / Night feeling / Extra commentary 
 * / What Helps? Array / What didn´t help? Array (para identificar patrones)
 */

class sleepTimeComponent {
  // TODO:
  /*
   * Agregar eventHandlers
   * Quiero que me deje modificarlo solo durante el día correspondiente
   * Quiero que cuando cargue la aplicación, me abra un pop up pidiendome los
   * datos del día anterior que falten
   * Por ahora guardalo como un JSON no te mates con eso. 
   */

  constructor() {
    const html = /*html*/ `
      <form class="sleepTimeForm">
        <label for="wakeUpTime">Hora en que me desperté:</label>
        <input type="time" class="wakeUpTime" name="wakeUpTime">
        <label for="sleepTime">Hora en que me dormí:</label>
        <input type="time" class="sleepTime" name="sleepTime">
        <button id="sleepTimeSubmit" type="submit">Guardar</button>
      </form>
    `
    const container = document.createElement('div');
    container.className = 'sleepTimeFormContainer';
    container.innerHTML = html;

    this.draggableContainer = new DraggableContainer(container);

    document.body.appendChild(this.draggableContainer.container);

    this.#setEventListeners();
  }

  #buildComponent() {}
  
  #setEventListeners() {
    // TODO: revisar porque no funciona esto
    /*document.getElementById('sleepTimeSubmit').addEventListener('submit', (event) => {
      event.preventDefault(); // Prevent page refresh;
      console.log('hola');
    });*/
  }
  
}