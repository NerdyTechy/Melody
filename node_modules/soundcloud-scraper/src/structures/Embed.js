const Util = require("../util/Util");

class Embed {

    /**
     * SoundCloud Rich Embed
     * @param {object} data Raw data to instantiate this class
     * @param {?string} embedURL embed url
     */
    constructor(data, embedURL = null) {

        /**
         * Embed url
         * @type {string}
         */
        this.url = typeof embedURL !== "string" ? null : embedURL;
        this._patch(data);
    }

    /**
     * Patch raw data
     * @param {object} data Raw data to patch
     * @private
     * @ignore
     * @returns {void}
     */
    _patch(data) {
        if (!data) return;

        /**
         * Embed version
         * @type {number}
         */
        this.version = data.version || 1.0;

        /**
         * Embed type
         * @type {string}
         */
        this.type = data.type || "rich";

        /**
         * @typedef {object} EmbedProvider
         * @property {string} name Provider name
         * @property {string} url provider url
         */

        /**
         * Embed provider info
         * @type {EmbedProvider}
         */
        this.provider = {
            name: data.provider_name || "SoundCloud",
            url: data.provider_url || "https://soundcloud.com"
        };

        /**
         * Embed height
         * @type {number}
         */
        this.height = data.height || null;

        /**
         * Embed width
         * @type {number}
         */
        this.width = data.width || null;

        /**
         * Embed title
         * @type {string}
         */
        this.title = data.title || null;

        /**
         * Embed description
         * @type {string}
         */
        this.description = data.description || null;

        /**
         * @typedef {object} EmbedAuthor
         * @property {string} name Author name
         * @property {string} url Author URL
         */

        /**
         * Embed author
         * @type {EmbedAuthor}
         */
        this.author = {
            name: data.author_name || null,
            url: data.author_url || null
        };

        /**
         * Thumbnail url
         * @type {string}
         */
        this.thumbnailURL = data.thumbnail_url || null;
        
        // raw data
        Object.defineProperty(this, "_raw", { value: data || null });
    }

    /**
     * Embed visualizer url
     * @type {string}
     */
    get visualizer() {
        const $ = Util.loadHTML(this.toHTML());
        const url = $("iframe").attr("src");
        return url;
    }

    /**
     * Returns embed html
     * @returns {string}
     */
    toHTML() {
        if (this._raw && this._raw.html) return this._raw.html;
        return "";
    }

    /**
     * Returns JSON version of the data
     * @returns {object}
     */
    toJSON() {
        return this._raw || {};
    }

    /**
     * String representation of this embed
     * @returns {string}
     */
    toString() {
        return this.url || "";
    }

}

module.exports = Embed;