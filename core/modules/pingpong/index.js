const hooks = require('../../hooks'); // Importa los hooks

// Define el middleware para el módulo
const moduleMiddleware = (req, res, next) => {
  // Lógica de configuración del módulo
  res.send(`Configuring module: ${req.params.module}`);
};

// Registra el middleware en los hooks
hooks.registerMiddleware('pingpong', moduleMiddleware);

module.exports = {
  name: 'PingPong',
  description: 'Send a ping and receive a pong',
  version: 'Alpha1',
  type: 'io',
  default: {
    in: 1000
  }
};