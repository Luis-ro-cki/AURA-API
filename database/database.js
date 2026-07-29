const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
require("dotenv").config();

const db = new sqlite3.Database("./database/alexapi.db", (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log("✅ Base de datos conectada.");
    }
});

// ======================
// TABLA USERS
// ======================

db.run(`
CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    plan TEXT DEFAULT 'FREE',
    api_key TEXT UNIQUE,
    requests INTEGER DEFAULT 0,
    banned INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);

// ======================
// TABLA API KEYS
// ======================

db.run(`
CREATE TABLE IF NOT EXISTS api_keys(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    api_key TEXT UNIQUE,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
)
`);

// ======================
// TABLA HISTORIAL
// ======================

db.run(`
CREATE TABLE IF NOT EXISTS history(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    endpoint TEXT,
    ip TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
)
`);

// ======================
// TABLA PAGOS
// ======================

db.run(`
CREATE TABLE IF NOT EXISTS payments(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    email TEXT,
    amount TEXT,
    method TEXT,
    status TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
)
`);

// ======================
// TABLA ESTADÍSTICAS
// ======================

db.run(`
CREATE TABLE IF NOT EXISTS statistics(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    endpoint TEXT UNIQUE,
    total INTEGER DEFAULT 0
)
`);

// ======================
// TABLA ENDPOINTS
// ======================

db.run(`
CREATE TABLE IF NOT EXISTS endpoints(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    route TEXT,
    status TEXT DEFAULT 'online'
)
`);

// ======================
// TABLA CONFIGURACIÓN
// ======================

db.run(`
CREATE TABLE IF NOT EXISTS settings(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE,
    value TEXT
)
`);

// ======================
// CREAR ADMINISTRADOR
// ======================

(async () => {

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
        console.log("⚠️ ADMIN_EMAIL o ADMIN_PASSWORD no configurados.");
        return;
    }

    db.get(
        "SELECT * FROM users WHERE email=?",
        [email],
        async (err, row) => {

            if (err) {
                console.error(err.message);
                return;
            }

            if (row) {
                console.log("👑 Administrador ya existe.");
                return;
            }

            const hash = await bcrypt.hash(password, 10);

            const apiKey = "ADMIN_" + Date.now();

            db.run(
                `INSERT INTO users
                (username,email,password,role,plan,api_key)
                VALUES(?,?,?,?,?,?)`,
                [
                    "Luis",
                    email,
                    hash,
                    "admin",
                    "PREMIUM",
                    apiKey
                ],
                function(err){

                    if(err){
                        console.error(err.message);
                        return;
                    }

                    db.run(
                        `INSERT INTO api_keys(user_id,api_key)
                        VALUES(?,?)`,
                        [this.lastID, apiKey]
                    );

                    console.log("👑 Administrador creado correctamente.");

                }

            );

        }

    );

})();

module.exports = db;