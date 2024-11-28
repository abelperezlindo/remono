const hooks = require('../../hooks'); // Importa los hooks

// Define el middleware para el módulo
const moduleAdminMiddleware = (req, res, next) => {
  res.send(`Nothing to see here`);
};

// Define el middleware para el módulo
const moduleClientMiddleware = (req, res, next) => {
  // Lógica de configuración del módulo
  // TODO
  // If the request is a POST request, handle the form data.
  if (req.method == "POST") {
    // do form handling
    res.send(`Pong`);
  } else {
    res.render('pingpong', { moduleName: req.params.module });
  }

};

// Registra el middleware en los hooks
hooks.registerAdminMiddleware('pingpong', moduleAdminMiddleware);
hooks.registerClientMiddleware('pingpong', moduleClientMiddleware);

module.exports = {
  name: 'PingPong',
  description: 'Send a ping and receive a pong',
  version: 'Alpha1',
  type: 'io',
  default: {
    in: 1000
  }
};