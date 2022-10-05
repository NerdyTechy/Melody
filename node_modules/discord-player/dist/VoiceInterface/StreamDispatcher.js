"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamDispatcher = void 0;
const voice_1 = require("@discordjs/voice");
const tiny_typed_emitter_1 = require("tiny-typed-emitter");
const Util_1 = require("../utils/Util");
const PlayerError_1 = require("../Structures/PlayerError");
class StreamDispatcher extends tiny_typed_emitter_1.TypedEmitter {
    /**
     * Creates new connection object
     * @param {VoiceConnection} connection The connection
     * @param {VoiceChannel|StageChannel} channel The connected channel
     * @private
     */
    constructor(connection, channel, connectionTimeout = 20000) {
        super();
        this.connectionTimeout = connectionTimeout;
        this.readyLock = false;
        /**
         * The voice connection
         * @type {VoiceConnection}
         */
        this.voiceConnection = connection;
        /**
         * The audio player
         * @type {AudioPlayer}
         */
        this.audioPlayer = (0, voice_1.createAudioPlayer)();
        /**
         * The voice channel
         * @type {VoiceChannel|StageChannel}
         */
        this.channel = channel;
        /**
         * The paused state
         * @type {boolean}
         */
        this.paused = false;
        this.voiceConnection.on("stateChange", async (_, newState) => {
            if (newState.status === voice_1.VoiceConnectionStatus.Disconnected) {
                if (newState.reason === voice_1.VoiceConnectionDisconnectReason.WebSocketClose && newState.closeCode === 4014) {
                    try {
                        await (0, voice_1.entersState)(this.voiceConnection, voice_1.VoiceConnectionStatus.Connecting, this.connectionTimeout);
                    }
                    catch {
                        try {
                            this.voiceConnection.destroy();
                        }
                        catch (err) {
                            this.emit("error", err);
                        }
                    }
                }
                else if (this.voiceConnection.rejoinAttempts < 5) {
                    await Util_1.Util.wait((this.voiceConnection.rejoinAttempts + 1) * 5000);
                    this.voiceConnection.rejoin();
                }
                else {
                    try {
                        this.voiceConnection.destroy();
                    }
                    catch (err) {
                        this.emit("error", err);
                    }
                }
            }
            else if (newState.status === voice_1.VoiceConnectionStatus.Destroyed) {
                this.end();
            }
            else if (!this.readyLock && (newState.status === voice_1.VoiceConnectionStatus.Connecting || newState.status === voice_1.VoiceConnectionStatus.Signalling)) {
                this.readyLock = true;
                try {
                    await (0, voice_1.entersState)(this.voiceConnection, voice_1.VoiceConnectionStatus.Ready, this.connectionTimeout);
                }
                catch {
                    if (this.voiceConnection.state.status !== voice_1.VoiceConnectionStatus.Destroyed) {
                        try {
                            this.voiceConnection.destroy();
                        }
                        catch (err) {
                            this.emit("error", err);
                        }
                    }
                }
                finally {
                    this.readyLock = false;
                }
            }
        });
        this.audioPlayer.on("stateChange", (oldState, newState) => {
            if (newState.status === voice_1.AudioPlayerStatus.Playing) {
                if (!this.paused)
                    return void this.emit("start", this.audioResource);
            }
            else if (newState.status === voice_1.AudioPlayerStatus.Idle && oldState.status !== voice_1.AudioPlayerStatus.Idle) {
                if (!this.paused) {
                    void this.emit("finish", this.audioResource);
                    this.audioResource = null;
                }
            }
        });
        this.audioPlayer.on("debug", (m) => void this.emit("debug", m));
        this.audioPlayer.on("error", (error) => void this.emit("error", error));
        this.voiceConnection.subscribe(this.audioPlayer);
    }
    /**
     * Creates stream
     * @param {Readable|Duplex|string} src The stream source
     * @param {object} [ops] Options
     * @returns {AudioResource}
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createStream(src, ops) {
        this.audioResource = (0, voice_1.createAudioResource)(src, {
            inputType: ops?.type ?? voice_1.StreamType.Arbitrary,
            metadata: ops?.data,
            // eslint-disable-next-line no-extra-boolean-cast
            inlineVolume: !Boolean(ops?.disableVolume)
        });
        return this.audioResource;
    }
    /**
     * The player status
     * @type {AudioPlayerStatus}
     */
    get status() {
        return this.audioPlayer.state.status;
    }
    /**
     * Disconnects from voice
     * @returns {void}
     */
    disconnect() {
        try {
            this.audioPlayer.stop(true);
            this.voiceConnection.destroy();
        }
        catch { } // eslint-disable-line no-empty
    }
    /**
     * Stops the player
     * @returns {void}
     */
    end() {
        this.audioPlayer.stop();
    }
    /**
     * Pauses the stream playback
     * @param {boolean} [interpolateSilence=false] If true, the player will play 5 packets of silence after pausing to prevent audio glitches.
     * @returns {boolean}
     */
    pause(interpolateSilence) {
        const success = this.audioPlayer.pause(interpolateSilence);
        this.paused = success;
        return success;
    }
    /**
     * Resumes the stream playback
     * @returns {boolean}
     */
    resume() {
        const success = this.audioPlayer.unpause();
        this.paused = !success;
        return success;
    }
    /**
     * Play stream
     * @param {AudioResource<Track>} [resource=this.audioResource] The audio resource to play
     * @returns {Promise<StreamDispatcher>}
     */
    async playStream(resource = this.audioResource) {
        if (!resource)
            throw new PlayerError_1.PlayerError("Audio resource is not available!", PlayerError_1.ErrorStatusCode.NO_AUDIO_RESOURCE);
        if (resource.ended)
            return void this.emit("error", new PlayerError_1.PlayerError("Cannot play a resource that has already ended."));
        if (!this.audioResource)
            this.audioResource = resource;
        if (this.voiceConnection.state.status !== voice_1.VoiceConnectionStatus.Ready) {
            try {
                await (0, voice_1.entersState)(this.voiceConnection, voice_1.VoiceConnectionStatus.Ready, this.connectionTimeout);
            }
            catch (err) {
                return void this.emit("error", err);
            }
        }
        try {
            this.audioPlayer.play(resource);
        }
        catch (e) {
            this.emit("error", e);
        }
        return this;
    }
    /**
     * Sets playback volume
     * @param {number} value The volume amount
     * @returns {boolean}
     */
    setVolume(value) {
        if (!this.audioResource?.volume || isNaN(value) || value < 0 || value > Infinity)
            return false;
        this.audioResource.volume.setVolumeLogarithmic(value / 100);
        return true;
    }
    /**
     * The current volume
     * @type {number}
     */
    get volume() {
        if (!this.audioResource?.volume)
            return 100;
        const currentVol = this.audioResource.volume.volume;
        return Math.round(Math.pow(currentVol, 1 / 1.660964) * 100);
    }
    /**
     * The playback time
     * @type {number}
     */
    get streamTime() {
        if (!this.audioResource)
            return 0;
        return this.audioResource.playbackDuration;
    }
}
exports.StreamDispatcher = StreamDispatcher;
