// clientRoutes.js
const express = require('express');
const router = express.Router();
const db = require('./database');
const jwt = require('jsonwebtoken');
const IP = require('../utils/ip');
const IP_URL = `https://${IP}:3055/`;
const PORT = 3055;
const getTools = require('../configs');

async function checkClientToken(req, res, next) {

  try {
    if (req.headers['is-server-side'] == 'true') {
      res.status(401).send('Cant acces in server side');
    } else {
      next(); // Token válido, continuar con la solicitud
    }
  } catch (error) {
      res.status(500).send('Error al verificar el token');
  }
}

// Mueve aquí las rutas que usan checkClientToken
router.use(checkClientToken);

router.get('/register/:jwt', function(req, res) {

  jwt.verify(req.params.jwt, global.secret, function(err, decoded) {
    if (err) return res.status(401).json({ error: 'Token no válido' });
    // Validate the token
    console.log(decoded);
    res.render('register-confirm', { payload: decoded.exp, jwt: req.params.jwt});
  });
});

router.post('/register/:jwt/confirm', function(req, res) {
  console.log(req);
  const name = req.body.name;
  const initToken = req.params.jwt;
  if (req.headers['server-Token'] == 'abc') {
    return res.status(401).json({ error: 'Solo desde un dispositivo cliente' });
  }
  jwt.verify(initToken, global.secret, function(err, decoded) {
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
    res.redirect('client/panel');
  });
});

router.get('/panel', function(req, res) {
  const tools = getTools();
  // Check if the user is logged in, see the cookie or the session. WIP
  var acces_jwt = jwt.sign({
    opt: 'new client',
    exp: Math.floor(Date.now() / 1000) + (60 * 20),
  }, global.secret);

  // Set a cookie
  res.cookie('access_jwt', acces_jwt, { httpOnly: true, secure: true });
  res.render('panel', { tools });
});

module.exports = router;