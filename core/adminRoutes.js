// adminRoutes.js
const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const jwt = require('jsonwebtoken');
const IP = require('../utils/ip');
const IP_URL = `https://${IP}:3055/`;
const PORT = 3055;

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

router.get('/admin-route1', (req, res) => {
  res.send('Admin Route 1');
});

router.post('/admin-route2', (req, res) => {
  res.send('Admin Route 2');
});

// Register
router.get('/qr', async (req, res) => {

  // sign up jwt exp in 20 minutes
  var token = jwt.sign({
    opt: 'new client',
    exp: Math.floor(Date.now() / 1000) + (60 * 20),
  }, global.secret);

  try {
    let url = `${IP_URL}register/${token}`;
    const qrCodeDataURL = await QRCode.toDataURL(url);
    res.render('register', { url, token, qrCodeDataURL });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error generating QR code');
  }
});


module.exports = router;