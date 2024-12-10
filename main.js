'use strict';

const eventEmitter = require('./core/events');
require('./server');
const path = require('path');
const db = require('./initialize');
const { app, BrowserWindow, session, Tray, Menu, shell} = require('electron');
const IP = require('./utils/ip');
const PORT = 3055;
const url = `https://${IP}:${PORT}/`;
console.log(`Server running at ${url}`);

let mainWindow;
let tray;
let splash;

function createSplashScreen() {
  splash = new BrowserWindow({
    width: 250,
    height: 250,
    icon: path.join(__dirname, 'icon.png'),
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

  // Load home page served by Express.
  mainWindow.loadURL(url + 'admin/home');
  // Open dev tools.
  mainWindow.webContents.openDevTools();
  // Open external links in user's browser.
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  })
}
// Remove default app menu.
Menu.setApplicationMenu(null);
// Check for global secret, (TODO: Is nedded?)
async function checkGlobal() {
  if (!global.secret) {
    setTimeout(checkGlobal, 1000);
  }
}
app.whenReady().then(() => {
  createSplashScreen();
  // Build tray menu.
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

  tray.setToolTip('ReMono');
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
  // Ignore certificate errors.
  session.defaultSession.setCertificateVerifyProc((request, callback) => {
    callback(0);
  });

  checkGlobal().then(() => {
    // Close slpanish screen if globals are setted.
    setTimeout(() => {
      createMainWindow();
      splash.close();
    }, 1000);
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    // app.quit();
    // Hide window instead of quit.
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
