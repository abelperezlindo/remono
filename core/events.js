const EventEmitter = require('events');
const eventEmitter = new EventEmitter();
const { Notification } = require('electron');

// Define un manejador de eventos
eventEmitter.on('greet', (name) => {
  console.log(`Hola, ${name}!`);
});

eventEmitter.on('notifClicked', (data) => {
  console.log('Notificación clicada (evento)');
});

eventEmitter.on('notify', (notification) => {
  notification.title ??= 'reMono';
  const onClick = () => {
    console.log('Notificación clicada');
    eventEmitter.emit('notifClicked', {});
    if (typeof notification.onClick === 'function') {
      notification.onClick();
    }
  };
  if (!notification.body) {
    console.error('No se puede mostrar una notificación sin cuerpo');
    return;
  } else {
    notification.urgency ??= 'low';
    const noty = new Notification({ title: notification.title, body: notification.body});
    noty.on('click', onClick);
    noty.urgency = notification.urgency;
    noty.show();
  }
});

module.exports = eventEmitter;