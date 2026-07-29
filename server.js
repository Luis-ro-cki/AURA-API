require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// =======================
// CONFIGURACIÓN
// =======================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

// =======================
// BASE DE DATOS
// =======================

require("./database/database");

// =======================
// RUTAS
// =======================

app.use("/auth", require("./routes/auth"));

app.use("/api", require("./routes/api"));

app.use("/admin", require("./routes/admin"));

app.use("/payments", require("./routes/payments"));

// Descargas

app.use("/api/download/play", require("./routes/download/play"));

app.use("/api/download/play2", require("./routes/download/play2"));

// =======================
// PÁGINA PRINCIPAL
// =======================

app.get("/", (req, res) => {

    res.sendFile(path.join(__dirname, "public", "index.html"));

});

// =======================
// ESTADO DEL SERVIDOR
// =======================

app.get("/status", (req, res) => {

    res.json({

        success: true,

        name: "Alex API",

        developer: "Luis González",

        version: "1.0.0",

        status: "online",

        uptime: process.uptime(),

        timestamp: new Date()

    });

});

// =======================
// ERROR 404
// =======================

app.use((req, res) => {

    res.status(404).json({

        success: false,

        message: "Ruta no encontrada."

    });

});

// =======================
// INICIAR SERVIDOR
// =======================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log("====================================");

    console.log("🚀 Alex API iniciada correctamente");

    console.log("🌐 Puerto:", PORT);

    console.log("👨‍💻 Developer: Luis González");

    console.log("====================================");

});