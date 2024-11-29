const EventEmitter = require('events');
const eventEmitter = new EventEmitter();

// Define un manejador de eventos
eventEmitter.on('greet', (name) => {
  console.log(`Hola, ${name}!`);
});

module.exports = eventEmitter;