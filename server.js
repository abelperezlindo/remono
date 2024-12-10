const { Liquid } = require('liquidjs');
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

// Generates a self-signed SSL certificate
const pems = selfsigned.generate(null, { days: 365 });

// Config LiquidJS as the template engine
let engine = new Liquid({
  root: path.join(__dirname, 'views'),
  extname: '.liquid'
});
// Get list of template folders of Modules.
const templatesFolders = registerTemplateFolders(path.join(__dirname, 'core', 'modules'));

serverApp.engine('liquid', engine.express());
serverApp.set('view engine', 'liquid');
// Register template folders of Modules.
serverApp.set('views', templatesFolders);
// Middleware for cookies.
serverApp.use(cookieParser());
// Middleware for access control.
serverApp.use(access);
// Middleware for setting context variables to be used in templates.
serverApp.use((req, res, next) => {
  res.locals.lang = lang;
  res.locals.currentUrl = req.originalUrl;
  next();
});
// Separates routes for clients and administrator.
serverApp.use('/client', clientRoutes);
serverApp.use('/admin', adminRoutes);

// Config public folder.
serverApp.use(express.static(path.join(__dirname, 'public')));
// Register public folders of Modules.
registerPublicFolders(serverApp, path.join(__dirname, 'core', 'modules'));

// Middleware for parsing JSON and URL-encoded data
serverApp.use(express.json());
serverApp.use(express.urlencoded({ extended: true }));

// Common route 'about'.
serverApp.get('/about', (req, res) => {
  res.render('about');
});

// Config HTTPS.
const options = {
  key: pems.private,
  cert: pems.cert
};

//  Create the HTTPS server
const server = https.createServer(options, serverApp).listen(PORT, () => {
  console.log(`Web server running at https://localhost:${PORT}`);
});

// Config WebSocket server.
const wss = new WebSocket.Server({ server });
wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
    ws.send('Message received');
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

module.exports = serverApp;
