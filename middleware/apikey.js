const db = require("../database/database");

module.exports = (req, res, next) => {

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

            req.user = user;

            db.run(
                "UPDATE users SET requests=requests+1 WHERE id=?",
                [user.id]
            );

            db.run(
                "INSERT INTO history(user_id,endpoint) VALUES(?,?)",
                [user.id, req.originalUrl]
            );

            next();

        }
    );

};