// main.js
'use strict';

const eventEmitter = require('./core/events');

require('./server');
const path = require('path');
// const m = require('./core/discoverModules');
const db = require('./initialize');
const { app, BrowserWindow, session, Tray, Menu} = require('electron');
const IP = require('./utils/ip');
const PORT = 3055;
const url = `https://${IP}:${PORT}/`;
console.log(`Server running at ${url}`);
// const discoveredModules = m.discoverModules(path.join(__dirname, 'core/modules'));
// console.log(discoveredModules);

let mainWindow;
let tray;
let splash;

function createSplashScreen() {
  splash = new BrowserWindow({
    width: 250,
    height: 250,
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    transparent: true,
  });
  splash.loadFile('core/splash.html');
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 750,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#333',
      symbolColor: '#74b1be',
      height: 60
    },
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.on('close', (event) => {
    if (!app.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
    }
    return false;
  });

  // win.loadFile('index.html');
  // Carga la aplicación desde el servidor Express
  mainWindow.loadURL(url + 'admin/home');
  // Abre las herramientas de desarrollo
  mainWindow.webContents.openDevTools();
}

Menu.setApplicationMenu(null);
async function checkGlobal() {
  if (!global.secret) {
    setTimeout(checkGlobal, 1000);
  }
}
app.whenReady().then(() => {
  createSplashScreen();
  tray = new Tray(path.join(__dirname, 'icon.png'));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Mostrar',
      click: () => {
        mainWindow.show();
      }
    },
    {
      label: 'Salir',
      click: () => {
        app.isQuiting = true;
        app.quit();
      }
    }
  ]);

  tray.setToolTip('Mi Aplicación');
  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    if (mainWindow) {
      mainWindow.show();
    } else {
      createMainWindow();
    }
  });

  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders['User-Agent'] = 'Chrome';
    details.requestHeaders['is-server-side'] = 'true';
    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });

  session.defaultSession.setCertificateVerifyProc((request, callback) => {
    callback(0); // Ignora todos los errores de certificados
  });

  checkGlobal().then(() => {
    // En el mejor de los casos mostrar solo un segundo el splash.
    setTimeout(() => {
      createMainWindow();
      splash.close();
    }, 1000);
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
  else {
    mainWindow.show();
  }
});
