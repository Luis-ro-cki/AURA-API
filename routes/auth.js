const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const router = express.Router();
const db = require("../database/database");

// ====================
// REGISTRO
// ====================

router.post("/register", async (req, res) => {

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.json({
            success: false,
            message: "Completa todos los campos."
        });
    }

    db.get(
        "SELECT * FROM users WHERE email=?",
        [email],
        async (err, user) => {

            if (user) {
                return res.json({
                    success: false,
                    message: "El correo ya existe."
                });
            }

            const hash = await bcrypt.hash(password, 10);

            const apiKey =
                "alex_" +
                crypto.randomBytes(32).toString("hex");

            db.run(
                `INSERT INTO users
                (username,email,password,api_key)
                VALUES(?,?,?,?)`,
                [
                    username,
                    email,
                    hash,
                    apiKey
                ],
                function(err){

                    if(err){

                        return res.json({
                            success:false,
                            message:"Error al registrar."
                        });

                    }

                    res.json({

                        success:true,

                        message:"Cuenta creada.",

                        api_key:apiKey

                    });

                });

        });

});

// ====================
// LOGIN
// ====================

router.post("/login",(req,res)=>{

const {email,password}=req.body;

db.get(

"SELECT * FROM users WHERE email=?",

[email],

async(err,user)=>{

if(!user){

return res.json({

success:false,

message:"Correo incorrecto."

});

}

const ok=await bcrypt.compare(

password,

user.password

);

if(!ok){

return res.json({

success:false,

message:"Contraseña incorrecta."

});

}

const token=jwt.sign({

id:user.id,

role:user.role,

email:user.email

},

process.env.JWT_SECRET,

{

expiresIn:"30d"

});

res.json({

success:true,

token,

username:user.username,

plan:user.plan,

api_key:user.api_key

});

});

});

module.exports=router;