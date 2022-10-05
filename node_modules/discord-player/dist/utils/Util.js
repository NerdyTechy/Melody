"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Util = void 0;
class Util {
    /**
     * Utils
     */
    constructor() { } // eslint-disable-line @typescript-eslint/no-empty-function
    /**
     * Creates duration string
     * @param {object} durObj The duration object
     * @returns {string}
     */
    static durationString(durObj) {
        return Object.values(durObj)
            .map((m) => (isNaN(m) ? 0 : m))
            .join(":");
    }
    /**
     * Parses milliseconds to consumable time object
     * @param {number} milliseconds The time in ms
     * @returns {TimeData}
     */
    static parseMS(milliseconds) {
        const round = milliseconds > 0 ? Math.floor : Math.ceil;
        return {
            days: round(milliseconds / 86400000),
            hours: round(milliseconds / 3600000) % 24,
            minutes: round(milliseconds / 60000) % 60,
            seconds: round(milliseconds / 1000) % 60
        };
    }
    /**
     * Builds time code
     * @param {TimeData} duration The duration object
     * @returns {string}
     */
    static buildTimeCode(duration) {
        const items = Object.keys(duration);
        const required = ["days", "hours", "minutes", "seconds"];
        const parsed = items.filter((x) => required.includes(x)).map((m) => duration[m]);
        const final = parsed
            .slice(parsed.findIndex((x) => x !== 0))
            .map((x) => x.toString().padStart(2, "0"))
            .join(":");
        return final.length <= 3 ? `0:${final.padStart(2, "0") || 0}` : final;
    }
    /**
     * Picks last item of the given array
     * @param {any[]} arr The array
     * @returns {any}
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static last(arr) {
        if (!Array.isArray(arr))
            return;
        return arr[arr.length - 1];
    }
    /**
     * Checks if the voice channel is empty
     * @param {VoiceChannel|StageChannel} channel The voice channel
     * @returns {boolean}
     */
    static isVoiceEmpty(channel) {
        return channel.members.filter((member) => !member.user.bot).size === 0;
    }
    /**
     * Safer require
     * @param {string} id Node require id
     * @returns {any}
     */
    static require(id) {
        try {
            return require(id);
        }
        catch {
            return null;
        }
    }
    /**
     * Asynchronous timeout
     * @param {number} time The time in ms to wait
     * @returns {Promise<unknown>}
     */
    static wait(time) {
        return new Promise((r) => setTimeout(r, time).unref());
    }
    static noop() { } // eslint-disable-line @typescript-eslint/no-empty-function
    static async getFetch() {
        if ("fetch" in globalThis)
            return globalThis.fetch;
        for (const lib of ["undici", "node-fetch"]) {
            try {
                return await Promise.resolve().then(() => __importStar(require(lib))).then((res) => res.fetch || res.default?.fetch || res.default);
            }
            catch {
                try {
                    // eslint-disable-next-line
                    const res = require(lib);
                    if (res)
                        return res.fetch || res.default?.fetch || res.default;
                }
                catch {
                    // no?
                }
            }
        }
    }
}
exports.Util = Util;
