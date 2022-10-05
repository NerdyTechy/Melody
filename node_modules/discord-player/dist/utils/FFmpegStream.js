"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFFmpegStream = exports.FFMPEG_ARGS_PIPED = exports.FFMPEG_ARGS_STRING = void 0;
const prism_media_1 = require("prism-media");
function FFMPEG_ARGS_STRING(stream, fmt) {
    // prettier-ignore
    return [
        "-reconnect", "1",
        "-reconnect_streamed", "1",
        "-reconnect_delay_max", "5",
        "-i", stream,
        "-analyzeduration", "0",
        "-loglevel", "0",
        "-f", `${typeof fmt === "string" ? fmt : "s16le"}`,
        "-ar", "48000",
        "-ac", "2"
    ];
}
exports.FFMPEG_ARGS_STRING = FFMPEG_ARGS_STRING;
function FFMPEG_ARGS_PIPED(fmt) {
    // prettier-ignore
    return [
        "-analyzeduration", "0",
        "-loglevel", "0",
        "-f", `${typeof fmt === "string" ? fmt : "s16le"}`,
        "-ar", "48000",
        "-ac", "2"
    ];
}
exports.FFMPEG_ARGS_PIPED = FFMPEG_ARGS_PIPED;
/**
 * Creates FFmpeg stream
 * @param stream The source stream
 * @param options FFmpeg stream options
 */
function createFFmpegStream(stream, options) {
    if (options.skip && typeof stream !== "string")
        return stream;
    options ?? (options = {});
    const args = typeof stream === "string" ? FFMPEG_ARGS_STRING(stream, options.fmt) : FFMPEG_ARGS_PIPED(options.fmt);
    if (!Number.isNaN(options.seek))
        args.unshift("-ss", String(options.seek));
    if (Array.isArray(options.encoderArgs))
        args.push(...options.encoderArgs);
    const transcoder = new prism_media_1.FFmpeg({ shell: false, args });
    transcoder.on("close", () => transcoder.destroy());
    if (typeof stream !== "string") {
        stream.on("error", () => transcoder.destroy());
        stream.pipe(transcoder);
    }
    return transcoder;
}
exports.createFFmpegStream = createFFmpegStream;
