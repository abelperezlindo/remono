// main.js
require('./server');
// const path = require('path');
// const m = require('./core/discoverModules');
const db = require('./initialize');
const { app, BrowserWindow, session, Menu} = require('electron');
const IP = require('./utils/ip');
const PORT = 3055;
const url = `https://${IP}:${PORT}/`;
console.log(`Server running at ${url}`);
// const discoveredModules = m.discoverModules(path.join(__dirname, 'core/modules'));
// console.log(discoveredModules);

let mainWindow;
let splash;

function createSplashScreen() {
  splash = new BrowserWindow({
    width: 400,
    height: 300,
    frame: false,
    alwaysOnTop: true,
    transparent: true,
  });
  splash.loadFile('core/splash.html');
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 750,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // win.loadFile('index.html');
  // Carga la aplicación desde el servidor Express
  mainWindow.loadURL(url);
  // Abre las herramientas de desarrollo
  mainWindow.webContents.openDevTools();
}

Menu.setApplicationMenu(null);

app.whenReady().then(() => {
  createSplashScreen();
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders['User-Agent'] = 'Chrome';
    details.requestHeaders['is-server-side'] = 'true';
    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });

  session.defaultSession.setCertificateVerifyProc((request, callback) => {
    callback(0); // Ignora todos los errores de certificados
  });

  setTimeout(() => {
    createMainWindow();
    splash.close();
  }, 5000); // Espera 5 segundos antes de mostrar la ventana principal

});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});
