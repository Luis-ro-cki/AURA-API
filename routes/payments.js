const express = require("express");

const router = express.Router();

const db = require("../database/database");

// Registrar pago
router.post("/paypal", (req, res) => {

    const {

        email,

        amount,

        transaction_id

    } = req.body;

    if (!email || !amount || !transaction_id) {

        return res.json({

            success: false,

            message: "Faltan datos."

        });

    }

    db.get(

        "SELECT * FROM users WHERE email=?",

        [email],

        (err, user) => {

            if (!user) {

                return res.json({

                    success: false,

                    message: "Usuario no encontrado."

                });

            }

            db.run(

                `INSERT INTO payments
                (user_id,email,amount,method,status)
                VALUES(?,?,?,?,?)`,

                [

                    user.id,

                    email,

                    amount,

                    "PayPal",

                    "completed"

                ]

            );

            db.run(

                "UPDATE users SET plan='PREMIUM' WHERE id=?",

                [user.id]

            );

            res.json({

                success: true,

                message: "Pago registrado.",

                plan: "PREMIUM"

            });

        }

    );

});

// Historial de pagos
router.get("/", (req, res) => {

    db.all(

        "SELECT * FROM payments ORDER BY id DESC",

        [],

        (err, rows) => {

            if (err) {

                return res.json({

                    success: false

                });

            }

            res.json({

                success: true,

                payments: rows

            });

        }

    );

});

module.exports = router;