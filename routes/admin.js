const express = require("express");

const router = express.Router();

const db = require("../database/database");

// ========================
// Middleware Admin
// ========================

function admin(req, res, next) {

    const email = req.headers["admin-email"];
    const password = req.headers["admin-password"];

    if (
        email !== process.env.ADMIN_EMAIL ||
        password !== process.env.ADMIN_PASSWORD
    ) {

        return res.status(401).json({
            success: false,
            message: "Acceso denegado."
        });

    }

    next();

}

// ========================
// Dashboard
// ========================

router.get("/dashboard", admin, (req, res) => {

    db.get(

        `SELECT
        (SELECT COUNT(*) FROM users) AS users,
        (SELECT COUNT(*) FROM history) AS requests,
        (SELECT COUNT(*) FROM payments) AS payments`,

        [],

        (err, row) => {

            if (err) {

                return res.json({
                    success: false
                });

            }

            res.json({

                success: true,

                users: row.users,

                requests: row.requests,

                payments: row.payments

            });

        }

    );

});

// ========================
// Usuarios
// ========================

router.get("/users", admin, (req, res) => {

    db.all(

        `SELECT
        id,
        username,
        email,
        role,
        plan,
        requests,
        created_at
        FROM users
        ORDER BY id DESC`,

        [],

        (err, rows) => {

            if (err) {

                return res.json({
                    success: false
                });

            }

            res.json(rows);

        }

    );

});

// ========================
// Eliminar usuario
// ========================

router.delete("/user/:id", admin, (req, res) => {

    db.run(

        "DELETE FROM users WHERE id=?",

        [req.params.id],

        function(err){

            if(err){

                return res.json({

                    success:false,

                    message:"No eliminado."

                });

            }

            res.json({

                success:true,

                message:"Usuario eliminado."

            });

        }

    );

});

// ========================
// Cambiar plan
// ========================

router.post("/plan", admin, (req, res) => {

    const { id, plan } = req.body;

    db.run(

        "UPDATE users SET plan=? WHERE id=?",

        [plan, id],

        function(err){

            if(err){

                return res.json({

                    success:false

                });

            }

            res.json({

                success:true,

                message:"Plan actualizado."

            });

        }

    );

});

module.exports = router;