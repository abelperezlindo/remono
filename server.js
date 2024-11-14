// server.js
const os = require('os');
const { Liquid } = require('liquidjs'); // Requiere LiquidJS
const express = require('express');
const path = require('path');
const https = require('https');
const selfsigned = require('selfsigned');
const serverApp = express();
const QRCode = require('qrcode');
const getTools = require('./configs');
var jwt = require('jsonwebtoken');
const WebSocket = require('ws');
const cookieParser = require('cookie-parser');
const IP = require('./utils/ip');
const db = require('./database');
const clientRoutes = require('./core/clientRoutes');
const PORT = 3055;
const IP_URL = `https://${IP}:${PORT}/`;
const lang = 'en';

// Genera un certificado SSL autofirmado
const pems = selfsigned.generate(null, { days: 365 });

// Configura LiquidJS como el motor de plantillas
const engine = new Liquid({
  root: path.join(__dirname, 'views'), // Carpeta de vistas
  extname: '.liquid' // Extensión de archivos de plantilla
});

serverApp.engine('liquid', engine.express()); // Configura el motor de plantillas
serverApp.set('view engine', 'liquid'); // Establece LiquidJS como el motor de vistas
serverApp.set('views', [path.join(__dirname, 'views'), path.join(__dirname, 'core', 'modules', '*','views')]); // Carpeta de vistas

serverApp.use('/client', clientRoutes);

// Configura Express para servir archivos estáticos
serverApp.use(express.static(path.join(__dirname, 'public')));

// Configura cookie-parser
serverApp.use(cookieParser());

// Middleware para parsear JSON y datos de formularios URL-encoded
serverApp.use(express.json());
serverApp.use(express.urlencoded({ extended: true }));

// Middleware for pasar variables globales a todas las plantillas
serverApp.use((req, res, next) => {
  res.locals.lang = lang;
  next();
});

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

// Ruta de ejemplo
serverApp.get('/', checkServerToken, (req, res) => {
  const username = os.userInfo().username;
  res.render('index', { username });
});

// Register
serverApp.get('/register', checkServerToken, async (req, res) => {

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

serverApp.get('/register/:jwt', checkClientToken, function(req, res) {

  jwt.verify(req.params.jwt, global.secret, function(err, decoded) {
    if (err) return res.status(401).json({ error: 'Token no válido' });
    // Validate the token
    console.log(decoded);
    res.render('register-confirm', { payload: decoded.exp, jwt: req.params.jwt});
  });
});

serverApp.post('/register/:jwt/confirm', checkClientToken, function(req, res) {
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
    res.redirect('/panel');
  });
});

serverApp.get('/panel', checkClientToken, function(req, res) {
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

// Ruta para mostrar los encabezados de la solicitud
serverApp.get('/about', (req, res) => {
  res.render('about');
});

// Ruta para mostrar los encabezados de la solicitud
serverApp.get('/config', checkServerToken, (req, res) => {
  const tools = getTools();
  // Check if the user is logged in, see the cookie or the session. WIP
  var acces_jwt = jwt.sign({
    opt: 'new client',
    exp: Math.floor(Date.now() / 1000) + (60 * 20),
  }, global.secret);

  res.render('config', { tools });
});

// Configura HTTPS
const options = {
  key: pems.private,
  cert: pems.cert
};

// Inicia el servidor HTTPS
const server = https.createServer(options, serverApp).listen(PORT, () => {
  console.log(`Servidor web escuchando en https://localhost:${PORT}`);
});

// Configura el servidor WebSocket
const wss = new WebSocket.Server({ server });
wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
    // Envía una respuesta al cliente
    ws.send('Message received');
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

module.exports = serverApp;
