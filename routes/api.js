const express = require("express");
const crypto = require("crypto");

const router = express.Router();
const db = require("../database/database");
const apiKey = require("../middleware/apikey");

// =========================
// INFORMACIÓN DEL USUARIO
// =========================

router.get("/", apiKey, (req, res) => {

    res.json({

        success: true,

        user: req.user.username,

        email: req.user.email,

        plan: req.user.plan,

        requests: req.user.requests,

        api_key: req.user.api_key

    });

});

// =========================
// REGENERAR API KEY
// =========================

router.get("/apikey/regenerate", apiKey, (req, res) => {

    const newKey =
        "alex_" +
        crypto.randomBytes(32).toString("hex");

    db.run(

        "UPDATE users SET api_key=? WHERE id=?",

        [

            newKey,

            req.user.id

        ],

        function(err){

            if(err){

                return res.json({

                    success:false,

                    message:"No se pudo regenerar la API Key."

                });

            }

            db.run(

                "UPDATE api_keys SET api_key=? WHERE user_id=?",

                [

                    newKey,

                    req.user.id

                ]

            );

            res.json({

                success:true,

                api_key:newKey

            });

        }

    );

});

// =========================
// ESTADO DE LA API
// =========================

router.get("/status",(req,res)=>{

res.json({

success:true,

name:"Alex API",

developer:"Luis González",

version:"1.0.0",

status:"online",

time:new Date()

});

});

module.exports=router;