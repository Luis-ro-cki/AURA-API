const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");

const db = new sqlite3.Database("./database/alexapi.db", (err) => {

    if (err) {
        console.log(err.message);
    } else {
        console.log("✅ Base de datos conectada");
    }

});

// =======================
// TABLA DE USUARIOS
// =======================

db.run(`
CREATE TABLE IF NOT EXISTS users (

id INTEGER PRIMARY KEY AUTOINCREMENT,

username TEXT UNIQUE,

email TEXT UNIQUE,

password TEXT,

role TEXT DEFAULT 'user',

plan TEXT DEFAULT 'FREE',

api_key TEXT,

requests INTEGER DEFAULT 0,

created_at DATETIME DEFAULT CURRENT_TIMESTAMP

)
`);

// =======================
// HISTORIAL
// =======================

db.run(`
CREATE TABLE IF NOT EXISTS history (

id INTEGER PRIMARY KEY AUTOINCREMENT,

user_id INTEGER,

endpoint TEXT,

created_at DATETIME DEFAULT CURRENT_TIMESTAMP

)
`);

// =======================
// PAGOS
// =======================

db.run(`
CREATE TABLE IF NOT EXISTS payments (

id INTEGER PRIMARY KEY AUTOINCREMENT,

email TEXT,

amount TEXT,

status TEXT,

created_at DATETIME DEFAULT CURRENT_TIMESTAMP

)
`);

// =======================
// CREAR ADMINISTRADOR
// =======================

(async () => {

const email = process.env.ADMIN_EMAIL;

const password = process.env.ADMIN_PASSWORD;

db.get(

"SELECT * FROM users WHERE email=?",

[email],

async (err, row) => {

if (row) return;

const hash = await bcrypt.hash(password,10);

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
]

);

console.log("👑 Administrador creado.");

}

);

})();

module.exports = db;