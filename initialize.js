// initialize.js
const sqlite3 = require('sqlite3').verbose();

const db = require('./database');
// Realiza operaciones de configuración aquí
console.log('Realizando operaciones de configuración...');

db.bootstrap();

module.exports = db;