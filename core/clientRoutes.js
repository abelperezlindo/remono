// clientRoutes.js
const express = require('express');
const router = express.Router();

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

router.get('/client-route1', (req, res) => {
  res.send('Client Route 1');
});

router.post('/client-route2', (req, res) => {
  res.send('Client Route 2');
});

module.exports = router;