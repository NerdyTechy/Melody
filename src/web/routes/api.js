const express = require('express');
const router = express.Router();

router.get('/nowplaying', (req, res) => {
    if (!req.query.server) return res.status(400).json({ success: false, message: "No server provided" });
    const queue = player.getQueue(req.query.server);
    if (!queue || !queue.playing) return res.status(200).json({ success: false, message: "No music playing" });
    return res.status(200).json({ success: true, message: "Success", data: { title: queue.current.title, artist: queue.current.author, url: queue.current.url, thumbnail: queue.current.thumbnail, duration: queue.current.duration, views: queue.current.views, requestedBy: queue.current.requestedBy.id } });
});

module.exports = router;