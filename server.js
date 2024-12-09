// server.js
const { Liquid } = require('liquidjs'); // Requiere LiquidJS
const express = require('express');
const path = require('path');
const https = require('https');
const selfsigned = require('selfsigned');
const serverApp = express();
const WebSocket = require('ws');
const cookieParser = require('cookie-parser');
const registerPublicFolders = require('./core/publicFolders');
const registerTemplateFolders = require('./core/templateFolders');
const clientRoutes = require('./core/clientRoutes');
const adminRoutes = require('./core/adminRoutes');
const access = require('./core/accessChecker');
const PORT = 3055;
const lang = 'en';

// Genera un certificado SSL autofirmado
const pems = selfsigned.generate(null, { days: 365 });

// Configura LiquidJS como el motor de plantillas
let engine = new Liquid({
  root: path.join(__dirname, 'views'), // Carpeta de vistas
  extname: '.liquid' // Extensión de archivos de plantilla
});
const templatesFolders = registerTemplateFolders(path.join(__dirname, 'core', 'modules'));

serverApp.engine('liquid', engine.express()); // Configura el motor de plantillas
serverApp.set('view engine', 'liquid'); // Establece LiquidJS como el motor de vistas
// serverApp.set('views', [path.join(__dirname, 'views')]); // Carpeta de vistas
serverApp.set('views', templatesFolders); // Carpeta de vistas
serverApp.use(cookieParser());
serverApp.use(access); // Middleware para verificar el acceso
// Middleware for pasar variables globales a todas las plantillas
serverApp.use((req, res, next) => {
  res.locals.lang = lang;
  res.locals.currentUrl = req.originalUrl ?? 'holamundo';
  next();
});

// Registra carpetas de plantillas dinámicamente
serverApp.use('/client', clientRoutes);
serverApp.use('/admin', adminRoutes);
// Configura Express para servir archivos estáticos
serverApp.use(express.static(path.join(__dirname, 'public')));
// Registra carpetas públicas dinámicamente
registerPublicFolders(serverApp, path.join(__dirname, 'core', 'modules'));

// Middleware para parsear JSON y datos de formularios URL-encoded
serverApp.use(express.json());
serverApp.use(express.urlencoded({ extended: true }));

// Ruta para mostrar los encabezados de la solicitud
serverApp.get('/about', (req, res) => {
  res.render('about');
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
