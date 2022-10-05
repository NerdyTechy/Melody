module.exports = {
    Downloader: require("./src/main"),
    ytdl: require("youtube-dl-exec").raw,
    version: require("./package.json").version
};