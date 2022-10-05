"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueRepeatMode = exports.QueryType = void 0;
/**
 * The search query type
 * This can be one of:
 * - AUTO
 * - YOUTUBE
 * - YOUTUBE_PLAYLIST
 * - SOUNDCLOUD_TRACK
 * - SOUNDCLOUD_PLAYLIST
 * - SOUNDCLOUD
 * - SPOTIFY_SONG
 * - SPOTIFY_ALBUM
 * - SPOTIFY_PLAYLIST
 * - FACEBOOK
 * - VIMEO
 * - ARBITRARY
 * - REVERBNATION
 * - YOUTUBE_SEARCH
 * - YOUTUBE_VIDEO
 * - SOUNDCLOUD_SEARCH
 * @typedef {number} QueryType
 */
var QueryType;
(function (QueryType) {
    QueryType[QueryType["AUTO"] = 0] = "AUTO";
    QueryType[QueryType["YOUTUBE"] = 1] = "YOUTUBE";
    QueryType[QueryType["YOUTUBE_PLAYLIST"] = 2] = "YOUTUBE_PLAYLIST";
    QueryType[QueryType["SOUNDCLOUD_TRACK"] = 3] = "SOUNDCLOUD_TRACK";
    QueryType[QueryType["SOUNDCLOUD_PLAYLIST"] = 4] = "SOUNDCLOUD_PLAYLIST";
    QueryType[QueryType["SOUNDCLOUD"] = 5] = "SOUNDCLOUD";
    QueryType[QueryType["SPOTIFY_SONG"] = 6] = "SPOTIFY_SONG";
    QueryType[QueryType["SPOTIFY_ALBUM"] = 7] = "SPOTIFY_ALBUM";
    QueryType[QueryType["SPOTIFY_PLAYLIST"] = 8] = "SPOTIFY_PLAYLIST";
    QueryType[QueryType["FACEBOOK"] = 9] = "FACEBOOK";
    QueryType[QueryType["VIMEO"] = 10] = "VIMEO";
    QueryType[QueryType["ARBITRARY"] = 11] = "ARBITRARY";
    QueryType[QueryType["REVERBNATION"] = 12] = "REVERBNATION";
    QueryType[QueryType["YOUTUBE_SEARCH"] = 13] = "YOUTUBE_SEARCH";
    QueryType[QueryType["YOUTUBE_VIDEO"] = 14] = "YOUTUBE_VIDEO";
    QueryType[QueryType["SOUNDCLOUD_SEARCH"] = 15] = "SOUNDCLOUD_SEARCH";
})(QueryType = exports.QueryType || (exports.QueryType = {}));
/**
 * The queue repeat mode. This can be one of:
 * - OFF
 * - TRACK
 * - QUEUE
 * - AUTOPLAY
 * @typedef {number} QueueRepeatMode
 */
var QueueRepeatMode;
(function (QueueRepeatMode) {
    QueueRepeatMode[QueueRepeatMode["OFF"] = 0] = "OFF";
    QueueRepeatMode[QueueRepeatMode["TRACK"] = 1] = "TRACK";
    QueueRepeatMode[QueueRepeatMode["QUEUE"] = 2] = "QUEUE";
    QueueRepeatMode[QueueRepeatMode["AUTOPLAY"] = 3] = "AUTOPLAY";
})(QueueRepeatMode = exports.QueueRepeatMode || (exports.QueueRepeatMode = {}));
