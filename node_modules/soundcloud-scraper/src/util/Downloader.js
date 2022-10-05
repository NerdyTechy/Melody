const m3u8 = require("m3u8stream");

class Downloader {

    /**
     * SoundCloud stream downloader
     * @hideconstructor
     */
    constructor() {
        throw new Error(`The ${this.constructor.name} class may not be instantiated!`);
    }

    /**
     * Downloads `m3u8`/`hls` stream
     * @param {string} url Stream url to download
     * @param {m3u8.Options} options m3u8 download options
     * @returns {Promise<m3u8.Stream>}
     */
    static downloadHLS(url, options = {}) {
        return new Promise((resolve, reject) => {
            if (!url || typeof url !== "string") return reject(new Error(`Expected url, received "${typeof url}"!`));
            const stream = m3u8(url, options);
            return resolve(stream);
        });
    }

    /**
     * Downloads progressive stream
     * @param {string} url Stream url to download
     * @param {RequestOptions} options Request options
     * @returns {Promise<IncomingMessage>}
     */
    static downloadProgressive(url, options = {}) {
        return new Promise((resolve, reject) => {
            if (!url || typeof url !== "string") return reject(new Error(`Expected url, received "${typeof url}"!`));
            const request = url.startsWith("http://") ? require("http") : require("https");
            request.get(url, options, res => resolve(res));
        });
    }

}

module.exports = Downloader;