const { Innertube } = require("youtubei.js");

let youtube = null;

async function getClient() {
    if (!youtube) {
        youtube = await Innertube.create();
    }
    return youtube;
}

async function search(query) {
    const yt = await getClient();

    const results = await yt.search(query, {
        type: "video"
    });

    const video = results.results[0];

    if (!video) {
        throw new Error("No se encontró ningún resultado.");
    }

    return {
        id: video.id,
        title: video.title.text,
        author: video.author?.name || "Desconocido",
        duration: video.duration?.text || "",
        thumbnail: video.thumbnails?.[0]?.url || ""
    };
}

module.exports = {
    search
};