const express = require("express");

const router = express.Router();

const apiKey = require("../../middleware/apikey");
const youtube = require("../../services/youtube");

router.get("/", apiKey, async (req, res) => {

    try {

        const query = req.query.query;

        if (!query) {

            return res.status(400).json({
                success: false,
                message: "Falta el parámetro query."
            });

        }

        const video = await youtube.search(query);

        return res.json({

            success: true,

            developer: "Luis González",

            endpoint: "play",

            result: video

        });

    } catch (err) {

        return res.status(500).json({

            success: false,

            message: err.message

        });

    }

});

module.exports = router;