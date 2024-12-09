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
const checkJWT = (token) => {
  if (!token) {
    return false;
  }
  else {
    return new Promise((resolve, reject) => {
      jwt.verify(token, global.secret, function(err, decoded) {
        if (err) {
          console.log('Error al verificar el token: ', err);
          reject(false);
        }
        else {
          eventEmitter.emit('notify', {body: 'Device connected.'});
          console.log(decoded.opt);
          resolve(true);
        }
      });
    });
  }
}

function access(req, res, next) {

  try {
    let isServer = (req.headers['is-server-side'] == 'true') ? true : false;

    if (isServer) {
      res.locals.user = {
        type: 'admin',
        name: os.userInfo().username,
        token: 'abc'
      }
      next();
    }
    else if (checkJWT(req.cookies['access_jwt'] ?? false)) {
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
