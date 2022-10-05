const fetch = require("node-fetch").default;
const Constants = require("../constants/Constants");
const cheerio = require("cheerio");
const Store = require("../store/Store");

class Util {

    /**
     * SoundCloud Scraper Utility
     */
    constructor() {
        throw new Error(`The ${this.constructor.name} class may not be instantiated!`);
    }

    /**
     * Returns last item from array
     * @param {any[]} arr Array
     */
    static last(arr = []) {
        if (!arr.length) return null;
        return arr[arr.length - 1];
    }

    /**
     * Validates soundcloud url
     * @param {string} url URL to validate
     * @param {("all"|"track"|"playlist"|"artist")} [type="all"] URL validation type
     * @returns {boolean}
     */
    static validateURL(url = null, type = "all") {
        if (typeof url !== "string") return false;
        
        switch(type) {
            case "artist":
                return Constants.REGEX_ARTIST.test(url);
            case "playlist":
                return Constants.REGEX_SET.test(url) || (url.match(/soundcloud.app.goo.gl/) && url.split("/").pop().length === 5);
            case "track":
                return Constants.REGEX_TRACK.test(url) || url.match(/soundcloud.app.goo.gl/) && url.split("/").pop().length > 5;
            default:
                return Constants.SOUNDCLOUD_URL_REGEX.test(url) || url.match(/soundcloud.app.goo.gl/);
        }
        
    }

    /**
     * Request a url
     * @param {RequestInfo} url URL to request
     * @param {RequestInit} options Request options
     * @returns {Promise<Response>}
     */
    static request(url = null, options = {}) {
        return fetch(url, options);
    }

    /**
     * Parse HTML from a url
     * @param {RequestInfo} url URL to parse HTML from
     * @param {RequestInit} options Request options
     * @returns {Promise<string>}
     */
    static parseHTML(url = null, options = {}) {
        return new Promise((resolve) => {
            Util.request(url, { redirect: "follow", ...options })
                .then(res => res.text())
                .then(body => resolve(body))
                .catch(() => resolve(""));
        });
    }

    /**
     * Loads html
     * @param {?string} html HTML to load
     * @returns {CheerioRoot}
     */
    static loadHTML(html = null) {
        if (!html) throw new Error("No data to load");
        const $ = cheerio.load(html);

        return $;
    }

    /**
     * Parse duration and convert it to ms.
     * @param {string} duration Raw duration to parse
     * @returns {number}
     */
    static parseDuration(duration) {
        if (typeof duration !== "string") return 0;
        const hours = duration.substr(2, 2);
        const minutes = duration.substr(5, 2);
        const seconds = duration.substr(8, 2);
        return (hours * 60 * 60 * 1000) + (minutes * 60 * 1000) + (seconds * 1000);
    }

    /**
     * The comment object
     * @typedef {object} Comment
     * @property {string} text Comment content
     * @property {Date} createdAt Timestamp when comment was created
     * @property {object} author Comment author
     * @property {string} [author.name] Author name
     * @property {string} [author.username] Author username
     * @property {string} [author.url] Author url
     */

    /**
     * Parse comments
     * @param {string} commentSection Comment section to parse
     * @returns {Comment[]}
     */
    static parseComments(commentSection) {
        if (!commentSection) return null;
        let section = commentSection.trim().split("</time>");
        let arr = [];
        section.forEach(item => {
            if (!item.includes("Comment by <a")) return;
            let prop = item.split("Comment by <a")[1];
            let url = prop.split('href="')[1].split('">')[0].trim();
            let username = prop.split(`${url}">`)[1].split("</a>")[0].trim();
            let content = item.split("<p>")[1].split("</p>")[0].trim();
            let timestamp = item.split("<time pubdate>")[1];

            let obj = {
                text: content,
                createdAt: new Date(timestamp),
                author: {
                    name: username,
                    username: url.replace("/", ""),
                    url: `https://soundcloud.com${url}`
                }
            };

            arr.push(obj);
        });

        return arr;
    }

    /**
     * Returns soundcloud audio url
     * @param {string} songURL Soung url
     * @param {?string} clientID Soundcloud client id
     * @returns {Promise<string>}
     */
    static fetchSongStreamURL(songURL, clientID) {
        return new Promise(async (resolve, reject) => {
            if (!songURL) return reject("ERROR_NO_URL");
            if (!clientID && Store.has("SOUNDCLOUD_API_KEY")) clientID = Store.get("SOUNDCLOUD_API_KEY");
            const CLIENT_ID = clientID ? clientID : await Util.keygen();
            if (!CLIENT_ID) return reject(new Error("Client id not found"));

            try {
                let res = await Util.request(`${songURL}?client_id=${CLIENT_ID}`, {
                    headers: Constants.STREAM_FETCH_HEADERS,
                    redirect: "manual"
                });
                if (res.status !== 200) {
                    const hasError = Constants.STREAM_ERRORS[`${res.status}`];
                    if (!!hasError) return reject(new Error(`[Code: ${res.status}] ${hasError}`));
                    return reject(new Error(`[Code: ${res.status}] Rejected with status code "${res.status}"!`));
                };
                res = await res.json();
                if (!res.url) return reject(new Error("Couldn't find stream url"));

                resolve(res.url);

            } catch(e) {
                reject(new Error("Stream parse failed!"));
            }
        });
    }

    /**
     * Fetches soundcloud api key
     * @param {boolean} [force=false] Forcefully parse soundcloud key
     * @returns {Promise<?string>}
     */
    static keygen(force = false) {
        return new Promise(async resolve => {
            if (Store.has("SOUNDCLOUD_API_KEY") && !force) return resolve(Store.get("SOUNDCLOUD_API_KEY"));
            try {
                const html = await Util.parseHTML(Constants.SOUNDCLOUD_BASE_URL);
                const res = html.split('<script crossorigin src="');
                const urls = [];
                let index = 0;
                let key;

                res.forEach(u => {
                    let url = u.replace('"></script>', "");
                    let chunk = url.split("\n")[0];
                    if (Constants.SOUNDCLOUD_KEYGEN_URL_REGEX.test(chunk)) {
                        urls.push(chunk);
                    };
                });

                while (index !== urls.length && !key) {
                    let url = urls[index];
                    index++;
                    if (Constants.SOUNDCLOUD_API_KEY_REGEX.test(url)) {
                        const data = await Util.parseHTML(url);
                        if (data.includes(',client_id:"')) {
                            const a = data.split(',client_id:"');
                            key = a[1].split('"')[0];
                            if (index === urls.length) {
                                Store.set("SOUNDCLOUD_API_KEY", key);
                                return resolve(Store.get("SOUNDCLOUD_API_KEY"));
                            };
                        }
                    }
                };

            } catch(e) {
                console.error(e)
                resolve(null);
            }
        });
    }

}

module.exports = Util;