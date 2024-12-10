// clientRoutes.js
const express = require('express');
const router = express.Router();
const db = require('./database');
const jwt = require('jsonwebtoken');
const IP = require('../utils/ip');
const IP_URL = `https://${IP}:3055/`;
const PORT = 3055;
const getTools = require('../configs');
const hooks = require('./hooks');
const eventEmitter = require('./events');

// Ruta de ejemplo
router.get('/home', (req, res) => {
  res.render('index', { });
});

const isValidRegisterToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, global.secret, function(err, decoded) {
      if (err) {
        console.log('Error al verificar el token: ', err);
        reject(false);
      }
      else {
        resolve(decoded.exp ?? true);
      }
    });
  });
};

router.get('/register/:jwt', function(req, res) {

  if (isValidRegisterToken(req.params.jwt)) {
    res.render('register-confirm', { payload: decoded.exp, jwt: req.params.jwt});
  }
  else {
    res.status(401).json({ error: 'Invalid registration token' });
  }
});

router.post('/register/:jwt/confirm', function(req, res) {
  console.log(req);
  const name = req.body.name;
  const initToken = req.params.jwt;

  if (res.locals.user == 'admin') {
    return res.status(401).json({ error: 'Only from a client device' });
  }
  else if (req.locals.user == 'client') {
    return res.status(401).json({ error: 'This client is already registered' });
  }
  else if (initToken && isValidRegisterToken(initToken)) {
    db.setDevice({name, initToken})
    .then((result) => {
      // Check if the user is logged in, see the cookie or the session. WIP
      const acces_jwt = jwt.sign({
        did: result,
        opt: 'new client',
        exp: Math.floor(Date.now() / 1000) + (60 * 20),
      }, global.secret);

      // Set a cookie
      res.cookie('access_jwt', acces_jwt, { httpOnly: true, secure: true });
      eventEmitter.emit('notify', {body: 'Un nuevo dispositio se ah registrado!!'});

      res.redirect('/client/home');
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Error at register' });
    });
  }
});

router.get('/modules', (req, res) => {
  let keys = Object.keys(discoveredModules);
  console.log(keys);
  res.render('modules', { keys,  modules: discoveredModules });
});

// Ruta para configurar módulos GET
router.get('/module/:module', (req, res, next) => {
  const moduleName = req.params.module;
  const middleware = hooks.getClientMiddleware(moduleName);

  if (middleware) {
    middleware(req, res, next);
  } else {
    res.status(404).send('Module not found');
  }
});

// Ruta para configurar módulos POST
router.post('/module/:module', (req, res, next) => {
  const moduleName = req.params.module;
  const middleware = hooks.getClientMiddleware(moduleName);

  if (middleware) {
    middleware(req, res, next);
  } else {
    res.status(404).send('Module not found');
  }
});

module.exports = router;