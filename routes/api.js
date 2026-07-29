const express = require("express");
const crypto = require("crypto");

const router = express.Router();

const db = require("../database/database");

// Validar API Key
router.use((req, res, next) => {

    const apiKey = req.query.apikey || req.headers["x-api-key"];

    if (!apiKey) {
        return res.status(401).json({
            success: false,
            message: "API Key requerida."
        });
    }

    db.get(
        "SELECT * FROM users WHERE api_key=?",
        [apiKey],
        (err, user) => {

            if (err || !user) {
                return res.status(401).json({
                    success: false,
                    message: "API Key inválida."
                });
            }

            db.run(
                "UPDATE users SET requests=requests+1 WHERE id=?",
                [user.id]
            );

            req.user = user;

            next();

        }
    );

});

// Información de la API
router.get("/", (req, res) => {

    res.json({
        success: true,
        api: "Alex API",
        plan: req.user.plan,
        user: req.user.username,
        requests: req.user.requests
    });

});

// Regenerar API Key
router.get("/apikey/regenerate", (req, res) => {

    const newKey =
        "alex_" +
        crypto.randomBytes(24).toString("hex");

    db.run(
        "UPDATE users SET api_key=? WHERE id=?",
        [newKey, req.user.id],
        () => {

            res.json({
                success: true,
                api_key: newKey
            });

        }
    );

});

module.exports = router;