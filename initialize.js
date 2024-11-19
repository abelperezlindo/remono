// initialize.js
const sqlite3 = require('sqlite3').verbose();

const db = require('./core/database');

db.bootstrap().then((msg) => {
  console.log('Database has been initialized');
}).catch((err) => {
  console.error('Error initializing database');
  console.error(err);
});

(async () => {
  global.secret = await db.getVar('SECRET');
})();

module.exports = db;