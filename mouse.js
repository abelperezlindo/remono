const robot = require('robotjs');

// Mueve el puntero del ratón a la posición (100, 200)
robot.moveMouse(100, 200);
console.log('Mouse moved to (100, 200)');

// Realiza un clic del ratón
robot.mouseClick();
console.log('Mouse clicked');

// Escribe un texto
robot.typeString('Hola, mundo!');
console.log('Typed "Hola, mundo!"');

// Captura una pantalla de 100x100 píxeles desde la posición (0, 0)
const screenshot = robot.screen.capture(0, 0, 100, 100);
console.log('Screenshot taken');
