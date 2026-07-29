const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database/alexapi.db", (err) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log("✅ Base de datos conectada");
    }
});

// Usuarios
db.run(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    password TEXT,
    plan TEXT DEFAULT 'FREE',
    role TEXT DEFAULT 'user',
    api_key TEXT,
    requests INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);

// Historial
db.run(`
CREATE TABLE IF NOT EXISTS history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    endpoint TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);

// Pagos
db.run(`
CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT,
    amount TEXT,
    status TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);

module.exports = db;