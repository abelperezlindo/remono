const e = require('express');

// database.js
const sqlite3 = require('sqlite3').verbose();
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
}

 // Congelar la clase para prevenir modificaciones
const instance = new Database();
Object.freeze(instance);

module.exports = instance.db;