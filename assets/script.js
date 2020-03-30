const Keyboard = {
  elements: {
    main: null,
    keysContainer: null,
    keys: []
  },

  eventHandlers: {
    oniput: null,
    onclose: null
  },

  properties: {
    value: "",
    capsLock: false
  },

  init() {
    // Create main elements
    this.elements.main = document.createElement("div");
  },
  _createKeys() {

  },

  _triggerEvent(handlerName) {
    console.log("Event Triggered! Event Name: " + handlerName);
  },

  _toggleCapsLock() {
    console.log("Caps")
  },

  open(initialValue, oninput, onclose) {

  },

  close() {

  }
};

window.addEventListener("DOMContentLoaded", function() {
  Keyboard.init();
});