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
  const username = os.userInfo().username;
  res.render('index', { username });
});

// Register
serverApp.get('/register', (req, res) => {
  const username = os.userInfo().username;
  res.render('register', { username });
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
}

app.whenReady().then(() => {
  // Ignora los errores de certificados no válidos
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders['User-Agent'] = 'Chrome';
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
