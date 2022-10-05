"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoiceUtils = void 0;
const discord_js_1 = require("discord.js");
const voice_1 = require("@discordjs/voice");
const StreamDispatcher_1 = require("./StreamDispatcher");
class VoiceUtils {
    /**
     * The voice utils
     * @private
     */
    constructor() {
        /**
         * The cache where voice utils stores stream managers
         * @type {Collection<Snowflake, StreamDispatcher>}
         */
        this.cache = new discord_js_1.Collection();
    }
    /**
     * Joins a voice channel, creating basic stream dispatch manager
     * @param {StageChannel|VoiceChannel} channel The voice channel
     * @param {object} [options] Join options
     * @returns {Promise<StreamDispatcher>}
     */
    async connect(channel, options) {
        const conn = await this.join(channel, options);
        const sub = new StreamDispatcher_1.StreamDispatcher(conn, channel, options.maxTime);
        this.cache.set(channel.guild.id, sub);
        return sub;
    }
    /**
     * Joins a voice channel
     * @param {StageChannel|VoiceChannel} [channel] The voice/stage channel to join
     * @param {object} [options] Join options
     * @returns {VoiceConnection}
     */
    async join(channel, options) {
        const conn = (0, voice_1.joinVoiceChannel)({
            guildId: channel.guild.id,
            channelId: channel.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
            selfDeaf: Boolean(options.deaf)
        });
        return conn;
    }
    /**
     * Disconnects voice connection
     * @param {VoiceConnection} connection The voice connection
     * @returns {void}
     */
    disconnect(connection) {
        if (connection instanceof StreamDispatcher_1.StreamDispatcher)
            return connection.voiceConnection.destroy();
        return connection.destroy();
    }
    /**
     * Returns Discord Player voice connection
     * @param {Snowflake} guild The guild id
     * @returns {StreamDispatcher}
     */
    getConnection(guild) {
        return this.cache.get(guild);
    }
}
exports.VoiceUtils = VoiceUtils;
