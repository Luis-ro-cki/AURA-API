const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();
const db = require("../database/database");

// Registro
router.post("/register", async (req, res) => {

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Completa todos los campos."
        });
    }

    try {

        const hash = await bcrypt.hash(password, 10);

        const apiKey = "alex_" + uuidv4().replace(/-/g, "");

        db.run(
            `INSERT INTO users(username,email,password,api_key)
             VALUES(?,?,?,?)`,
            [username, email, hash, apiKey],
            function(err){

                if(err){
                    return res.json({
                        success:false,
                        message:"El usuario o correo ya existe."
                    });
                }

                res.json({
                    success:true,
                    message:"Cuenta creada correctamente.",
                    api_key: apiKey
                });

            }
        );

    } catch(err){

        res.status(500).json({
            success:false,
            message:"Error interno."
        });

    }

});

// Login
router.post("/login",(req,res)=>{

    const {email,password}=req.body;

    db.get(
        "SELECT * FROM users WHERE email=?",
        [email],
        async(err,user)=>{

            if(err || !user){

                return res.json({
                    success:false,
                    message:"Correo incorrecto."
                });

            }

            const ok=await bcrypt.compare(password,user.password);

            if(!ok){

                return res.json({
                    success:false,
                    message:"Contraseña incorrecta."
                });

            }

            const token=jwt.sign(
                {
                    id:user.id,
                    email:user.email,
                    role:user.role
                },
                process.env.JWT_SECRET,
                {
                    expiresIn:"7d"
                }
            );

            res.json({
                success:true,
                token,
                api_key:user.api_key,
                plan:user.plan,
                username:user.username
            });

        });

});

module.exports = router;