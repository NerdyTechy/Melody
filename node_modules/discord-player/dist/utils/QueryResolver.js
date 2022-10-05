"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryResolver = void 0;
const ytdl_core_1 = require("ytdl-core");
const youtube_sr_1 = require("youtube-sr");
const types_1 = require("../types/types");
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const soundcloud_scraper_1 = require("soundcloud-scraper");
// scary things below *sigh*
const spotifySongRegex = /https?:\/\/(?:embed\.|open\.)(?:spotify\.com\/)(?:track\/|\?uri=spotify:track:)((\w|-){22})/;
const spotifyPlaylistRegex = /https?:\/\/(?:embed\.|open\.)(?:spotify\.com\/)(?:playlist\/|\?uri=spotify:playlist:)((\w|-){22})/;
const spotifyAlbumRegex = /https?:\/\/(?:embed\.|open\.)(?:spotify\.com\/)(?:album\/|\?uri=spotify:album:)((\w|-){22})/;
const vimeoRegex = /(http|https)?:\/\/(www\.|player\.)?vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^/]*)\/videos\/|video\/|)(\d+)(?:|\/\?)/;
const facebookRegex = /(https?:\/\/)(www\.|m\.)?(facebook|fb).com\/.*\/videos\/.*/;
const reverbnationRegex = /https:\/\/(www.)?reverbnation.com\/(.+)\/song\/(.+)/;
const attachmentRegex = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
// scary things above *sigh*
class QueryResolver {
    /**
     * Query resolver
     */
    constructor() { } // eslint-disable-line @typescript-eslint/no-empty-function
    /**
     * Resolves the given search query
     * @param {string} query The query
     * @returns {QueryType}
     */
    static resolve(query) {
        if ((0, soundcloud_scraper_1.validateURL)(query, "track"))
            return types_1.QueryType.SOUNDCLOUD_TRACK;
        if ((0, soundcloud_scraper_1.validateURL)(query, "playlist") || query.includes("/sets/"))
            return types_1.QueryType.SOUNDCLOUD_PLAYLIST;
        if (youtube_sr_1.YouTube.isPlaylist(query))
            return types_1.QueryType.YOUTUBE_PLAYLIST;
        if ((0, ytdl_core_1.validateID)(query) || (0, ytdl_core_1.validateURL)(query))
            return types_1.QueryType.YOUTUBE_VIDEO;
        if (spotifySongRegex.test(query))
            return types_1.QueryType.SPOTIFY_SONG;
        if (spotifyPlaylistRegex.test(query))
            return types_1.QueryType.SPOTIFY_PLAYLIST;
        if (spotifyAlbumRegex.test(query))
            return types_1.QueryType.SPOTIFY_ALBUM;
        if (vimeoRegex.test(query))
            return types_1.QueryType.VIMEO;
        if (facebookRegex.test(query))
            return types_1.QueryType.FACEBOOK;
        if (reverbnationRegex.test(query))
            return types_1.QueryType.REVERBNATION;
        if (attachmentRegex.test(query))
            return types_1.QueryType.ARBITRARY;
        return types_1.QueryType.YOUTUBE_SEARCH;
    }
    /**
     * Parses vimeo id from url
     * @param {string} query The query
     * @returns {string}
     */
    static getVimeoID(query) {
        return QueryResolver.resolve(query) === types_1.QueryType.VIMEO
            ? query
                .split("/")
                .filter((x) => !!x)
                .pop()
            : null;
    }
}
exports.QueryResolver = QueryResolver;
