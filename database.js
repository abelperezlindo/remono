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
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        // Crete some tables.
        this.db.run("CREATE TABLE IF NOT EXISTS var (key VARCHAT(255), value TEXT)");
        this.db.run("CREATE TABLE IF NOT EXISTS device (id INTEGER PRIMARY KEY, name VARCHAR(25) NOT NULL, token TEXT NOT NULL, signup_at DATETIME DEFAULT CURRENT_TIMESTAMP)");

        this.db.all("SELECT key, value FROM var WHERE key = ?;", ['SECRET'], (err, rows) => {
          if (err) { reject(err) }

          if (rows.length == 0) {
            let password = generator.generate({
              length: 20,
              numbers: true
            });
            const stmt = this.db.prepare("INSERT INTO var VALUES ('SECRET', ?)");
            stmt.run(password);
            stmt.finalize();
            resolve('New secret has generated');
          }
        });

        this.setVar('SERVER_TOKEN', generator.generate({length: 20, numbers: true })).then((msg) => {  // Set the server token
          console.log(msg);
        });

      });
    });
  }

  getVar(key) {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT value FROM var WHERE key = ?;', [key], (err, row) => {
        if (err) {
          console.log('Error ' + err);
          reject(err);
        }
        if (!row) {
          resolve(null);
        } else {
          resolve(row.value);
        }
      });
    });
  }

  setVar(key, value) {
    return new Promise((resolve, reject) => {
      this.getVar(key).then((current) => {
        if (current) {
          const stmt = this.db.prepare("UPDATE var SET value = ? WHERE key = ?");
          stmt.run(value, key);
          stmt.finalize();
          resolve('Value has been updated');
        } else {
          const stmt = this.db.prepare("INSERT INTO var VALUES (?, ?)");
          stmt.run(key, value);
          stmt.finalize();
          resolve('Value has been inserted');
        }
      }).catch((err) => {
        reject(err);
      });
    });
  }

  setDevice(device) {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare("INSERT INTO device (name, token) VALUES (?, ?)");
      stmt.run(device.name, device.initToken);
      stmt.finalize((err) => {
        if (err) {
          reject(err);
        }
        else {
          this.db.get('SELECT last_insert_rowid() as id', (err, row) => {
            if (err) { reject(err); }
            resolve(row.id);
          });
        }
      });
    });
  }
}

// Congelar la clase para prevenir modificaciones
const instance = new Database();
Object.freeze(instance);

module.exports = instance;