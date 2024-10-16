// database.js
const sqlite3 = require('sqlite3').verbose();

class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }

    // Perform initialization tasks here...
    this.connection = /* connect to database */;

    Database.instance = this;
  }

  query(sql) {
    return this.connection.query(sql);
  }
}

const db = new Database();

module.exports = Database;