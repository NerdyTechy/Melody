"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const tiny_typed_emitter_1 = require("tiny-typed-emitter");
const Queue_1 = require("./Structures/Queue");
const VoiceUtils_1 = require("./VoiceInterface/VoiceUtils");
const types_1 = require("./types/types");
const Track_1 = tslib_1.__importDefault(require("./Structures/Track"));
const QueryResolver_1 = require("./utils/QueryResolver");
const youtube_sr_1 = tslib_1.__importDefault(require("youtube-sr"));
const Util_1 = require("./utils/Util");
const spotify_url_info_1 = tslib_1.__importDefault(require("spotify-url-info"));
const PlayerError_1 = require("./Structures/PlayerError");
const ytdl_core_1 = require("ytdl-core");
const soundcloud_scraper_1 = require("soundcloud-scraper");
const Playlist_1 = require("./Structures/Playlist");
const ExtractorModel_1 = require("./Structures/ExtractorModel");
const voice_1 = require("@discordjs/voice");
const soundcloud = new soundcloud_scraper_1.Client();
class Player extends tiny_typed_emitter_1.TypedEmitter {
    /**
     * Creates new Discord Player
     * @param {Client} client The Discord Client
     * @param {PlayerInitOptions} [options] The player init options
     */
    constructor(client, options = {}) {
        super();
        this.options = {
            autoRegisterExtractor: true,
            ytdlOptions: {
                highWaterMark: 1 << 25
            },
            connectionTimeout: 20000
        };
        this.queues = new discord_js_1.Collection();
        this.voiceUtils = new VoiceUtils_1.VoiceUtils();
        this.extractors = new discord_js_1.Collection();
        this.requiredEvents = ["error", "connectionError"];
        /**
         * The discord.js client
         * @type {Client}
         */
        this.client = client;
        if (this.client?.options?.intents && !new discord_js_1.IntentsBitField(this.client?.options?.intents).has(discord_js_1.IntentsBitField.Flags.GuildVoiceStates)) {
            throw new PlayerError_1.PlayerError('client is missing "GuildVoiceStates" intent');
        }
        /**
         * The extractors collection
         * @type {ExtractorModel}
         */
        this.options = Object.assign(this.options, options);
        this.client.on("voiceStateUpdate", this._handleVoiceState.bind(this));
        if (this.options?.autoRegisterExtractor) {
            let nv; // eslint-disable-line @typescript-eslint/no-explicit-any
            if ((nv = Util_1.Util.require("@discord-player/extractor"))) {
                ["Attachment", "Facebook", "Reverbnation", "Vimeo"].forEach((ext) => void this.use(ext, nv[ext]));
            }
        }
    }
    /**
     * Handles voice state update
     * @param {VoiceState} oldState The old voice state
     * @param {VoiceState} newState The new voice state
     * @returns {void}
     * @private
     */
    _handleVoiceState(oldState, newState) {
        const queue = this.getQueue(oldState.guild.id);
        if (!queue || !queue.connection)
            return;
        if (oldState.channelId && !newState.channelId && newState.member.id === newState.guild.members.me.id) {
            try {
                queue.destroy();
            }
            catch {
                /* noop */
            }
            return void this.emit("botDisconnect", queue);
        }
        if (!oldState.channelId && newState.channelId && newState.member.id === newState.guild.members.me.id) {
            if (!oldState.serverMute && newState.serverMute) {
                // state.serverMute can be null
                queue.setPaused(!!newState.serverMute);
            }
            else if (!oldState.suppress && newState.suppress) {
                // state.suppress can be null
                queue.setPaused(!!newState.suppress);
                if (newState.suppress) {
                    newState.guild.members.me.voice.setRequestToSpeak(true).catch(Util_1.Util.noop);
                }
            }
        }
        if (oldState.channelId === newState.channelId && newState.member.id === newState.guild.members.me.id) {
            if (!oldState.serverMute && newState.serverMute) {
                // state.serverMute can be null
                queue.setPaused(!!newState.serverMute);
            }
            else if (!oldState.suppress && newState.suppress) {
                // state.suppress can be null
                queue.setPaused(!!newState.suppress);
                if (newState.suppress) {
                    newState.guild.members.me.voice.setRequestToSpeak(true).catch(Util_1.Util.noop);
                }
            }
        }
        if (queue.connection && !newState.channelId && oldState.channelId === queue.connection.channel.id) {
            if (!Util_1.Util.isVoiceEmpty(queue.connection.channel))
                return;
            const timeout = setTimeout(() => {
                if (!Util_1.Util.isVoiceEmpty(queue.connection.channel))
                    return;
                if (!this.queues.has(queue.guild.id))
                    return;
                if (queue.options.leaveOnEmpty)
                    queue.destroy(true);
                this.emit("channelEmpty", queue);
            }, queue.options.leaveOnEmptyCooldown || 0).unref();
            queue._cooldownsTimeout.set(`empty_${oldState.guild.id}`, timeout);
        }
        if (queue.connection && newState.channelId && newState.channelId === queue.connection.channel.id) {
            const emptyTimeout = queue._cooldownsTimeout.get(`empty_${oldState.guild.id}`);
            const channelEmpty = Util_1.Util.isVoiceEmpty(queue.connection.channel);
            if (!channelEmpty && emptyTimeout) {
                clearTimeout(emptyTimeout);
                queue._cooldownsTimeout.delete(`empty_${oldState.guild.id}`);
            }
        }
        if (oldState.channelId && newState.channelId && oldState.channelId !== newState.channelId && newState.member.id === newState.guild.members.me.id) {
            if (queue.connection && newState.member.id === newState.guild.members.me.id)
                queue.connection.channel = newState.channel;
            const emptyTimeout = queue._cooldownsTimeout.get(`empty_${oldState.guild.id}`);
            const channelEmpty = Util_1.Util.isVoiceEmpty(queue.connection.channel);
            if (!channelEmpty && emptyTimeout) {
                clearTimeout(emptyTimeout);
                queue._cooldownsTimeout.delete(`empty_${oldState.guild.id}`);
            }
            else {
                const timeout = setTimeout(() => {
                    if (queue.connection && !Util_1.Util.isVoiceEmpty(queue.connection.channel))
                        return;
                    if (!this.queues.has(queue.guild.id))
                        return;
                    if (queue.options.leaveOnEmpty)
                        queue.destroy(true);
                    this.emit("channelEmpty", queue);
                }, queue.options.leaveOnEmptyCooldown || 0).unref();
                queue._cooldownsTimeout.set(`empty_${oldState.guild.id}`, timeout);
            }
        }
    }
    /**
     * Creates a queue for a guild if not available, else returns existing queue
     * @param {GuildResolvable} guild The guild
     * @param {PlayerOptions} queueInitOptions Queue init options
     * @returns {Queue}
     */
    createQueue(guild, queueInitOptions = {}) {
        guild = this.client.guilds.resolve(guild);
        if (!guild)
            throw new PlayerError_1.PlayerError("Unknown Guild", PlayerError_1.ErrorStatusCode.UNKNOWN_GUILD);
        if (this.queues.has(guild.id))
            return this.queues.get(guild.id);
        const _meta = queueInitOptions.metadata;
        delete queueInitOptions["metadata"];
        queueInitOptions.volumeSmoothness ?? (queueInitOptions.volumeSmoothness = 0.08);
        queueInitOptions.ytdlOptions ?? (queueInitOptions.ytdlOptions = this.options.ytdlOptions);
        const queue = new Queue_1.Queue(this, guild, queueInitOptions);
        queue.metadata = _meta;
        this.queues.set(guild.id, queue);
        return queue;
    }
    /**
     * Returns the queue if available
     * @param {GuildResolvable} guild The guild id
     * @returns {Queue}
     */
    getQueue(guild) {
        guild = this.client.guilds.resolve(guild);
        if (!guild)
            throw new PlayerError_1.PlayerError("Unknown Guild", PlayerError_1.ErrorStatusCode.UNKNOWN_GUILD);
        return this.queues.get(guild.id);
    }
    /**
     * Deletes a queue and returns deleted queue object
     * @param {GuildResolvable} guild The guild id to remove
     * @returns {Queue}
     */
    deleteQueue(guild) {
        guild = this.client.guilds.resolve(guild);
        if (!guild)
            throw new PlayerError_1.PlayerError("Unknown Guild", PlayerError_1.ErrorStatusCode.UNKNOWN_GUILD);
        const prev = this.getQueue(guild);
        try {
            prev.destroy();
        }
        catch { } // eslint-disable-line no-empty
        this.queues.delete(guild.id);
        return prev;
    }
    /**
     * @typedef {object} PlayerSearchResult
     * @property {Playlist} [playlist] The playlist (if any)
     * @property {Track[]} tracks The tracks
     */
    /**
     * Search tracks
     * @param {string|Track} query The search query
     * @param {SearchOptions} options The search options
     * @returns {Promise<PlayerSearchResult>}
     */
    async search(query, options) {
        if (query instanceof Track_1.default)
            return { playlist: query.playlist || null, tracks: [query] };
        if (!options)
            throw new PlayerError_1.PlayerError("DiscordPlayer#search needs search options!", PlayerError_1.ErrorStatusCode.INVALID_ARG_TYPE);
        options.requestedBy = this.client.users.resolve(options.requestedBy);
        if (!("searchEngine" in options))
            options.searchEngine = types_1.QueryType.AUTO;
        if (typeof options.searchEngine === "string" && this.extractors.has(options.searchEngine)) {
            const extractor = this.extractors.get(options.searchEngine);
            if (!extractor.validate(query))
                return { playlist: null, tracks: [] };
            const data = await extractor.handle(query);
            if (data && data.data.length) {
                const playlist = !data.playlist
                    ? null
                    : new Playlist_1.Playlist(this, {
                        ...data.playlist,
                        tracks: []
                    });
                const tracks = data.data.map((m) => new Track_1.default(this, {
                    ...m,
                    requestedBy: options.requestedBy,
                    duration: Util_1.Util.buildTimeCode(Util_1.Util.parseMS(m.duration)),
                    playlist: playlist
                }));
                if (playlist)
                    playlist.tracks = tracks;
                return { playlist: playlist, tracks: tracks };
            }
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const [_, extractor] of this.extractors) {
            if (options.blockExtractor)
                break;
            if (!extractor.validate(query))
                continue;
            const data = await extractor.handle(query);
            if (data && data.data.length) {
                const playlist = !data.playlist
                    ? null
                    : new Playlist_1.Playlist(this, {
                        ...data.playlist,
                        tracks: []
                    });
                const tracks = data.data.map((m) => new Track_1.default(this, {
                    ...m,
                    requestedBy: options.requestedBy,
                    duration: Util_1.Util.buildTimeCode(Util_1.Util.parseMS(m.duration)),
                    playlist: playlist
                }));
                if (playlist)
                    playlist.tracks = tracks;
                return { playlist: playlist, tracks: tracks };
            }
        }
        const qt = options.searchEngine === types_1.QueryType.AUTO ? QueryResolver_1.QueryResolver.resolve(query) : options.searchEngine;
        switch (qt) {
            case types_1.QueryType.YOUTUBE_VIDEO: {
                const info = await (0, ytdl_core_1.getInfo)(query, this.options.ytdlOptions).catch(Util_1.Util.noop);
                if (!info)
                    return { playlist: null, tracks: [] };
                const track = new Track_1.default(this, {
                    title: info.videoDetails.title,
                    description: info.videoDetails.description,
                    author: info.videoDetails.author?.name,
                    url: info.videoDetails.video_url,
                    requestedBy: options.requestedBy,
                    thumbnail: Util_1.Util.last(info.videoDetails.thumbnails)?.url,
                    views: parseInt(info.videoDetails.viewCount.replace(/[^0-9]/g, "")) || 0,
                    duration: Util_1.Util.buildTimeCode(Util_1.Util.parseMS(parseInt(info.videoDetails.lengthSeconds) * 1000)),
                    source: "youtube",
                    raw: info
                });
                return { playlist: null, tracks: [track] };
            }
            case types_1.QueryType.YOUTUBE_SEARCH: {
                const videos = await youtube_sr_1.default.search(query, {
                    type: "video"
                }).catch(Util_1.Util.noop);
                if (!videos)
                    return { playlist: null, tracks: [] };
                const tracks = videos.map((m) => {
                    m.source = "youtube"; // eslint-disable-line @typescript-eslint/no-explicit-any
                    return new Track_1.default(this, {
                        title: m.title,
                        description: m.description,
                        author: m.channel?.name,
                        url: m.url,
                        requestedBy: options.requestedBy,
                        thumbnail: m.thumbnail?.displayThumbnailURL("maxresdefault"),
                        views: m.views,
                        duration: m.durationFormatted,
                        source: "youtube",
                        raw: m
                    });
                });
                return { playlist: null, tracks };
            }
            case types_1.QueryType.SOUNDCLOUD_TRACK:
            case types_1.QueryType.SOUNDCLOUD_SEARCH: {
                const result = QueryResolver_1.QueryResolver.resolve(query) === types_1.QueryType.SOUNDCLOUD_TRACK ? [{ url: query }] : await soundcloud.search(query, "track").catch(() => []);
                if (!result || !result.length)
                    return { playlist: null, tracks: [] };
                const res = [];
                for (const r of result) {
                    const trackInfo = await soundcloud.getSongInfo(r.url).catch(Util_1.Util.noop);
                    if (!trackInfo)
                        continue;
                    const track = new Track_1.default(this, {
                        title: trackInfo.title,
                        url: trackInfo.url,
                        duration: Util_1.Util.buildTimeCode(Util_1.Util.parseMS(trackInfo.duration)),
                        description: trackInfo.description,
                        thumbnail: trackInfo.thumbnail,
                        views: trackInfo.playCount,
                        author: trackInfo.author.name,
                        requestedBy: options.requestedBy,
                        source: "soundcloud",
                        engine: trackInfo
                    });
                    res.push(track);
                }
                return { playlist: null, tracks: res };
            }
            case types_1.QueryType.SPOTIFY_SONG: {
                const spotifyData = await (0, spotify_url_info_1.default)(await Util_1.Util.getFetch())
                    .getData(query)
                    .catch(Util_1.Util.noop);
                if (!spotifyData)
                    return { playlist: null, tracks: [] };
                const spotifyTrack = new Track_1.default(this, {
                    title: spotifyData.name,
                    description: spotifyData.description ?? "",
                    author: spotifyData.artists[0]?.name ?? "Unknown Artist",
                    url: spotifyData.external_urls?.spotify ?? query,
                    thumbnail: spotifyData.album?.images[0]?.url ?? spotifyData.preview_url?.length
                        ? `https://i.scdn.co/image/${spotifyData.preview_url?.split("?cid=")[1]}`
                        : "https://www.scdn.co/i/_global/twitter_card-default.jpg",
                    duration: Util_1.Util.buildTimeCode(Util_1.Util.parseMS(spotifyData.duration_ms)),
                    views: 0,
                    requestedBy: options.requestedBy,
                    source: "spotify"
                });
                return { playlist: null, tracks: [spotifyTrack] };
            }
            case types_1.QueryType.SPOTIFY_PLAYLIST:
            case types_1.QueryType.SPOTIFY_ALBUM: {
                const spotifyPlaylist = await (0, spotify_url_info_1.default)(await Util_1.Util.getFetch())
                    .getData(query)
                    .catch(Util_1.Util.noop);
                if (!spotifyPlaylist)
                    return { playlist: null, tracks: [] };
                const playlist = new Playlist_1.Playlist(this, {
                    title: spotifyPlaylist.name ?? spotifyPlaylist.title,
                    description: spotifyPlaylist.description ?? "",
                    thumbnail: spotifyPlaylist.images[0]?.url ?? "https://www.scdn.co/i/_global/twitter_card-default.jpg",
                    type: spotifyPlaylist.type,
                    source: "spotify",
                    author: spotifyPlaylist.type !== "playlist"
                        ? {
                            name: spotifyPlaylist.artists[0]?.name ?? "Unknown Artist",
                            url: spotifyPlaylist.artists[0]?.external_urls?.spotify ?? null
                        }
                        : {
                            name: spotifyPlaylist.owner?.display_name ?? spotifyPlaylist.owner?.id ?? "Unknown Artist",
                            url: spotifyPlaylist.owner?.external_urls?.spotify ?? null
                        },
                    tracks: [],
                    id: spotifyPlaylist.id,
                    url: spotifyPlaylist.external_urls?.spotify ?? query,
                    rawPlaylist: spotifyPlaylist
                });
                if (spotifyPlaylist.type !== "playlist") {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    playlist.tracks = spotifyPlaylist.tracks.items.map((m) => {
                        const data = new Track_1.default(this, {
                            title: m.name ?? "",
                            description: m.description ?? "",
                            author: m.artists[0]?.name ?? "Unknown Artist",
                            url: m.external_urls?.spotify ?? query,
                            thumbnail: spotifyPlaylist.images[0]?.url ?? "https://www.scdn.co/i/_global/twitter_card-default.jpg",
                            duration: Util_1.Util.buildTimeCode(Util_1.Util.parseMS(m.duration_ms)),
                            views: 0,
                            requestedBy: options.requestedBy,
                            playlist,
                            source: "spotify"
                        });
                        return data;
                    });
                }
                else {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    playlist.tracks = spotifyPlaylist.tracks.items.map((m) => {
                        const data = new Track_1.default(this, {
                            title: m.track.name ?? "",
                            description: m.track.description ?? "",
                            author: m.track.artists?.[0]?.name ?? "Unknown Artist",
                            url: m.track.external_urls?.spotify ?? query,
                            thumbnail: m.track.album?.images?.[0]?.url ?? "https://www.scdn.co/i/_global/twitter_card-default.jpg",
                            duration: Util_1.Util.buildTimeCode(Util_1.Util.parseMS(m.track.duration_ms)),
                            views: 0,
                            requestedBy: options.requestedBy,
                            playlist,
                            source: "spotify"
                        });
                        return data;
                    });
                }
                return { playlist: playlist, tracks: playlist.tracks };
            }
            case types_1.QueryType.SOUNDCLOUD_PLAYLIST: {
                const data = await soundcloud.getPlaylist(query).catch(Util_1.Util.noop);
                if (!data)
                    return { playlist: null, tracks: [] };
                const res = new Playlist_1.Playlist(this, {
                    title: data.title,
                    description: data.description ?? "",
                    thumbnail: data.thumbnail ?? "https://soundcloud.com/pwa-icon-192.png",
                    type: "playlist",
                    source: "soundcloud",
                    author: {
                        name: data.author?.name ?? data.author?.username ?? "Unknown Artist",
                        url: data.author?.profile
                    },
                    tracks: [],
                    id: `${data.id}`,
                    url: data.url,
                    rawPlaylist: data
                });
                for (const song of data.tracks) {
                    const track = new Track_1.default(this, {
                        title: song.title,
                        description: song.description ?? "",
                        author: song.author?.username ?? song.author?.name ?? "Unknown Artist",
                        url: song.url,
                        thumbnail: song.thumbnail,
                        duration: Util_1.Util.buildTimeCode(Util_1.Util.parseMS(song.duration)),
                        views: song.playCount ?? 0,
                        requestedBy: options.requestedBy,
                        playlist: res,
                        source: "soundcloud",
                        engine: song
                    });
                    res.tracks.push(track);
                }
                return { playlist: res, tracks: res.tracks };
            }
            case types_1.QueryType.YOUTUBE_PLAYLIST: {
                const ytpl = await youtube_sr_1.default.getPlaylist(query).catch(Util_1.Util.noop);
                if (!ytpl)
                    return { playlist: null, tracks: [] };
                await ytpl.fetch().catch(Util_1.Util.noop);
                const playlist = new Playlist_1.Playlist(this, {
                    title: ytpl.title,
                    thumbnail: ytpl.thumbnail,
                    description: "",
                    type: "playlist",
                    source: "youtube",
                    author: {
                        name: ytpl.channel.name,
                        url: ytpl.channel.url
                    },
                    tracks: [],
                    id: ytpl.id,
                    url: ytpl.url,
                    rawPlaylist: ytpl
                });
                playlist.tracks = ytpl.videos.map((video) => new Track_1.default(this, {
                    title: video.title,
                    description: video.description,
                    author: video.channel?.name,
                    url: video.url,
                    requestedBy: options.requestedBy,
                    thumbnail: video.thumbnail.url,
                    views: video.views,
                    duration: video.durationFormatted,
                    raw: video,
                    playlist: playlist,
                    source: "youtube"
                }));
                return { playlist: playlist, tracks: playlist.tracks };
            }
            default:
                return { playlist: null, tracks: [] };
        }
    }
    /**
     * Registers extractor
     * @param {string} extractorName The extractor name
     * @param {ExtractorModel|any} extractor The extractor object
     * @param {boolean} [force=false] Overwrite existing extractor with this name (if available)
     * @returns {ExtractorModel}
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    use(extractorName, extractor, force = false) {
        if (!extractorName)
            throw new PlayerError_1.PlayerError("Cannot use unknown extractor!", PlayerError_1.ErrorStatusCode.UNKNOWN_EXTRACTOR);
        if (this.extractors.has(extractorName) && !force)
            return this.extractors.get(extractorName);
        if (extractor instanceof ExtractorModel_1.ExtractorModel) {
            this.extractors.set(extractorName, extractor);
            return extractor;
        }
        for (const method of ["validate", "getInfo"]) {
            if (typeof extractor[method] !== "function")
                throw new PlayerError_1.PlayerError("Invalid extractor data!", PlayerError_1.ErrorStatusCode.INVALID_EXTRACTOR);
        }
        const model = new ExtractorModel_1.ExtractorModel(extractorName, extractor);
        this.extractors.set(model.name, model);
        return model;
    }
    /**
     * Removes registered extractor
     * @param {string} extractorName The extractor name
     * @returns {ExtractorModel}
     */
    unuse(extractorName) {
        if (!this.extractors.has(extractorName))
            throw new PlayerError_1.PlayerError(`Cannot find extractor "${extractorName}"`, PlayerError_1.ErrorStatusCode.UNKNOWN_EXTRACTOR);
        const prev = this.extractors.get(extractorName);
        this.extractors.delete(extractorName);
        return prev;
    }
    /**
     * Generates a report of the dependencies used by the `@discordjs/voice` module. Useful for debugging.
     * @returns {string}
     */
    scanDeps() {
        const line = "-".repeat(50);
        const depsReport = (0, voice_1.generateDependencyReport)();
        const extractorReport = this.extractors
            .map((m) => {
            return `${m.name} :: ${m.version || "0.1.0"}`;
        })
            .join("\n");
        return `${depsReport}\n${line}\nLoaded Extractors:\n${extractorReport || "None"}`;
    }
    emit(eventName, ...args) {
        if (this.requiredEvents.includes(eventName) && !super.eventNames().includes(eventName)) {
            // eslint-disable-next-line no-console
            console.error(...args);
            process.emitWarning(`[DiscordPlayerWarning] Unhandled "${eventName}" event! Events ${this.requiredEvents.map((m) => `"${m}"`).join(", ")} must have event listeners!`);
            return false;
        }
        else {
            return super.emit(eventName, ...args);
        }
    }
    /**
     * Resolves queue
     * @param {GuildResolvable|Queue} queueLike Queue like object
     * @returns {Queue}
     */
    resolveQueue(queueLike) {
        return this.getQueue(queueLike instanceof Queue_1.Queue ? queueLike.guild : queueLike);
    }
    *[Symbol.iterator]() {
        yield* Array.from(this.queues.values());
    }
    /**
     * Creates `Playlist` instance
     * @param data The data to initialize a playlist
     */
    createPlaylist(data) {
        return new Playlist_1.Playlist(this, data);
    }
}
exports.Player = Player;
