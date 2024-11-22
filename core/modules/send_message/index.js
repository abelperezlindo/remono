const hooks = require('../../hooks'); // Importa los hooks

// Define el middleware para el módulo
const moduleMiddleware = (req, res, next) => {
  // Lógica de configuración del módulo
  res.send(`Configuring module: ${req.params.module}`);
};

// Registra el middleware en los hooks
hooks.registerMiddleware('send_message', moduleMiddleware);

module.exports = {
  name: 'Send Message',
  description: 'Send a message to the server',
  version: 'Alpha1',
  type: 'io',
  default: {
    in: 1000
  }
};