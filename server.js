// server.js
const { Liquid } = require('liquidjs'); // Requiere LiquidJS
const express = require('express');
const path = require('path');
const https = require('https');
const selfsigned = require('selfsigned');
const serverApp = express();
const getTools = require('./configs');
const jwt = require('jsonwebtoken');
const WebSocket = require('ws');
const cookieParser = require('cookie-parser');
const clientRoutes = require('./core/clientRoutes');
const adminRoutes = require('./core/adminRoutes');
const PORT = 3055;
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
serverApp.use('/admin', adminRoutes);
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
