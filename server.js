require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

// Base de datos
require("./database/database");

// Rutas principales
app.use("/auth", require("./routes/auth"));
app.use("/api", require("./routes/api"));
app.use("/admin", require("./routes/admin"));

// Descargas
app.use("/api/download/play", require("./routes/download/play"));
app.use("/api/download/play2", require("./routes/download/play2"));

// Página principal
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Estado de la API
app.get("/status", (req, res) => {
    res.json({
        success: true,
        name: "Alex API",
        version: "1.0.0",
        developer: "Luis González",
        status: "online"
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Alex API iniciada en el puerto ${PORT}`);
});