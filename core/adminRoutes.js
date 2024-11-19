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

const path = require('path');
const m = require('./modules/discoverModules');
const discoveredModules = m.discoverModules(path.join(__dirname, '/modules'));

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
  res.render('index', { username });
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
    res.render('register', { url, token, qrCodeDataURL });
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

  res.render('config', { tools });
});

// Ruta para mostrar los encabezados de la solicitud
router.get('/modules', (req, res) => {
  console.log(discoveredModules);
  const tools = {};
  res.render('config', { tools });
});

module.exports = router;