const Util = require("../util/Util");
const Downloader = require("../util/Downloader");
const Store = require("../store/Store");
const Embed = require("./Embed");

class Song {

    /**
     * Song constructor
     * @param {object} data raw data received
     */
    constructor(data) {
        this._patch(data);
    }

    /**
     * Patch raw data
     * @param {object} data Raw data to patch
     * @ignore
     * @private
     */
    _patch(data) {
        if (!data) return;

        /**
         * Song id
         * @type {string}
         */
        this.id = data.id || null;

        /**
         * Song title
         * @type {string}
         */
        this.title = data.title || null;

        /**
         * Song description
         * @type {string}
         */
        this.description = data.description || null;

        /**
         * Song thumbnail
         * @type {string}
         */
        this.thumbnail = data.thumbnail || null;

        /**
         * Song url
         * @type {string}
         */
        this.url = data.url || null;

        /**
         * Song duration
         * @type {number}
         */
        this.duration = data.duration || 0;

        /**
         * Number of times this song was played
         * @type {number}
         */
        this.playCount = data.playCount || 0;

        /**
         * Total comments on this song
         * @type {number}
         */
        this.commentsCount = data.commentsCount || 0;

        /**
         * Total likes on this song
         * @type {number}
         */
        this.likes = data.likes || 0;

        /**
         * Song Genre
         * @type {string}
         */
        this.genre = data.genre || null;

        /**
         * Song Author
         * @type {SongAuthor}
         */
        this.author = {
            name: data.author.name || null,
            username: data.author.username || null,
            url: data.author.url || null,
            avatarURL: data.author.avatarURL || null,
            urn: data.author.urn || null,
            verified: !!data.author.verified,
            followers: data.author.followers || 0,
            following: data.author.following || 0
        };

        /**
         * Timestamp when this song was published
         * @type {Date}
         */
        this.publishedAt = data.publishedAt || null;

        /**
         * Embed url of this song
         * @type {string}
         */
        this.embedURL = data.embedURL || null;

        /**
         * Embed object of this song
         * @type {Embed}
         */
        this.embed = data.embed || null;

        /**
         * @typedef {object} SongStreams
         * @property {string} hls HLS stream url
         * @property {string} progressive Progressive stream url
         */

        /**
         * Streams of this song
         * @type {SongStreams}
         */
        this.streams = {
            hls: data.track.hls || null,
            progressive: data.track.progressive || null
        };

        /**
         * Progressive track url
         * @type {string}
         */
        this.trackURL = data.trackURL || null;

        /**
         * Comments on this song
         * @type {Comment[]}
         */
        this.comments = data.comments || [];

        /**
         * Downloadable stream url
         * @type {string}
         */
        this.streamURL = data.streamURL || null;

        // other raw data
        Object.defineProperty(this, "_raw", { value: data });
    }

    /**
     * Returns song age in ms
     * @readonly
     * @type {number}
     */
    get age() {
        const old = this.publishedTimestamp;
        if (!old) return null;

        return Date.now() - old;
    }

    /**
     * Returns song published timestamp
     * @readonly
     * @type {number}
     */
    get publishedTimestamp() {
        if (!this.publishedAt || !(this.publishedAt instanceof Date)) return 0;
        return this.publishedAt.getTime();
    }

    /**
     * Downloads HLS stream
     * @param {Options} options m3u8 download options
     * @returns {Promise<m3u8Stream>}
     */
    async downloadHLS(options = {}) {
        const url = await Util.fetchSongStreamURL(this.streams.hls, Store.get("SOUNDCLOUD_API_KEY"));
        const streamURL = url && typeof url === "string" ? url : null;
        if (!streamURL) throw new Error("Couldn't parse stream url");

        return await Downloader.downloadHLS(streamURL, options);
    }

    /**
     * Downloads progressive stream
     * @param {RequestOptions} options Request options
     * @returns {Promise<IncomingMessage>}
     */
    async downloadProgressive(options = {}) {
        const url = this.streamURL ? this.streamURL : this.streams.progressive;
        const s_url = await Util.fetchSongStreamURL(url, Store.get("SOUNDCLOUD_API_KEY"));
        const streamURL = s_url && typeof s_url === "string" ? s_url : null;
        if (!streamURL) throw new Error("Couldn't parse stream url");

        return await Downloader.downloadProgressive(streamURL, options);
    }

    /**
     * String representation of the song
     * @returns {string}
     */
    toString() {
        return this.title || "";
    }

    /**
     * The song author
     * @typedef {object} SongAuthor
     * @property {string} name Author display name
     * @property {string} username Author username
     * @property {string} url Author profile url
     * @property {string} avatarURL Author avatar url
     * @property {number} urn Author urn
     * @property {boolean} verified Author verified status
     * @property {number} followers Number of followers
     * @property {number} following Number of followings
     */

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
     * The song info object
     * @typedef {object} SongData
     * @property {string} id Song id
     * @property {string} title Song title
     * @property {string} description Song description
     * @property {string} thumbnail Song thumbnail
     * @property {string} url Song url
     * @property {number} duration Song duration in ms
     * @property {string} playCount Total play count of the song
     * @property {string} commentsCount Total comments count
     * @property {string} likes Number of likes
     * @property {string} genre Song genre
     * @property {SongAuthor} author Song author
     * @property {Date} publishedAt Timestamp when song was published
     * @property {string} embedURL Song embed url
     * @property {?Embed} embed Song embed
     * @property {object} track Song track object
     * @property {string} [track.hls] hls stream source url
     * @property {string} [track.progressive] Progressive stream source url
     * @property {string} trackURL Progressive stream source url
     * @property {string} streamURL Song stream url
     * @property {Comment[]} comments Comments on this song
     */

    /**
     * Returns JSON object of the song
     * @returns {SongData}
     */
    toJSON() {
        return this._raw || {};
    }

}

module.exports = Song;