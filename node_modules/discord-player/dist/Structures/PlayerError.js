"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerError = exports.ErrorStatusCode = void 0;
var ErrorStatusCode;
(function (ErrorStatusCode) {
    ErrorStatusCode["STREAM_ERROR"] = "StreamError";
    ErrorStatusCode["AUDIO_PLAYER_ERROR"] = "AudioPlayerError";
    ErrorStatusCode["PLAYER_ERROR"] = "PlayerError";
    ErrorStatusCode["NO_AUDIO_RESOURCE"] = "NoAudioResource";
    ErrorStatusCode["UNKNOWN_GUILD"] = "UnknownGuild";
    ErrorStatusCode["INVALID_ARG_TYPE"] = "InvalidArgType";
    ErrorStatusCode["UNKNOWN_EXTRACTOR"] = "UnknownExtractor";
    ErrorStatusCode["INVALID_EXTRACTOR"] = "InvalidExtractor";
    ErrorStatusCode["INVALID_CHANNEL_TYPE"] = "InvalidChannelType";
    ErrorStatusCode["INVALID_TRACK"] = "InvalidTrack";
    ErrorStatusCode["UNKNOWN_REPEAT_MODE"] = "UnknownRepeatMode";
    ErrorStatusCode["TRACK_NOT_FOUND"] = "TrackNotFound";
    ErrorStatusCode["NO_CONNECTION"] = "NoConnection";
    ErrorStatusCode["DESTROYED_QUEUE"] = "DestroyedQueue";
})(ErrorStatusCode = exports.ErrorStatusCode || (exports.ErrorStatusCode = {}));
class PlayerError extends Error {
    constructor(message, code = ErrorStatusCode.PLAYER_ERROR) {
        super();
        this.createdAt = new Date();
        this.message = `[${code}] ${message}`;
        this.statusCode = code;
        this.name = code;
        Error.captureStackTrace(this);
    }
    get createdTimestamp() {
        return this.createdAt.getTime();
    }
    valueOf() {
        return this.statusCode;
    }
    toJSON() {
        return {
            stack: this.stack,
            code: this.statusCode,
            message: this.message,
            created: this.createdTimestamp
        };
    }
    toString() {
        return this.stack;
    }
}
exports.PlayerError = PlayerError;
