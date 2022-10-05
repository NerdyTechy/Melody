"use strict";
var _Queue_instances, _Queue_lastVolume, _Queue_destroyed, _Queue_watchDestroyed, _Queue_getBufferingTimeout;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queue = void 0;
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const Track_1 = tslib_1.__importDefault(require("./Track"));
const types_1 = require("../types/types");
const ytdl_core_1 = tslib_1.__importDefault(require("ytdl-core"));
const voice_1 = require("@discordjs/voice");
const Util_1 = require("../utils/Util");
const youtube_sr_1 = tslib_1.__importDefault(require("youtube-sr"));
const AudioFilters_1 = tslib_1.__importDefault(require("../utils/AudioFilters"));
const PlayerError_1 = require("./PlayerError");
const FFmpegStream_1 = require("../utils/FFmpegStream");
class Queue {
    /**
     * Queue constructor
     * @param {Player} player The player that instantiated this queue
     * @param {Guild} guild The guild that instantiated this queue
     * @param {PlayerOptions} [options] Player options for the queue
     */
    constructor(player, guild, options = {}) {
        _Queue_instances.add(this);
        this.tracks = [];
        this.previousTracks = [];
        this.playing = false;
        this.metadata = null;
        this.repeatMode = 0;
        this.id = discord_js_1.SnowflakeUtil.generate().toString();
        this._streamTime = 0;
        this._cooldownsTimeout = new discord_js_1.Collection();
        this._activeFilters = []; // eslint-disable-line @typescript-eslint/no-explicit-any
        this._filtersUpdate = false;
        _Queue_lastVolume.set(this, 0);
        _Queue_destroyed.set(this, false);
        this.onBeforeCreateStream = null;
        /**
         * The player that instantiated this queue
         * @type {Player}
         * @readonly
         */
        this.player = player;
        /**
         * The guild that instantiated this queue
         * @type {Guild}
         * @readonly
         */
        this.guild = guild;
        /**
         * The player options for this queue
         * @type {PlayerOptions}
         */
        this.options = {};
        /**
         * Queue repeat mode
         * @type {QueueRepeatMode}
         * @name Queue#repeatMode
         */
        /**
         * Queue metadata
         * @type {any}
         * @name Queue#metadata
         */
        /**
         * Previous tracks
         * @type {Track[]}
         * @name Queue#previousTracks
         */
        /**
         * Regular tracks
         * @type {Track[]}
         * @name Queue#tracks
         */
        /**
         * The connection
         * @type {StreamDispatcher}
         * @name Queue#connection
         */
        /**
         * The ID of this queue
         * @type {Snowflake}
         * @name Queue#id
         */
        Object.assign(this.options, {
            leaveOnEnd: true,
            leaveOnStop: true,
            leaveOnEmpty: true,
            leaveOnEmptyCooldown: 1000,
            autoSelfDeaf: true,
            ytdlOptions: {
                highWaterMark: 1 << 25
            },
            initialVolume: 100,
            bufferingTimeout: 3000,
            spotifyBridge: true,
            disableVolume: false
        }, options);
        if ("onBeforeCreateStream" in this.options)
            this.onBeforeCreateStream = this.options.onBeforeCreateStream;
        this.player.emit("debug", this, `Queue initialized:\n\n${this.player.scanDeps()}`);
    }
    /**
     * Returns current track
     * @type {Track}
     */
    get current() {
        if (tslib_1.__classPrivateFieldGet(this, _Queue_instances, "m", _Queue_watchDestroyed).call(this))
            return;
        return this.connection.audioResource?.metadata ?? this.tracks[0];
    }
    /**
     * If this queue is destroyed
     * @type {boolean}
     */
    get destroyed() {
        return tslib_1.__classPrivateFieldGet(this, _Queue_destroyed, "f");
    }
    /**
     * Returns current track
     * @returns {Track}
     */
    nowPlaying() {
        if (tslib_1.__classPrivateFieldGet(this, _Queue_instances, "m", _Queue_watchDestroyed).call(this))
            return;
        return this.current;
    }
    /**
     * Connects to a voice channel
     * @param {GuildChannelResolvable} channel The voice/stage channel
     * @returns {Promise<Queue>}
     */
    async connect(channel) {
        if (tslib_1.__classPrivateFieldGet(this, _Queue_instances, "m", _Queue_watchDestroyed).call(this))
            return;
        const _channel = this.guild.channels.resolve(channel);
        if (![discord_js_1.ChannelType.GuildStageVoice, discord_js_1.ChannelType.GuildVoice].includes(_channel?.type))
            throw new PlayerError_1.PlayerError(`Channel type must be GuildVoice or GuildStageVoice, got ${_channel?.type}!`, PlayerError_1.ErrorStatusCode.INVALID_ARG_TYPE);
        const connection = await this.player.voiceUtils.connect(_channel, {
            deaf: this.options.autoSelfDeaf
        });
        this.connection = connection;
        if (_channel.type === discord_js_1.ChannelType.GuildStageVoice) {
            await _channel.guild.members.me.voice.setSuppressed(false).catch(async () => {
                return await _channel.guild.members.me.voice.setRequestToSpeak(true).catch(Util_1.Util.noop);
            });
        }
        this.connection.on("error", (err) => {
            if (tslib_1.__classPrivateFieldGet(this, _Queue_instances, "m", _Queue_watchDestroyed).call(this, false))
                return;
            this.player.emit("connectionError", this, err);
        });
        this.connection.on("debug", (msg) => {
            if (tslib_1.__classPrivateFieldGet(this, _Queue_instances, "m", _Queue_watchDestroyed).call(this, false))
                return;
            this.player.emit("debug", this, msg);
        });
        this.player.emit("connectionCreate", this, this.connection);
        this.connection.on("start", (resource) => {
            if (tslib_1.__classPrivateFieldGet(this, _Queue_instances, "m", _Queue_watchDestroyed).call(this, false))
                return;
            this.playing = true;
            if (!this._filtersUpdate)
                this.player.emit("trackStart", this, resource?.metadata ?? this.current);
            this._filtersUpdate = false;
        });
        this.connection.on("finish", async (resource) => {
            if (tslib_1.__classPrivateFieldGet(this, _Queue_instances, "m", _Queue_watchDestroyed).call(this, false))
                return;
            this.playing = false;
            if (this._filtersUpdate)
                return;
            this._streamTime = 0;
            if (resource?.metadata)
                this.previousTracks.push(resource.metadata);
            this.player.emit("trackEnd", this, resource.metadata);
            if (!this.tracks.length && this.repeatMode === types_1.QueueRepeatMode.OFF) {
                if (this.options.leaveOnEnd)
                    this.destroy();
                this.player.emit("queueEnd", this);
            }
            else if (!this.tracks.length && this.repeatMode === types_1.QueueRepeatMode.AUTOPLAY) {
                this._handleAutoplay(Util_1.Util.last(this.previousTracks));
            }
            else {
                if (this.repeatMode === types_1.QueueRepeatMode.TRACK)
                    return void this.play(Util_1.Util.last(this.previousTracks), { immediate: true });
                if (this.repeatMode === types_1.QueueRepeatMode.QUEUE)
                    this.tracks.push(Util_1.Util.last(this.previousTracks));
                const nextTrack = this.tracks.shift();
                this.play(nextTrack, { immediate: true });
                return;
            }
        });
        return this;
    }
    /**
     * Destroys this queue
     * @param {boolean} [disconnect=this.options.leaveOnStop] If it should leave on destroy
     * @returns {void}
     */
    destroy(disconnect = this.options.leaveOnStop) {
        if (tslib_1.__classPrivateFieldGet(this, _Queue_instances, "m", _Queue_watchDestroyed).call(this))
            return;
        if (this.connection)
            this.connection.end();
        if (disconnect)
            this.connection?.disconnect();
        this.player.queues.delete(this.guild.id);
        this.player.voiceUtils.cache.delete(this.guild.id);
        tslib_1.__classPrivateFieldSet(this, _Queue_destroyed, true, "f");
    }
    /**
     * Skips current track
     * @returns {boolean}
     */
    skip() {
        if (tslib_1.__classPrivateFieldGet(this, _Queue_instances, "m", _Queue_watchDestroyed).call(this))
            return;
        if (!this.connection)
            return false;
        this._filtersUpdate = false;
        this.connection.end();
        return true;
    }
    /**
     * Adds single track to the queue
     * @param {Track} track The track to add
     * @returns {void}
     */
    addTrack(track) {
        if (tslib_1.__classPrivateFieldGet(this, _Queue_instances, "m", _Queue_watchDestroyed).call(this))
            return;
        if (!(track instanceof Track_1.default))
            throw new PlayerError_1.PlayerError("invalid track", PlayerError_1.ErrorStatusCode.INVALID_TRACK);
        this.tracks.push(track);
        this.player.emit("trackAdd", this, track);
    }
    /**
     * Adds multiple tracks to the queue
     * @param {Track[]} tracks Array of tracks to add
     */
    addTracks(tracks) {
        if (tslib_1.__classPrivateFieldGet(this, _Queue_instances, "m", _Queue_watchDestroyed).call(this))
            return;
        if (!tracks.every((y) => y instanceof Track_1.default))
            throw new PlayerError_1.PlayerError("invalid track", PlayerError_1.ErrorStatusCode.INVALID_TRACK);
        this.tracks.push(...tracks);
        this.player.emit("tracksAdd", this, tracks);
    }
    /**
     * Sets paused state
     * @param {boolean} paused The paused state
     * @returns {boolean}
     */
    setPaused(paused) {
        if (tslib_1.__classPrivateFieldGet(this, _Queue_instances, "m", _Queue_watchDestroyed).call(this))
            return;
        if (!this.connection)
            return false;
        return paused ? this.connection.pause(true) : this.connection.resume();
    }
    /**
     * Sets bitrate
     * @param  {number|auto} bitrate bitrate to set
     * @returns {void}
     */
    setBitrate(bitrate) {
        if (tslib_1.__classPrivateFieldGet(this, _Queue_instances, "m", _Queue_watchDestroyed).call(this))
            return;
        if (!this.connection?.audioResource?.encoder)
            return;
        if (bitrate === "auto")
            bitrate = this.connection.channel?.bitrate ?? 64000;
        this.connection.audioResource.encoder.setBitrate(bitrate);
    }
    /**
     * Sets volume
     * @param {number} amount The volume amount
     * @returns {boolean}
     */
    setVolume(amount) {
        if (tslib_1.__classPrivateFieldGet(this, _Queue_instances, "m", _Queue_watchDestroyed).call(this))
            return;
        if (!this.connection)
            return false;
        tslib_1.__classPrivateFieldSet(this, _Queue_lastVolume, amount, "f");
        this.options.initialVolume = amount;
        return this.connection.setVolume(amount);
    }
    /**
     * Sets repeat mode
     * @param  {QueueRepeatMode} mode The repeat mode
     * @returns {boolean}
     */
    setRepeatMode(mode) {
        if (tslib_1.__classPrivateFieldGet(this, _Queue_instances, "m", _Queue_watchDestroyed).call(this))
            return;
        if (![types_1.QueueRepeatMode.OFF, types_1.QueueRepeatMode.QUEUE, types_1.QueueRepeatMode.TRACK, types_1.QueueRepeatMode.AUTOPLAY].includes(mode))
            throw new PlayerError_1.PlayerError(`Unknown repeat mode "${mode}"!`, PlayerError_1.ErrorStatusCode.UNKNOWN_REPEAT_MODE);
        if (mode === this.repeatMode)
            return false;
        this.repeatMode = mode;
        return true;
    }
    /**
     * The current volume amount
     * @type {number}
     */
    get volume() {
        if (tslib_1.__classPrivateFieldGet(this, _Queue_instances, "m", _Queue_watchDestroyed).call(this))
            return;
        if (!this.connection)
            return 100;
        return this.connection.volume;
    }
    set volume(amount) {
        this.setVolume(amount);
    }
    /**
     * The stream time of this queue
     * @type {number}
     */
    get streamTime() {
        if (tslib_1.__classPrivateFieldGet(this, _Queue_instances, "m", _Queue_watchDestroyed).call(this))
            return;
        if (!this.connection)
            return 0;
        const playbackTime = this._streamTime + this.connection.streamTime;
        const NC = this._activeFilters.includes("nightcore") ? 1.25 : null;
        const VW = this._activeFilters.includes("vaporwave") ? 0.8 : null;
        if (NC && VW)
            return playbackTime * (NC + VW);
        return NC ? playbackTime * NC : VW ? playbackTime * VW : playbackTime;
    }
    set streamTime(time) {
        if (tslib_1.__classPrivateFieldGet(this, _Queue_instances, "m", _Queue_watchDestroyed).call(this))
            return;
        this.seek(time);
    }
    /**
     * Returns enabled filters
     * @returns {AudioFilters}
     */
    getFiltersEnabled() {
        if (tslib_1.__classPrivateFieldGet(this, _Queue_instances, "m", _Queue_watchDestroyed).call(this))
            return;
        return AudioFilters_1.default.names.filter((x) => this._activeFilters.includes(x));
    }
    /**
     * Returns disabled filters
     * @returns {AudioFilters}
     */
    getFiltersDisabled() {
        if (tslib_1.__classPrivateFieldGet(this, _Queue_instances, "m", _Queue_watchDestroyed).call(this))
            return;
        return AudioFilters_1.default.names.filter((x) => !this._activeFilters.includes(x));
    }
    /**
     * Sets filters
     * @param {QueueFilters} filters Queue filters
     * @returns {Promise<void>}
     */
    async setFilters(filters) {
        if (tslib_1.__classPrivateFieldGet(this, _Queue_instances, "m", _Queue_watchDestroyed).call(this))
            return;
        if (!filters || !Object.keys(filters).length) {
            // reset filters
            const streamTime = this.streamTime;
            this._activeFilters = [];
            return await this.play(this.current, {
                immediate: true,
                filtersUpdate: true,
                seek: streamTime,
                encoderArgs: []
            });
        }
        const _filters = []; // eslint-disable-line @typescript-eslint/no-explicit-any
        for (const filter in filters) {
            if (filters[filter] === true)
                _filters.push(filter);
        }
        if (this._activeFilters.join("") === _filters.join(""))
            return;
        const newFilters = AudioFilters_1.default.create(_filters).trim();
        const streamTime = this.streamTime;
        this._activeFilters = _filters;
        return await this.play(this.current, {
            immediate: true,
            filtersUpdate: true,
            seek: streamTime,
            encoderArgs: !_filters.length ? undefined : ["-af", newFilters]
        });
    }
    /**
     * Seeks to the given time
     * @param {number} position The position
     * @returns {boolean}
     */
    async seek(position) {
        if (tslib_1.__classPrivateFieldGet(this, _Queue_instances, "m", _Queue_watchDestroyed).call(this))
            return;
        if (!this.playing || !this.current)
            return false;
        if (position < 1)
            position = 0;
        if (position >= this.current.durationMS)
            return this.skip();
        await this.play(this.current, {
            immediate: true,
            filtersUpdate: true,
            seek: position
        });
        return true;
    }
    /**
     * Plays previous track
     * @returns {Promise<void>}
     */
    async back() {
        if (tslib_1.__classPrivateFieldGet(this, _Queue_instances, "m", _Queue_watchDestroyed).call(this))
            return;
        const prev = this.previousTracks[this.previousTracks.length - 2]; // because last item is the current track
        if (!prev)
            throw new PlayerError_1.PlayerError("Could not find previous track", PlayerError_1.ErrorStatusCode.TRACK_NOT_FOUND);
        return await this.play(prev, { immediate: true });
    }
    /**
     * Clear this queue
     */
    clear() {
        if (tslib_1.__classPrivateFieldGet(this, _Queue_instances, "m", _Queue_watchDestroyed).call(this))
            return;
        this.tracks = [];
        this.previousTracks = [];
    }
    /**
     * Stops the player
     * @returns {void}
     */
    stop() {
        if (tslib_1.__classPrivateFieldGet(this, _Queue_instances, "m", _Queue_watchDestroyed).call(this))
            return;
        return this.destroy();
    }
    /**
     * Shuffles this queue
     * @returns {boolean}
     */
    shuffle() {
        if (tslib_1.__classPrivateFieldGet(this, _Queue_instances, "m", _Queue_watchDestroyed).call(this))
            return;
        if (!this.tracks.length || this.tracks.length < 2)
            return false;
        for (let i = this.tracks.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.tracks[i], this.tracks[j]] = [this.tracks[j], this.tracks[i]];
        }
        return true;
    }
    /**
     * Removes a track from the queue
     * @param {Track|string|number} track The track to remove
     * @returns {Track}
     */
    remove(track) {
        if (tslib_1.__classPrivateFieldGet(this, _Queue_instances, "m", _Queue_watchDestroyed).call(this))
            return;
        let trackFound = null;
        if (typeof track === "number") {
            trackFound = this.tracks[track];
            if (trackFound) {
                this.tracks = this.tracks.filter((t) => t.id !== trackFound.id);
            }
        }
        else {
            trackFound = this.tracks.find((s) => s.id === (track instanceof Track_1.default ? track.id : track));
            if (trackFound) {
                this.tracks = this.tracks.filter((s) => s.id !== trackFound.id);
            }
        }
        return trackFound;
    }
    /**
     * Returns the index of the specified track. If found, returns the track index else returns -1.
     * @param {number|Track|string} track The track
     * @returns {number}
     */
    getTrackPosition(track) {
        if (tslib_1.__classPrivateFieldGet(this, _Queue_instances, "m", _Queue_watchDestroyed).call(this))
            return;
        if (typeof track === "number")
            return this.tracks[track] != null ? track : -1;
        return this.tracks.findIndex((pred) => pred.id === (track instanceof Track_1.default ? track.id : track));
    }
    /**
     * Jumps to particular track
     * @param {Track|number} track The track
     * @returns {void}
     */
    jump(track) {
        if (tslib_1.__classPrivateFieldGet(this, _Queue_instances, "m", _Queue_watchDestroyed).call(this))
            return;
        const foundTrack = this.remove(track);
        if (!foundTrack)
            throw new PlayerError_1.PlayerError("Track not found", PlayerError_1.ErrorStatusCode.TRACK_NOT_FOUND);
        this.tracks.splice(0, 0, foundTrack);
        return void this.skip();
    }
    /**
     * Jumps to particular track, removing other tracks on the way
     * @param {Track|number} track The track
     * @returns {void}
     */
    skipTo(track) {
        if (tslib_1.__classPrivateFieldGet(this, _Queue_instances, "m", _Queue_watchDestroyed).call(this))
            return;
        const trackIndex = this.getTrackPosition(track);
        const removedTrack = this.remove(track);
        if (!removedTrack)
            throw new PlayerError_1.PlayerError("Track not found", PlayerError_1.ErrorStatusCode.TRACK_NOT_FOUND);
        this.tracks.splice(0, trackIndex, removedTrack);
        return void this.skip();
    }
    /**
     * Inserts the given track to specified index
     * @param {Track} track The track to insert
     * @param {number} [index=0] The index where this track should be
     */
    insert(track, index = 0) {
        if (tslib_1.__classPrivateFieldGet(this, _Queue_instances, "m", _Queue_watchDestroyed).call(this))
            return;
        if (!track || !(track instanceof Track_1.default))
            throw new PlayerError_1.PlayerError("track must be the instance of Track", PlayerError_1.ErrorStatusCode.INVALID_TRACK);
        if (typeof index !== "number" || index < 0 || !Number.isFinite(index))
            throw new PlayerError_1.PlayerError(`Invalid index "${index}"`, PlayerError_1.ErrorStatusCode.INVALID_ARG_TYPE);
        this.tracks.splice(index, 0, track);
        this.player.emit("trackAdd", this, track);
    }
    /**
     * @typedef {object} PlayerTimestamp
     * @property {string} current The current progress
     * @property {string} end The total time
     * @property {number} progress Progress in %
     */
    /**
     * Returns player stream timestamp
     * @returns {PlayerTimestamp}
     */
    getPlayerTimestamp() {
        if (tslib_1.__classPrivateFieldGet(this, _Queue_instances, "m", _Queue_watchDestroyed).call(this))
            return;
        const currentStreamTime = this.streamTime;
        const totalTime = this.current.durationMS;
        const currentTimecode = Util_1.Util.buildTimeCode(Util_1.Util.parseMS(currentStreamTime));
        const endTimecode = Util_1.Util.buildTimeCode(Util_1.Util.parseMS(totalTime));
        return {
            current: currentTimecode,
            end: endTimecode,
            progress: Math.round((currentStreamTime / totalTime) * 100)
        };
    }
    /**
     * Creates progress bar string
     * @param {PlayerProgressbarOptions} options The progress bar options
     * @returns {string}
     */
    createProgressBar(options = { timecodes: true }) {
        if (tslib_1.__classPrivateFieldGet(this, _Queue_instances, "m", _Queue_watchDestroyed).call(this))
            return;
        const length = typeof options.length === "number" ? (options.length <= 0 || options.length === Infinity ? 15 : options.length) : 15;
        const index = Math.round((this.streamTime / this.current.durationMS) * length);
        const indicator = typeof options.indicator === "string" && options.indicator.length > 0 ? options.indicator : "🔘";
        const line = typeof options.line === "string" && options.line.length > 0 ? options.line : "▬";
        if (index >= 1 && index <= length) {
            const bar = line.repeat(length - 1).split("");
            bar.splice(index, 0, indicator);
            if (options.timecodes) {
                const timestamp = this.getPlayerTimestamp();
                return `${timestamp.current} ┃ ${bar.join("")} ┃ ${timestamp.end}`;
            }
            else {
                return `${bar.join("")}`;
            }
        }
        else {
            if (options.timecodes) {
                const timestamp = this.getPlayerTimestamp();
                return `${timestamp.current} ┃ ${indicator}${line.repeat(length - 1)} ┃ ${timestamp.end}`;
            }
            else {
                return `${indicator}${line.repeat(length - 1)}`;
            }
        }
    }
    /**
     * Total duration
     * @type {Number}
     */
    get totalTime() {
        if (tslib_1.__classPrivateFieldGet(this, _Queue_instances, "m", _Queue_watchDestroyed).call(this))
            return;
        return this.tracks.length > 0 ? this.tracks.map((t) => t.durationMS).reduce((p, c) => p + c) : 0;
    }
    /**
     * Play stream in a voice/stage channel
     * @param {Track} [src] The track to play (if empty, uses first track from the queue)
     * @param {PlayOptions} [options] The options
     * @returns {Promise<void>}
     */
    async play(src, options = {}) {
        if (tslib_1.__classPrivateFieldGet(this, _Queue_instances, "m", _Queue_watchDestroyed).call(this, false))
            return;
        if (!this.connection || !this.connection.voiceConnection)
            throw new PlayerError_1.PlayerError("Voice connection is not available, use <Queue>.connect()!", PlayerError_1.ErrorStatusCode.NO_CONNECTION);
        if (src && (this.playing || this.tracks.length) && !options.immediate)
            return this.addTrack(src);
        const track = options.filtersUpdate && !options.immediate ? src || this.current : src ?? this.tracks.shift();
        if (!track)
            return;
        this.player.emit("debug", this, "Received play request");
        if (!options.filtersUpdate) {
            this.previousTracks = this.previousTracks.filter((x) => x.id !== track.id);
            this.previousTracks.push(track);
        }
        let stream = null;
        const hasCustomDownloader = typeof this.onBeforeCreateStream === "function";
        if (["youtube", "spotify"].includes(track.raw.source)) {
            let spotifyResolved = false;
            if (this.options.spotifyBridge && track.raw.source === "spotify" && !track.raw.engine) {
                track.raw.engine = await youtube_sr_1.default.search(`${track.author} ${track.title}`, { type: "video" })
                    .then((res) => res[0].url)
                    .catch(() => null);
                spotifyResolved = true;
            }
            const url = track.raw.source === "spotify" ? track.raw.engine : track.url;
            if (!url)
                return void this.play(this.tracks.shift(), { immediate: true });
            if (hasCustomDownloader) {
                stream = (await this.onBeforeCreateStream(track, spotifyResolved ? "youtube" : track.raw.source, this)) || null;
            }
            if (!stream) {
                stream = (0, ytdl_core_1.default)(url, this.options.ytdlOptions);
            }
        }
        else {
            const arbitraryStream = (hasCustomDownloader && (await this.onBeforeCreateStream(track, track.raw.source || track.raw.engine, this))) || null;
            stream =
                arbitraryStream || (track.raw.source === "soundcloud" && typeof track.raw.engine?.downloadProgressive === "function")
                    ? await track.raw.engine.downloadProgressive()
                    : typeof track.raw.engine === "function"
                        ? await track.raw.engine()
                        : track.raw.engine;
        }
        const ffmpegStream = (0, FFmpegStream_1.createFFmpegStream)(stream, {
            encoderArgs: options.encoderArgs || this._activeFilters.length ? ["-af", AudioFilters_1.default.create(this._activeFilters)] : [],
            seek: options.seek ? options.seek / 1000 : 0,
            fmt: "s16le"
        }).on("error", (err) => {
            if (!`${err}`.toLowerCase().includes("premature close"))
                this.player.emit("error", this, err);
        });
        const resource = this.connection.createStream(ffmpegStream, {
            type: voice_1.StreamType.Raw,
            data: track,
            disableVolume: Boolean(this.options.disableVolume)
        });
        if (options.seek)
            this._streamTime = options.seek;
        this._filtersUpdate = options.filtersUpdate;
        const volumeTransformer = resource.volume;
        if (volumeTransformer && typeof this.options.initialVolume === "number")
            Reflect.set(volumeTransformer, "volume", Math.pow(this.options.initialVolume / 100, 1.660964));
        if (volumeTransformer?.hasSmoothness && typeof this.options.volumeSmoothness === "number") {
            if (typeof volumeTransformer.setSmoothness === "function")
                volumeTransformer.setSmoothness(this.options.volumeSmoothness || 0);
        }
        setTimeout(() => {
            this.connection.playStream(resource);
        }, tslib_1.__classPrivateFieldGet(this, _Queue_instances, "m", _Queue_getBufferingTimeout).call(this)).unref();
    }
    /**
     * Private method to handle autoplay
     * @param {Track} track The source track to find its similar track for autoplay
     * @returns {Promise<void>}
     * @private
     */
    async _handleAutoplay(track) {
        if (tslib_1.__classPrivateFieldGet(this, _Queue_instances, "m", _Queue_watchDestroyed).call(this))
            return;
        if (!track || ![track.source, track.raw?.source].includes("youtube")) {
            if (this.options.leaveOnEnd)
                this.destroy();
            return void this.player.emit("queueEnd", this);
        }
        let info = await youtube_sr_1.default.getVideo(track.url)
            .then((x) => x.videos[0])
            .catch(Util_1.Util.noop);
        // fallback
        if (!info)
            info = await youtube_sr_1.default.search(track.author)
                .then((x) => x[0])
                .catch(Util_1.Util.noop);
        if (!info) {
            if (this.options.leaveOnEnd)
                this.destroy();
            return void this.player.emit("queueEnd", this);
        }
        const nextTrack = new Track_1.default(this.player, {
            title: info.title,
            url: `https://www.youtube.com/watch?v=${info.id}`,
            duration: info.durationFormatted ? Util_1.Util.buildTimeCode(Util_1.Util.parseMS(info.duration * 1000)) : "0:00",
            description: "",
            thumbnail: typeof info.thumbnail === "string" ? info.thumbnail : info.thumbnail.url,
            views: info.views,
            author: info.channel.name,
            requestedBy: track.requestedBy,
            source: "youtube"
        });
        this.play(nextTrack, { immediate: true });
    }
    *[(_Queue_lastVolume = new WeakMap(), _Queue_destroyed = new WeakMap(), _Queue_instances = new WeakSet(), Symbol.iterator)]() {
        if (tslib_1.__classPrivateFieldGet(this, _Queue_instances, "m", _Queue_watchDestroyed).call(this))
            return;
        yield* this.tracks;
    }
    /**
     * JSON representation of this queue
     * @returns {object}
     */
    toJSON() {
        if (tslib_1.__classPrivateFieldGet(this, _Queue_instances, "m", _Queue_watchDestroyed).call(this))
            return;
        return {
            id: this.id,
            guild: this.guild.id,
            voiceChannel: this.connection?.channel?.id,
            options: this.options,
            tracks: this.tracks.map((m) => m.toJSON())
        };
    }
    /**
     * String representation of this queue
     * @returns {string}
     */
    toString() {
        if (tslib_1.__classPrivateFieldGet(this, _Queue_instances, "m", _Queue_watchDestroyed).call(this))
            return;
        if (!this.tracks.length)
            return "No songs available to display!";
        return `**Upcoming Songs:**\n${this.tracks.map((m, i) => `${i + 1}. **${m.title}**`).join("\n")}`;
    }
}
exports.Queue = Queue;
_Queue_watchDestroyed = function _Queue_watchDestroyed(emit = true) {
    if (tslib_1.__classPrivateFieldGet(this, _Queue_destroyed, "f")) {
        if (emit)
            this.player.emit("error", this, new PlayerError_1.PlayerError("Cannot use destroyed queue", PlayerError_1.ErrorStatusCode.DESTROYED_QUEUE));
        return true;
    }
    return false;
}, _Queue_getBufferingTimeout = function _Queue_getBufferingTimeout() {
    const timeout = this.options.bufferingTimeout;
    if (isNaN(timeout) || timeout < 0 || !Number.isFinite(timeout))
        return 1000;
    return timeout;
};
