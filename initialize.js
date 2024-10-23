// initialize.js
const sqlite3 = require('sqlite3').verbose();
var generator = require('generate-password');
const db = require('./database');
// Realiza operaciones de configuración aquí
console.log('Realizando operaciones de configuración...');

db.serialize(() => {
  // Crete some tables.
  db.run("CREATE TABLE IF NOT EXISTS var (key VARCHAT(255), value TEXT)");
  db.run("CREATE TABLE IF NOT EXISTS client (id INT, name TEXT, signup_at DATETIME DEFAULT CURRENT_TIMESTAMP)");

  db.all("SELECT key, value FROM var WHERE key = ?;", ['SECRET'], (err, rows) => {
    if (err) {
      console.log(`ERRRORRRRO `);
      console.error(err.message);
    }

    console.log(`Row content: ${rows}`);

    if (rows.length == 0) {
      var password = generator.generate({
        length: 20,
        numbers: true
      });
      const stmt = db.prepare("INSERT INTO var VALUES ('SECRET', ?)");
      stmt.run(password);
      stmt.finalize();
      console.log('New secret has generated');
    }
  });

});

module.exports = db;