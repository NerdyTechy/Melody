const fetch = require("node-fetch");
const Song = require("./src/Song");
const Artist = require("./src/Artist");
const https = require("https");
const { Readable } = require("stream");

/**
 * Returns ReadableStream
 * @param {string} link Reverbnation song url
 * @returns {Promise<Readable>}
 */
function rvdl(link) {
    return new Promise(async (resolve, reject) => {
        const data = await ReverbnationScraper(link);
        if (!data) return reject(new Error("Invalid url."));
        https.get(data.streamURL, res => {
            return resolve(res);
        });
    });
}

/**
 * Returns song data
 * @param {string} link link to parse
 */
async function ReverbnationScraper(link) {
    if (!link) throw new Error("Invalid url!");

    try {
        const res = await fetch(link);
        const html = await res.text();
        const rawJSON = html.split("var config = ")[1].split(";")[0];
        const json = JSON.parse(rawJSON);

        const obj = {
            ...new Song(json.PRIMARY_SONG),
            artist: new Artist(json),
            songs: []
        };

        json.SECONDARY_SONGS.forEach(i => {
            obj.songs.push(new Song(i))
        });

        return obj;
    } catch (e) {
        return null;
    }

};

module.exports = rvdl;
rvdl.getInfo = ReverbnationScraper;