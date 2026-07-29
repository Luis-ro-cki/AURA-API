const express = require("express");

const router = express.Router();

const apiKey = require("../../middleware/apikey");

router.get("/", apiKey, async (req, res) => {

    const query = req.query.query;

    if (!query) {
        return res.json({
            status: false,
            message: "Falta el parámetro query"
        });
    }

    res.json({
        status: true,
        endpoint: "play2",
        query,
        message: "Próximamente devolverá el video."
    });

});

module.exports = router;