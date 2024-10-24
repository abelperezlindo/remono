// database.js
const sqlite3 = require('sqlite3').verbose();
var generator = require('generate-password');

class Database {
  constructor() {
    if (!Database.instance) {
      console.log('Creando una instancia de la base de datos');
      this.db = new sqlite3.Database('./test.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
          console.error(err.message);
        }
        console.log('Conectado a la base de datos');
      }); // Usa una base de datos en memoria para desarrollo
      Database.instance = this;
    } else {
      console.log('Usando una instancia de la base de datos');
    }

    return Database.instance;
  }

  bootstrap() {
    this.db.serialize(() => {
      // Crete some tables.
      this.db.run("CREATE TABLE IF NOT EXISTS var (key VARCHAT(255), value TEXT)");
      this.db.run("CREATE TABLE IF NOT EXISTS client (id INT, name TEXT, signup_at DATETIME DEFAULT CURRENT_TIMESTAMP)");

      this.db.all("SELECT key, value FROM var WHERE key = ?;", ['SECRET'], (err, rows) => {
        if (err) {
          console.log(`ERRRORRRRO `);
          console.error(err.message);
        }

        console.log(`Row content: ${rows}`);

        if (rows.length == 0) {
          let password = generator.generate({
            length: 20,
            numbers: true
          });
          const stmt = this.db.prepare("INSERT INTO var VALUES ('SECRET', ?)");
          stmt.run(password);
          stmt.finalize();
          console.log('New secret has generated');
        }
      });

    });
  }

  getVar(key) {
    this.db.get('SELECT value FROM var WHERE key = ?;', [key], (err, row) => {
      if (err) {
        console.log('Error ' + err);
        throw err;
      }
      return row.value;
    });
  }

  setVar(key, value) {
    let current = this.getVar(key);
    if (current) {
      const stmt = this.db.prepare("UPDATE var SET value = ? WHERE key = ?");
      stmt.run(value, key);
      stmt.finalize();
    }
    else {
      const stmt = this.db.prepare("INSERT INTO var VALUES (?, ?)");
      stmt.run(key, value);
      stmt.finalize();
    }
  }
}

// Congelar la clase para prevenir modificaciones
const instance = new Database();
Object.freeze(instance);

module.exports = instance;