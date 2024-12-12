const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const os = require('os');
const jwt = require('jsonwebtoken');
const IP = require('../utils/ip');
const IP_URL = `https://${IP}:3055/`;
const hooks = require('./hooks');
const path = require('path');
const m = require('./discoverModules');
const discoveredModules = m.discoverModules(path.join(__dirname, '/modules'));
const eventEmitter = require('./events');

// Route for admin homepage.
router.get('/home', (req, res) => {
  res.render('index', { });
});

// Route for get registration qr or link.
router.get('/qr', async (req, res) => {

  // Sign up jwt exp in 20 minutes
  var token = jwt.sign({
    opt: 'new client',
    exp: Math.floor(Date.now() / 1000) + (60 * 20),
  }, global.secret);

  try {
    let url = `${IP_URL}client/register/${token}`;
    const qrCodeDataURL = await QRCode.toDataURL(url);
    res.render('register', { url, token, qrCodeDataURL });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error generating QR code');
  }
});

// Route for get modules list.
router.get('/modules', (req, res) => {

  eventEmitter.emit('notify', {body: 'Notificación de lanzamiento'});
  let keys = Object.keys(discoveredModules);
  console.log(keys);
  res.render('modules', { keys,  modules: discoveredModules });
});

// Route for congifure a module (GET)
router.get('/module/:module', (req, res, next) => {
  const moduleName = req.params.module;
  const middleware = hooks.getAdminMiddleware(moduleName);

  if (middleware) {
    middleware(req, res, next);
  } else {
    res.status(404).send('Module not found');
  }
});

// Route for congifure a module (POST)
router.post('/module/:module', (req, res, next) => {
  const moduleName = req.params.module;
  const middleware = hooks.getAdminMiddleware(moduleName);

  if (middleware) {
    middleware(req, res, next);
  } else {
    res.status(404).send('Module not found');
  }
});

module.exports = router;