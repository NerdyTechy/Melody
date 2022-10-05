"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtractorModel = void 0;
class ExtractorModel {
    /**
     * Model for raw Discord Player extractors
     * @param {string} extractorName Name of the extractor
     * @param {object} data Extractor object
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(extractorName, data) {
        /**
         * The extractor name
         * @type {string}
         */
        this.name = extractorName;
        /**
         * The raw model
         * @name ExtractorModel#_raw
         * @type {any}
         * @private
         */
        Object.defineProperty(this, "_raw", { value: data, configurable: false, writable: false, enumerable: false });
    }
    /**
     * Method to handle requests from `Player.play()`
     * @param {string} query Query to handle
     * @returns {Promise<ExtractorModelData>}
     */
    async handle(query) {
        const data = await this._raw.getInfo(query);
        if (!data)
            return null;
        return {
            playlist: data.playlist ?? null,
            data: data.info?.map((m) => ({
                title: m.title,
                duration: m.duration,
                thumbnail: m.thumbnail,
                engine: m.engine,
                views: m.views,
                author: m.author,
                description: m.description,
                url: m.url,
                source: m.source || "arbitrary"
            })) ?? []
        };
    }
    /**
     * Method used by Discord Player to validate query with this extractor
     * @param {string} query The query to validate
     * @returns {boolean}
     */
    validate(query) {
        return Boolean(this._raw.validate(query));
    }
    /**
     * The extractor version
     * @type {string}
     */
    get version() {
        return this._raw.version ?? "0.0.0";
    }
}
exports.ExtractorModel = ExtractorModel;
