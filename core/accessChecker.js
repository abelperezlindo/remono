// accessChecker.js
const os = require('os');
const jwt = require('jsonwebtoken');

// Check jwt from cookie.
/*   jwt.verify(initToken, global.secret, function(err, decoded) {
    if (err) return res.status(401).json({ error: 'Token no válido', err });
    // Validate the token
    // Save the user
    // Redirect to the panel
    db.setDevice({name, initToken})
      .then((result) => {
        // Results is device id.
      }).catch((err) => {
        console.error(err);
      });
      eventEmitter.emit('notify', {body: 'Un nuevo dispositio se ah registrado!!'});
    res.redirect('client/panel');
  }); */
// Middleware para verificar el acceso
function access(req, res, next) {

  try {
    let isServer = (req.headers['is-server-side'] == 'true') ? true : false;
    let isValidClient = true; // Validar el token del cliente @todo

    if (isServer) {
      res.locals.user = {
        type: 'admin',
        name: os.userInfo().username,
        token: 'abc'
      }
      next();
    }
    else if (isValidClient) {
      res.locals.user = {
        type: 'client',
        name: 'El Cliente',
        token: 'abc'
      }
      next(); // Token válido, continuar con la solicitud
    }
    else {
      res.locals.user = {
        type: 'anonymous',
        name: 'El Anon',
      }
      res.status(401).send('Token inválido');
    }

  } catch (error) {
    res.locals.user = {
      type: 'anonymous',
      name: 'El Anon',
    }
    res.status(500).send('Error al verificar el token');
  }
}

module.exports = access;
