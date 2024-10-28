// main.js
require('./server');
const db = require('./initialize');
const { app, BrowserWindow, session, Menu} = require('electron');
const IP = require('./utils/ip');
const PORT = 3055;
const url = `https://${IP}:${PORT}/`;
console.log(`Server running at ${url}`);


console.log(`Get var holamundo`);
db.getVar('holamundo').then((holamundo) => {
  console.log(`holamundo: ${holamundo}`);
});
db.setVar('pepe', 'marta').then((result) => {
  console.log(result);
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 750,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // win.loadFile('index.html');
  // Carga la aplicación desde el servidor Express
  win.loadURL(url);
  // Abre las herramientas de desarrollo
  win.webContents.openDevTools();
}

Menu.setApplicationMenu(null);

app.whenReady().then(() => {
  //const db = initializeApp();
  // Ignora los errores de certificados no válidos
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders['User-Agent'] = 'Chrome';
    details.requestHeaders['Server-Token'] = 'abc';
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
