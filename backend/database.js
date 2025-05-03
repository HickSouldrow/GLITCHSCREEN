const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

// Criar a tabela de usuários se não existir
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)");
});

module.exports = db;
