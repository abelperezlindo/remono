const os = require('os');
const jwt = require('jsonwebtoken');

// Funtion for check if an access JWT token is valid.
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

// Middleware for access control.
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
      // The token is valid, call next middleware.
      next();
    }
    else {
      res.locals.user = {
        type: 'anonymous',
        name: 'El Anon',
      }
    }

  } catch (error) {
    res.locals.user = {
      type: 'anonymous',
      name: 'El Anon',
    }
  }
}

module.exports = access;
