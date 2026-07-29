const express = require("express");

const router = express.Router();

const db = require("../database/database");

const auth = require("../middleware/auth");

// Todas las rutas requieren JWT
router.use(auth);

// Solo administrador
router.use((req, res, next) => {

    if (req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Acceso denegado."
        });
    }

    next();

});

// Dashboard
router.get("/dashboard", (req, res) => {

    db.get("SELECT COUNT(*) total FROM users", (err, users) => {

        db.get("SELECT COUNT(*) total FROM history", (err2, history) => {

            db.get(
                "SELECT COUNT(*) total FROM payments",
                (err3, payments) => {

                    res.json({
                        success: true,
                        users: users.total,
                        requests: history.total,
                        payments: payments.total
                    });

                }
            );

        });

    });

});

// Lista de usuarios
router.get("/users", (req, res) => {

    db.all(
        "SELECT id,username,email,plan,role,requests FROM users",
        [],
        (err, rows) => {

            res.json(rows);

        }
    );

});

// Cambiar plan
router.post("/plan", (req, res) => {

    const { id, plan } = req.body;

    db.run(
        "UPDATE users SET plan=? WHERE id=?",
        [plan, id],
        () => {

            res.json({
                success: true,
                message: "Plan actualizado."
            });

        }
    );

});

// Eliminar usuario
router.delete("/user/:id", (req, res