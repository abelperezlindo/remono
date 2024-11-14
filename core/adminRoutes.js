// adminRoutes.js
const express = require('express');
const router = express.Router();

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

module.exports = router;