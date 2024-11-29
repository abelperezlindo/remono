// adminRoutes.js
const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const os = require('os');
const jwt = require('jsonwebtoken');
const IP = require('../utils/ip');
const IP_URL = `https://${IP}:3055/`;
const PORT = 3055;
const getTools = require('../configs');
const hooks = require('./hooks');
const path = require('path');
const m = require('./modules/discoverModules');
const discoveredModules = m.discoverModules(path.join(__dirname, '/modules'));
const eventEmitter = require('./events');

const user = {
  type: 'admin',
};

async function checkServerToken(req, res, next) {
  try {
    if (req.headers['is-server-side'] == 'true') {
        next(); // Token válido, continuar con la solicitud
    } else {
      res.status(401).send('Token inválido');
    }
  } catch (error) {
      res.status(500).send('Error al verificar el token');
  }
}

// Mueve aquí las rutas que usan checkServerToken.
router.use(checkServerToken);

// Ruta de ejemplo
router.get('/home', (req, res) => {
  const username = os.userInfo().username;
  res.render('index', { user, username });
});

// Register
router.get('/qr', async (req, res) => {

  // sign up jwt exp in 20 minutes
  var token = jwt.sign({
    opt: 'new client',
    exp: Math.floor(Date.now() / 1000) + (60 * 20),
  }, global.secret);

  try {
    let url = `${IP_URL}client/register/${token}`;
    const qrCodeDataURL = await QRCode.toDataURL(url);
    res.render('register', { user, url, token, qrCodeDataURL });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error generating QR code');
  }
});

// Ruta para mostrar los encabezados de la solicitud
router.get('/config', (req, res) => {
  const tools = getTools();
  // Check if the user is logged in, see the cookie or the session. WIP
  var acces_jwt = jwt.sign({
    opt: 'new client',
    exp: Math.floor(Date.now() / 1000) + (60 * 20),
  }, global.secret);

  res.render('config', { user, tools });
});

router.get('/modules', (req, res) => {
  eventEmitter.emit('greet', 'Mundo');
  let keys = Object.keys(discoveredModules);
  console.log(keys);
  res.render('modules', { user, keys,  modules: discoveredModules });
});

// Ruta para configurar módulos GET
router.get('/module/:module', (req, res, next) => {
  const moduleName = req.params.module;
  const middleware = hooks.getAdminMiddleware(moduleName);
  res.locals.user = user;

  if (middleware) {
    middleware(req, res, next);
  } else {
    res.status(404).send('Module not found');
  }
});

// Ruta para configurar módulos POST
router.post('/module/:module', (req, res, next) => {
  const moduleName = req.params.module;
  const middleware = hooks.getAdminMiddleware(moduleName);
  res.locals.user = user;

  if (middleware) {
    middleware(req, res, next);
  } else {
    res.status(404).send('Module not found');
  }
});

module.exports = router;