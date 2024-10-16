// main.js
const { app, BrowserWindow, session} = require('electron');
const os = require('os');
const { Liquid } = require('liquidjs'); // Requiere LiquidJS
const express = require('express');
const path = require('path');
const https = require('https');
const selfsigned = require('selfsigned');
const serverApp = express();
const PORT = 3055;
const QRCode = require('qrcode');
const initializeApp = require('./initialize');
const getTools = require('./configs');
var jwt = require('jsonwebtoken');


// Genera un certificado SSL autofirmado
const pems = selfsigned.generate(null, { days: 365 });

// Configura LiquidJS como el motor de plantillas
const engine = new Liquid({
  root: path.join(__dirname, 'views'), // Carpeta de vistas
  extname: '.liquid' // Extensión de archivos de plantilla
});

serverApp.engine('liquid', engine.express()); // Configura el motor de plantillas
serverApp.set('view engine', 'liquid'); // Establece LiquidJS como el motor de vistas
serverApp.set('views', path.join(__dirname, 'views')); // Carpeta de vistas

// Configura Express para servir archivos estáticos
serverApp.use(express.static(path.join(__dirname, 'public')));

// Ruta de ejemplo
serverApp.get('/', (req, res) => {
  // Server side app config.
  if (!req.headers['server-jwt'] || req.headers['server-jwt'] !== 'abc') {
    return res.status(401).json({ error: 'No autorizado' });
  }
  const username = os.userInfo().username;
  res.render('index', { username });
});

// Register
serverApp.get('/register', async (req, res) => {

  if (!req.headers['server-jwt'] || req.headers['server-jwt'] !== 'abc') {
    return res.status(401).json({ error: 'No autorizado' });
  }

  // sign up jwt exp in 20 minutes
  var token = jwt.sign({
    opt: 'new client',
    exp: Math.floor(Date.now() / 1000) + (60 * 20),
  }, 'replace_this_with_a_secret');

  try {
    let url = 'https://localhost:3055/register/' + token
    const qrCodeDataURL = await QRCode.toDataURL(url);
    res.render('register', { url, token, qrCodeDataURL });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error generating QR code');
  }
});

serverApp.get('/register/:jwt', function(req, res) {
  if (req.headers['server-jwt'] == 'abc') {
    return res.status(300).json({ error: 'Solo desde un dispositivo cliente' });
  }

  jwt.verify(req.params.jwt, 'replace_this_with_a_secret', function(err, decoded) {
    if (err) return res.status(401).json({ error: 'Token no válido' });
    // Validate the token
    console.log(decoded);
    res.render('register-confirm', { payload: decoded.exp, jwt: req.params.jwt});
  });
});

serverApp.post('/register/:jwt', function(req, res) {
  const usersList = req.body;
  if (req.headers['server-jwt'] == 'abc') {
    return res.status(401).json({ error: 'Solo desde un dispositivo cliente' });
  }
  jwt.verify(req.params.jwt, 'replace_this_with_a_secret', function(err, decoded) {
    if (err) return res.status(401).json({ error: 'Token no válido', err });
    // Validate the token
    // Save the user
    // Redirect to the panel
    res.redirect('/panel');
  });
});

serverApp.get('/panel', function(req, res) {
  if (req.headers['server-jwt'] == 'abc') {
    return res.status(401).json({ error: 'Solo desde un dispositivo cliente' });
  }
  const tools = getTools();
  // Check if the user is logged in, see the cookie or the session. WIP
  var acces_jwt = jwt.sign({
    opt: 'new client',
    exp: Math.floor(Date.now() / 1000) + (60 * 20),
  }, 'replace_this_with_a_secret');

  res.render('panel', { tools });
});

// Ruta para mostrar los encabezados de la solicitud
serverApp.get('/headers', (req, res) => {
  if (!req.headers['server-jwt'] || req.headers['server-jwt'] !== 'abc') {
    return res.status(401).json({ error: 'No autorizado' });
  }
  res.json({'msg': 'OK'});
});

// Configura HTTPS
const options = {
  key: pems.private,
  cert: pems.cert
};

// Inicia el servidor HTTPS
https.createServer(options, serverApp).listen(PORT, () => {
  console.log(`Servidor web escuchando en https://localhost:${PORT}`);
});


function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // win.loadFile('index.html');
  // Carga la aplicación desde el servidor Express
  win.loadURL(`https://localhost:${PORT}/`);
  // Abre las herramientas de desarrollo
  win.webContents.openDevTools();
}

app.whenReady().then(() => {
  const db = initializeApp();
  // Ignora los errores de certificados no válidos
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders['User-Agent'] = 'Chrome';
    details.requestHeaders['Server-jwt'] = 'abc';
    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });

  session.defaultSession.setCertificateVerifyProc((request, callback) => {
    callback(0); // Ignora todos los errores de certificados
  });

  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
