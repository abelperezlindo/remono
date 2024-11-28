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
    res.send(req.body.message);
  } else {
    res.render('sendMessage', { user: res.locals.user, moduleName: req.params.module });
  }

};

// Registra el middleware en los hooks
hooks.registerAdminMiddleware('send_message', moduleAdminMiddleware);
hooks.registerClientMiddleware('send_message', moduleClientMiddleware);



module.exports = {
  name: 'Send Message',
  description: 'Send a message to the server',
  version: 'Alpha1',
  type: 'io',
  default: {
    in: 1000
  }
};