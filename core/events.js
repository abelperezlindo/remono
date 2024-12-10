const EventEmitter = require('events');
const eventEmitter = new EventEmitter();
const { Notification } = require('electron');

// Define a event handler for log an message on app logger.
eventEmitter.on('greet', (name) => {
  console.log(`Hola, ${name}!`);
});

// Define a event handler for manage opening notifications.
eventEmitter.on('notifClicked', (data) => {
  console.log('Notificación clicada (evento)');
});

// Define a event handler for launch notifications.
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
    console.error('Do not show a notification without body');
    return;
  } else {
    notification.urgency ??= 'low';
    // Launch a notification.
    const noty = new Notification({ title: notification.title, body: notification.body});
    noty.on('click', onClick);
    noty.urgency = notification.urgency;
    noty.show();
  }
});

module.exports = eventEmitter;