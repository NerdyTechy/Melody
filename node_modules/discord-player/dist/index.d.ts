/// <reference types="node" />
import { User, VoiceChannel, StageChannel, Collection, Snowflake, Client, GuildResolvable, Guild, GuildChannelResolvable, UserResolvable } from 'discord.js';
import { Readable, Duplex } from 'stream';
import { TypedEmitter } from 'tiny-typed-emitter';
import { AudioPlayerError, AudioResource, VoiceConnection, AudioPlayer, StreamType, AudioPlayerStatus } from '@discordjs/voice';
import { downloadOptions } from 'ytdl-core';

declare class Playlist {
    readonly player: Player;
    tracks: Track[];
    title: string;
    description: string;
    thumbnail: string;
    type: "album" | "playlist";
    source: TrackSource;
    author: {
        name: string;
        url: string;
    };
    id: string;
    url: string;
    readonly rawPlaylist?: any;
    /**
     * Playlist constructor
     * @param {Player} player The player
     * @param {PlaylistInitData} data The data
     */
    constructor(player: Player, data: PlaylistInitData);
    [Symbol.iterator](): Generator<Track, void, undefined>;
    /**
     * JSON representation of this playlist
     * @param {boolean} [withTracks=true] If it should build json with tracks
     * @returns {PlaylistJSON}
     */
    toJSON(withTracks?: boolean): PlaylistJSON;
}

declare class Track {
    player: Player;
    title: string;
    description: string;
    author: string;
    url: string;
    thumbnail: string;
    duration: string;
    views: number;
    requestedBy: User;
    playlist?: Playlist;
    readonly raw: RawTrackData;
    readonly id: string;
    /**
     * Track constructor
     * @param {Player} player The player that instantiated this Track
     * @param {RawTrackData} data Track data
     */
    constructor(player: Player, data: RawTrackData);
    private _patch;
    /**
     * The queue in which this track is located
     * @type {Queue}
     */
    get queue(): Queue;
    /**
     * The track duration in millisecond
     * @type {number}
     */
    get durationMS(): number;
    /**
     * Returns source of this track
     * @type {TrackSource}
     */
    get source(): TrackSource;
    /**
     * String representation of this track
     * @returns {string}
     */
    toString(): string;
    /**
     * Raw JSON representation of this track
     * @returns {TrackJSON}
     */
    toJSON(hidePlaylist?: boolean): TrackJSON;
}

interface VoiceEvents {
    error: (error: AudioPlayerError) => any;
    debug: (message: string) => any;
    start: (resource: AudioResource<Track>) => any;
    finish: (resource: AudioResource<Track>) => any;
}
declare class StreamDispatcher extends TypedEmitter<VoiceEvents> {
    readonly connectionTimeout: number;
    readonly voiceConnection: VoiceConnection;
    readonly audioPlayer: AudioPlayer;
    channel: VoiceChannel | StageChannel;
    audioResource?: AudioResource<Track>;
    private readyLock;
    paused: boolean;
    /**
     * Creates new connection object
     * @param {VoiceConnection} connection The connection
     * @param {VoiceChannel|StageChannel} channel The connected channel
     * @private
     */
    constructor(connection: VoiceConnection, channel: VoiceChannel | StageChannel, connectionTimeout?: number);
    /**
     * Creates stream
     * @param {Readable|Duplex|string} src The stream source
     * @param {object} [ops] Options
     * @returns {AudioResource}
     */
    createStream(src: Readable | Duplex | string, ops?: {
        type?: StreamType;
        data?: any;
        disableVolume?: boolean;
    }): AudioResource<Track>;
    /**
     * The player status
     * @type {AudioPlayerStatus}
     */
    get status(): AudioPlayerStatus;
    /**
     * Disconnects from voice
     * @returns {void}
     */
    disconnect(): void;
    /**
     * Stops the player
     * @returns {void}
     */
    end(): void;
    /**
     * Pauses the stream playback
     * @param {boolean} [interpolateSilence=false] If true, the player will play 5 packets of silence after pausing to prevent audio glitches.
     * @returns {boolean}
     */
    pause(interpolateSilence?: boolean): boolean;
    /**
     * Resumes the stream playback
     * @returns {boolean}
     */
    resume(): boolean;
    /**
     * Play stream
     * @param {AudioResource<Track>} [resource=this.audioResource] The audio resource to play
     * @returns {Promise<StreamDispatcher>}
     */
    playStream(resource?: AudioResource<Track>): Promise<this>;
    /**
     * Sets playback volume
     * @param {number} value The volume amount
     * @returns {boolean}
     */
    setVolume(value: number): boolean;
    /**
     * The current volume
     * @type {number}
     */
    get volume(): number;
    /**
     * The playback time
     * @type {number}
     */
    get streamTime(): number;
}

declare class VoiceUtils {
    cache: Collection<Snowflake, StreamDispatcher>;
    /**
     * The voice utils
     * @private
     */
    constructor();
    /**
     * Joins a voice channel, creating basic stream dispatch manager
     * @param {StageChannel|VoiceChannel} channel The voice channel
     * @param {object} [options] Join options
     * @returns {Promise<StreamDispatcher>}
     */
    connect(channel: VoiceChannel | StageChannel, options?: {
        deaf?: boolean;
        maxTime?: number;
    }): Promise<StreamDispatcher>;
    /**
     * Joins a voice channel
     * @param {StageChannel|VoiceChannel} [channel] The voice/stage channel to join
     * @param {object} [options] Join options
     * @returns {VoiceConnection}
     */
    join(channel: VoiceChannel | StageChannel, options?: {
        deaf?: boolean;
        maxTime?: number;
    }): Promise<VoiceConnection>;
    /**
     * Disconnects voice connection
     * @param {VoiceConnection} connection The voice connection
     * @returns {void}
     */
    disconnect(connection: VoiceConnection | StreamDispatcher): void;
    /**
     * Returns Discord Player voice connection
     * @param {Snowflake} guild The guild id
     * @returns {StreamDispatcher}
     */
    getConnection(guild: Snowflake): StreamDispatcher;
}

declare class ExtractorModel {
    name: string;
    private _raw;
    /**
     * Model for raw Discord Player extractors
     * @param {string} extractorName Name of the extractor
     * @param {object} data Extractor object
     */
    constructor(extractorName: string, data: any);
    /**
     * Method to handle requests from `Player.play()`
     * @param {string} query Query to handle
     * @returns {Promise<ExtractorModelData>}
     */
    handle(query: string): Promise<ExtractorModelData>;
    /**
     * Method used by Discord Player to validate query with this extractor
     * @param {string} query The query to validate
     * @returns {boolean}
     */
    validate(query: string): boolean;
    /**
     * The extractor version
     * @type {string}
     */
    get version(): string;
}

declare class Player extends TypedEmitter<PlayerEvents> {
    readonly client: Client;
    readonly options: PlayerInitOptions;
    readonly queues: Collection<string, Queue<unknown>>;
    readonly voiceUtils: VoiceUtils;
    readonly extractors: Collection<string, ExtractorModel>;
    requiredEvents: string[];
    /**
     * Creates new Discord Player
     * @param {Client} client The Discord Client
     * @param {PlayerInitOptions} [options] The player init options
     */
    constructor(client: Client, options?: PlayerInitOptions);
    /**
     * Handles voice state update
     * @param {VoiceState} oldState The old voice state
     * @param {VoiceState} newState The new voice state
     * @returns {void}
     * @private
     */
    private _handleVoiceState;
    /**
     * Creates a queue for a guild if not available, else returns existing queue
     * @param {GuildResolvable} guild The guild
     * @param {PlayerOptions} queueInitOptions Queue init options
     * @returns {Queue}
     */
    createQueue<T = unknown>(guild: GuildResolvable, queueInitOptions?: PlayerOptions & {
        metadata?: T;
    }): Queue<T>;
    /**
     * Returns the queue if available
     * @param {GuildResolvable} guild The guild id
     * @returns {Queue}
     */
    getQueue<T = unknown>(guild: GuildResolvable): Queue<T>;
    /**
     * Deletes a queue and returns deleted queue object
     * @param {GuildResolvable} guild The guild id to remove
     * @returns {Queue}
     */
    deleteQueue<T = unknown>(guild: GuildResolvable): Queue<T>;
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
    search(query: string | Track, options: SearchOptions): Promise<PlayerSearchResult>;
    /**
     * Registers extractor
     * @param {string} extractorName The extractor name
     * @param {ExtractorModel|any} extractor The extractor object
     * @param {boolean} [force=false] Overwrite existing extractor with this name (if available)
     * @returns {ExtractorModel}
     */
    use(extractorName: string, extractor: ExtractorModel | any, force?: boolean): ExtractorModel;
    /**
     * Removes registered extractor
     * @param {string} extractorName The extractor name
     * @returns {ExtractorModel}
     */
    unuse(extractorName: string): ExtractorModel;
    /**
     * Generates a report of the dependencies used by the `@discordjs/voice` module. Useful for debugging.
     * @returns {string}
     */
    scanDeps(): string;
    emit<U extends keyof PlayerEvents>(eventName: U, ...args: Parameters<PlayerEvents[U]>): boolean;
    /**
     * Resolves queue
     * @param {GuildResolvable|Queue} queueLike Queue like object
     * @returns {Queue}
     */
    resolveQueue<T>(queueLike: GuildResolvable | Queue): Queue<T>;
    [Symbol.iterator](): Generator<Queue<unknown>, void, undefined>;
    /**
     * Creates `Playlist` instance
     * @param data The data to initialize a playlist
     */
    createPlaylist(data: PlaylistInitData): Playlist;
}

declare class Queue<T = unknown> {
    #private;
    readonly guild: Guild;
    readonly player: Player;
    connection: StreamDispatcher;
    tracks: Track[];
    previousTracks: Track[];
    options: PlayerOptions;
    playing: boolean;
    metadata?: T;
    repeatMode: QueueRepeatMode;
    readonly id: string;
    private _streamTime;
    _cooldownsTimeout: Collection<string, NodeJS.Timeout>;
    private _activeFilters;
    private _filtersUpdate;
    onBeforeCreateStream: (track: Track, source: TrackSource, queue: Queue) => Promise<Readable | undefined>;
    /**
     * Queue constructor
     * @param {Player} player The player that instantiated this queue
     * @param {Guild} guild The guild that instantiated this queue
     * @param {PlayerOptions} [options] Player options for the queue
     */
    constructor(player: Player, guild: Guild, options?: PlayerOptions);
    /**
     * Returns current track
     * @type {Track}
     */
    get current(): Track;
    /**
     * If this queue is destroyed
     * @type {boolean}
     */
    get destroyed(): boolean;
    /**
     * Returns current track
     * @returns {Track}
     */
    nowPlaying(): Track;
    /**
     * Connects to a voice channel
     * @param {GuildChannelResolvable} channel The voice/stage channel
     * @returns {Promise<Queue>}
     */
    connect(channel: GuildChannelResolvable): Promise<this>;
    /**
     * Destroys this queue
     * @param {boolean} [disconnect=this.options.leaveOnStop] If it should leave on destroy
     * @returns {void}
     */
    destroy(disconnect?: boolean): void;
    /**
     * Skips current track
     * @returns {boolean}
     */
    skip(): boolean;
    /**
     * Adds single track to the queue
     * @param {Track} track The track to add
     * @returns {void}
     */
    addTrack(track: Track): void;
    /**
     * Adds multiple tracks to the queue
     * @param {Track[]} tracks Array of tracks to add
     */
    addTracks(tracks: Track[]): void;
    /**
     * Sets paused state
     * @param {boolean} paused The paused state
     * @returns {boolean}
     */
    setPaused(paused?: boolean): boolean;
    /**
     * Sets bitrate
     * @param  {number|auto} bitrate bitrate to set
     * @returns {void}
     */
    setBitrate(bitrate: number | "auto"): void;
    /**
     * Sets volume
     * @param {number} amount The volume amount
     * @returns {boolean}
     */
    setVolume(amount: number): boolean;
    /**
     * Sets repeat mode
     * @param  {QueueRepeatMode} mode The repeat mode
     * @returns {boolean}
     */
    setRepeatMode(mode: QueueRepeatMode): boolean;
    /**
     * The current volume amount
     * @type {number}
     */
    get volume(): number;
    set volume(amount: number);
    /**
     * The stream time of this queue
     * @type {number}
     */
    get streamTime(): number;
    set streamTime(time: number);
    /**
     * Returns enabled filters
     * @returns {AudioFilters}
     */
    getFiltersEnabled(): (keyof QueueFilters)[];
    /**
     * Returns disabled filters
     * @returns {AudioFilters}
     */
    getFiltersDisabled(): (keyof QueueFilters)[];
    /**
     * Sets filters
     * @param {QueueFilters} filters Queue filters
     * @returns {Promise<void>}
     */
    setFilters(filters?: QueueFilters): Promise<void>;
    /**
     * Seeks to the given time
     * @param {number} position The position
     * @returns {boolean}
     */
    seek(position: number): Promise<boolean>;
    /**
     * Plays previous track
     * @returns {Promise<void>}
     */
    back(): Promise<void>;
    /**
     * Clear this queue
     */
    clear(): void;
    /**
     * Stops the player
     * @returns {void}
     */
    stop(): void;
    /**
     * Shuffles this queue
     * @returns {boolean}
     */
    shuffle(): boolean;
    /**
     * Removes a track from the queue
     * @param {Track|string|number} track The track to remove
     * @returns {Track}
     */
    remove(track: Track | string | number): Track;
    /**
     * Returns the index of the specified track. If found, returns the track index else returns -1.
     * @param {number|Track|string} track The track
     * @returns {number}
     */
    getTrackPosition(track: number | Track | string): number;
    /**
     * Jumps to particular track
     * @param {Track|number} track The track
     * @returns {void}
     */
    jump(track: Track | number): void;
    /**
     * Jumps to particular track, removing other tracks on the way
     * @param {Track|number} track The track
     * @returns {void}
     */
    skipTo(track: Track | number): void;
    /**
     * Inserts the given track to specified index
     * @param {Track} track The track to insert
     * @param {number} [index=0] The index where this track should be
     */
    insert(track: Track, index?: number): void;
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
    getPlayerTimestamp(): {
        current: string;
        end: string;
        progress: number;
    };
    /**
     * Creates progress bar string
     * @param {PlayerProgressbarOptions} options The progress bar options
     * @returns {string}
     */
    createProgressBar(options?: PlayerProgressbarOptions): string;
    /**
     * Total duration
     * @type {Number}
     */
    get totalTime(): number;
    /**
     * Play stream in a voice/stage channel
     * @param {Track} [src] The track to play (if empty, uses first track from the queue)
     * @param {PlayOptions} [options] The options
     * @returns {Promise<void>}
     */
    play(src?: Track, options?: PlayOptions): Promise<void>;
    /**
     * Private method to handle autoplay
     * @param {Track} track The source track to find its similar track for autoplay
     * @returns {Promise<void>}
     * @private
     */
    private _handleAutoplay;
    [Symbol.iterator](): Generator<Track, void, undefined>;
    /**
     * JSON representation of this queue
     * @returns {object}
     */
    toJSON(): {
        id: string;
        guild: string;
        voiceChannel: string;
        options: PlayerOptions;
        tracks: TrackJSON[];
    };
    /**
     * String representation of this queue
     * @returns {string}
     */
    toString(): string;
}

declare type FiltersName = keyof QueueFilters;
interface PlayerSearchResult {
    playlist: Playlist | null;
    tracks: Track[];
}
/**
 * @typedef {AudioFilters} QueueFilters
 */
interface QueueFilters {
    bassboost_low?: boolean;
    bassboost?: boolean;
    bassboost_high?: boolean;
    "8D"?: boolean;
    vaporwave?: boolean;
    nightcore?: boolean;
    phaser?: boolean;
    tremolo?: boolean;
    vibrato?: boolean;
    reverse?: boolean;
    treble?: boolean;
    normalizer?: boolean;
    normalizer2?: boolean;
    surrounding?: boolean;
    pulsator?: boolean;
    subboost?: boolean;
    karaoke?: boolean;
    flanger?: boolean;
    gate?: boolean;
    haas?: boolean;
    mcompand?: boolean;
    mono?: boolean;
    mstlr?: boolean;
    mstrr?: boolean;
    compressor?: boolean;
    expander?: boolean;
    softlimiter?: boolean;
    chorus?: boolean;
    chorus2d?: boolean;
    chorus3d?: boolean;
    fadein?: boolean;
    dim?: boolean;
    earrape?: boolean;
}
/**
 * The track source:
 * - soundcloud
 * - youtube
 * - spotify
 * - arbitrary
 * @typedef {string} TrackSource
 */
declare type TrackSource = "soundcloud" | "youtube" | "spotify" | "arbitrary";
/**
 * @typedef {object} RawTrackData
 * @property {string} title The title
 * @property {string} description The description
 * @property {string} author The author
 * @property {string} url The url
 * @property {string} thumbnail The thumbnail
 * @property {string} duration The duration
 * @property {number} views The views
 * @property {User} requestedBy The user who requested this track
 * @property {Playlist} [playlist] The playlist
 * @property {TrackSource} [source="arbitrary"] The source
 * @property {any} [engine] The engine
 * @property {boolean} [live] If this track is live
 * @property {any} [raw] The raw data
 */
interface RawTrackData {
    title: string;
    description: string;
    author: string;
    url: string;
    thumbnail: string;
    duration: string;
    views: number;
    requestedBy: User;
    playlist?: Playlist;
    source?: TrackSource;
    engine?: any;
    live?: boolean;
    raw?: any;
}
/**
 * @typedef {object} TimeData
 * @property {number} days Time in days
 * @property {number} hours Time in hours
 * @property {number} minutes Time in minutes
 * @property {number} seconds Time in seconds
 */
interface TimeData {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}
/**
 * @typedef {object} PlayerProgressbarOptions
 * @property {boolean} [timecodes] If it should render time codes
 * @property {boolean} [queue] If it should create progress bar for the whole queue
 * @property {number} [length] The bar length
 * @property {string} [line] The bar track
 * @property {string} [indicator] The indicator
 */
interface PlayerProgressbarOptions {
    timecodes?: boolean;
    length?: number;
    line?: string;
    indicator?: string;
    queue?: boolean;
}
/**
 * @typedef {object} PlayerOptions
 * @property {boolean} [leaveOnEnd=true] If it should leave on end
 * @property {boolean} [leaveOnStop=true] If it should leave on stop
 * @property {boolean} [leaveOnEmpty=true] If it should leave on empty
 * @property {number} [leaveOnEmptyCooldown=1000] The cooldown in ms
 * @property {boolean} [autoSelfDeaf=true] If it should set the bot in deaf mode
 * @property {YTDLDownloadOptions} [ytdlOptions] The youtube download options
 * @property {number} [initialVolume=100] The initial player volume
 * @property {number} [bufferingTimeout=3000] Buffering timeout for the stream
 * @property {boolean} [spotifyBridge=true] If player should bridge spotify source to youtube
 * @property {boolean} [disableVolume=false] If player should disable inline volume
 * @property {number} [volumeSmoothness=0] The volume transition smoothness between volume changes (lower the value to get better result)
 * Setting this or leaving this empty will disable this effect. Example: `volumeSmoothness: 0.1`
 * @property {Function} [onBeforeCreateStream] Runs before creating stream
 */
interface PlayerOptions {
    leaveOnEnd?: boolean;
    leaveOnStop?: boolean;
    leaveOnEmpty?: boolean;
    leaveOnEmptyCooldown?: number;
    autoSelfDeaf?: boolean;
    ytdlOptions?: downloadOptions;
    initialVolume?: number;
    bufferingTimeout?: number;
    spotifyBridge?: boolean;
    disableVolume?: boolean;
    volumeSmoothness?: number;
    onBeforeCreateStream?: (track: Track, source: TrackSource, queue: Queue) => Promise<Readable>;
}
/**
 * @typedef {object} ExtractorModelData
 * @property {object} [playlist] The playlist info (if any)
 * @property {string} [playlist.title] The playlist title
 * @property {string} [playlist.description] The playlist description
 * @property {string} [playlist.thumbnail] The playlist thumbnail
 * @property {album|playlist} [playlist.type] The playlist type: `album` | `playlist`
 * @property {TrackSource} [playlist.source] The playlist source
 * @property {object} [playlist.author] The playlist author
 * @property {string} [playlist.author.name] The author name
 * @property {string} [playlist.author.url] The author url
 * @property {string} [playlist.id] The playlist id
 * @property {string} [playlist.url] The playlist url
 * @property {any} [playlist.rawPlaylist] The raw data
 * @property {ExtractorData[]} data The data
 */
/**
 * @typedef {object} ExtractorData
 * @property {string} title The title
 * @property {number} duration The duration
 * @property {string} thumbnail The thumbnail
 * @property {string|Readable|Duplex} engine The stream engine
 * @property {number} views The views count
 * @property {string} author The author
 * @property {string} description The description
 * @property {string} url The url
 * @property {string} [version] The extractor version
 * @property {TrackSource} [source="arbitrary"] The source
 */
interface ExtractorModelData {
    playlist?: {
        title: string;
        description: string;
        thumbnail: string;
        type: "album" | "playlist";
        source: TrackSource;
        author: {
            name: string;
            url: string;
        };
        id: string;
        url: string;
        rawPlaylist?: any;
    };
    data: {
        title: string;
        duration: number;
        thumbnail: string;
        engine: string | Readable | Duplex;
        views: number;
        author: string;
        description: string;
        url: string;
        version?: string;
        source?: TrackSource;
    }[];
}
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
declare enum QueryType {
    AUTO = 0,
    YOUTUBE = 1,
    YOUTUBE_PLAYLIST = 2,
    SOUNDCLOUD_TRACK = 3,
    SOUNDCLOUD_PLAYLIST = 4,
    SOUNDCLOUD = 5,
    SPOTIFY_SONG = 6,
    SPOTIFY_ALBUM = 7,
    SPOTIFY_PLAYLIST = 8,
    FACEBOOK = 9,
    VIMEO = 10,
    ARBITRARY = 11,
    REVERBNATION = 12,
    YOUTUBE_SEARCH = 13,
    YOUTUBE_VIDEO = 14,
    SOUNDCLOUD_SEARCH = 15
}
/**
 * Emitted when bot gets disconnected from a voice channel
 * @event Player#botDisconnect
 * @param {Queue} queue The queue
 */
/**
 * Emitted when the voice channel is empty
 * @event Player#channelEmpty
 * @param {Queue} queue The queue
 */
/**
 * Emitted when bot connects to a voice channel
 * @event Player#connectionCreate
 * @param {Queue} queue The queue
 * @param {StreamDispatcher} connection The discord player connection object
 */
/**
 * Debug information
 * @event Player#debug
 * @param {Queue} queue The queue
 * @param {string} message The message
 */
/**
 * Emitted on error
 * <warn>This event should handled properly otherwise it may crash your process!</warn>
 * @event Player#error
 * @param {Queue} queue The queue
 * @param {Error} error The error
 */
/**
 * Emitted on connection error. Sometimes stream errors are emitted here as well.
 * @event Player#connectionError
 * @param {Queue} queue The queue
 * @param {Error} error The error
 */
/**
 * Emitted when queue ends
 * @event Player#queueEnd
 * @param {Queue} queue The queue
 */
/**
 * Emitted when a single track is added
 * @event Player#trackAdd
 * @param {Queue} queue The queue
 * @param {Track} track The track
 */
/**
 * Emitted when multiple tracks are added
 * @event Player#tracksAdd
 * @param {Queue} queue The queue
 * @param {Track[]} tracks The tracks
 */
/**
 * Emitted when a track starts playing
 * @event Player#trackStart
 * @param {Queue} queue The queue
 * @param {Track} track The track
 */
/**
 * Emitted when a track ends
 * @event Player#trackEnd
 * @param {Queue} queue The queue
 * @param {Track} track The track
 */
interface PlayerEvents {
    botDisconnect: (queue: Queue) => any;
    channelEmpty: (queue: Queue) => any;
    connectionCreate: (queue: Queue, connection: StreamDispatcher) => any;
    debug: (queue: Queue, message: string) => any;
    error: (queue: Queue, error: Error) => any;
    connectionError: (queue: Queue, error: Error) => any;
    queueEnd: (queue: Queue) => any;
    trackAdd: (queue: Queue, track: Track) => any;
    tracksAdd: (queue: Queue, track: Track[]) => any;
    trackStart: (queue: Queue, track: Track) => any;
    trackEnd: (queue: Queue, track: Track) => any;
}
/**
 * @typedef {object} PlayOptions
 * @property {boolean} [filtersUpdate=false] If this play was triggered for filters update
 * @property {string[]} [encoderArgs=[]] FFmpeg args passed to encoder
 * @property {number} [seek] Time to seek to before playing
 * @property {boolean} [immediate=false] If it should start playing the provided track immediately
 */
interface PlayOptions {
    filtersUpdate?: boolean;
    encoderArgs?: string[];
    seek?: number;
    immediate?: boolean;
}
/**
 * @typedef {object} SearchOptions
 * @property {UserResolvable} requestedBy The user who requested this search
 * @property {QueryType|string} [searchEngine=QueryType.AUTO] The query search engine, can be extractor name to target specific one (custom)
 * @property {boolean} [blockExtractor=false] If it should block custom extractors
 */
interface SearchOptions {
    requestedBy: UserResolvable;
    searchEngine?: QueryType | string;
    blockExtractor?: boolean;
}
/**
 * The queue repeat mode. This can be one of:
 * - OFF
 * - TRACK
 * - QUEUE
 * - AUTOPLAY
 * @typedef {number} QueueRepeatMode
 */
declare enum QueueRepeatMode {
    OFF = 0,
    TRACK = 1,
    QUEUE = 2,
    AUTOPLAY = 3
}
/**
 * @typedef {object} PlaylistInitData
 * @property {Track[]} tracks The tracks of this playlist
 * @property {string} title The playlist title
 * @property {string} description The description
 * @property {string} thumbnail The thumbnail
 * @property {album|playlist} type The playlist type: `album` | `playlist`
 * @property {TrackSource} source The playlist source
 * @property {object} author The playlist author
 * @property {string} [author.name] The author name
 * @property {string} [author.url] The author url
 * @property {string} id The playlist id
 * @property {string} url The playlist url
 * @property {any} [rawPlaylist] The raw playlist data
 */
interface PlaylistInitData {
    tracks: Track[];
    title: string;
    description: string;
    thumbnail: string;
    type: "album" | "playlist";
    source: TrackSource;
    author: {
        name: string;
        url: string;
    };
    id: string;
    url: string;
    rawPlaylist?: any;
}
/**
 * @typedef {object} TrackJSON
 * @property {string} title The track title
 * @property {string} description The track description
 * @property {string} author The author
 * @property {string} url The url
 * @property {string} thumbnail The thumbnail
 * @property {string} duration The duration
 * @property {number} durationMS The duration in ms
 * @property {number} views The views count
 * @property {Snowflake} requestedBy The id of the user who requested this track
 * @property {PlaylistJSON} [playlist] The playlist info (if any)
 */
interface TrackJSON {
    id: Snowflake;
    title: string;
    description: string;
    author: string;
    url: string;
    thumbnail: string;
    duration: string;
    durationMS: number;
    views: number;
    requestedBy: Snowflake;
    playlist?: PlaylistJSON;
}
/**
 * @typedef {object} PlaylistJSON
 * @property {string} id The playlist id
 * @property {string} url The playlist url
 * @property {string} title The playlist title
 * @property {string} description The playlist description
 * @property {string} thumbnail The thumbnail
 * @property {album|playlist} type The playlist type: `album` | `playlist`
 * @property {TrackSource} source The track source
 * @property {object} author The playlist author
 * @property {string} [author.name] The author name
 * @property {string} [author.url] The author url
 * @property {TrackJSON[]} tracks The tracks data (if any)
 */
interface PlaylistJSON {
    id: string;
    url: string;
    title: string;
    description: string;
    thumbnail: string;
    type: "album" | "playlist";
    source: TrackSource;
    author: {
        name: string;
        url: string;
    };
    tracks: TrackJSON[];
}
/**
 * @typedef {object} PlayerInitOptions
 * @property {boolean} [autoRegisterExtractor=true] If it should automatically register `@discord-player/extractor`
 * @property {YTDLDownloadOptions} [ytdlOptions] The options passed to `ytdl-core`
 * @property {number} [connectionTimeout=20000] The voice connection timeout
 */
interface PlayerInitOptions {
    autoRegisterExtractor?: boolean;
    ytdlOptions?: downloadOptions;
    connectionTimeout?: number;
}

declare class AudioFilters {
    constructor();
    static get filters(): Record<FiltersName, string>;
    static get<K extends FiltersName>(name: K): Record<keyof QueueFilters, string>[K];
    static has<K extends FiltersName>(name: K): boolean;
    static [Symbol.iterator](): IterableIterator<{
        name: FiltersName;
        value: string;
    }>;
    static get names(): (keyof QueueFilters)[];
    static get length(): number;
    static toString(): string;
    /**
     * Create ffmpeg args from the specified filters name
     * @param filter The filter name
     * @returns
     */
    static create<K extends FiltersName>(filters?: K[]): string;
    /**
     * Defines audio filter
     * @param filterName The name of the filter
     * @param value The ffmpeg args
     */
    static define(filterName: string, value: string): void;
    /**
     * Defines multiple audio filters
     * @param filtersArray Array of filters containing the filter name and ffmpeg args
     */
    static defineBulk(filtersArray: {
        name: string;
        value: string;
    }[]): void;
}

declare enum ErrorStatusCode {
    STREAM_ERROR = "StreamError",
    AUDIO_PLAYER_ERROR = "AudioPlayerError",
    PLAYER_ERROR = "PlayerError",
    NO_AUDIO_RESOURCE = "NoAudioResource",
    UNKNOWN_GUILD = "UnknownGuild",
    INVALID_ARG_TYPE = "InvalidArgType",
    UNKNOWN_EXTRACTOR = "UnknownExtractor",
    INVALID_EXTRACTOR = "InvalidExtractor",
    INVALID_CHANNEL_TYPE = "InvalidChannelType",
    INVALID_TRACK = "InvalidTrack",
    UNKNOWN_REPEAT_MODE = "UnknownRepeatMode",
    TRACK_NOT_FOUND = "TrackNotFound",
    NO_CONNECTION = "NoConnection",
    DESTROYED_QUEUE = "DestroyedQueue"
}
declare class PlayerError extends Error {
    message: string;
    statusCode: ErrorStatusCode;
    createdAt: Date;
    constructor(message: string, code?: ErrorStatusCode);
    get createdTimestamp(): number;
    valueOf(): ErrorStatusCode;
    toJSON(): {
        stack: string;
        code: ErrorStatusCode;
        message: string;
        created: number;
    };
    toString(): string;
}

declare class QueryResolver {
    /**
     * Query resolver
     */
    private constructor();
    /**
     * Resolves the given search query
     * @param {string} query The query
     * @returns {QueryType}
     */
    static resolve(query: string): QueryType;
    /**
     * Parses vimeo id from url
     * @param {string} query The query
     * @returns {string}
     */
    static getVimeoID(query: string): string;
}

declare class Util {
    /**
     * Utils
     */
    private constructor();
    /**
     * Creates duration string
     * @param {object} durObj The duration object
     * @returns {string}
     */
    static durationString(durObj: Record<string, number>): string;
    /**
     * Parses milliseconds to consumable time object
     * @param {number} milliseconds The time in ms
     * @returns {TimeData}
     */
    static parseMS(milliseconds: number): TimeData;
    /**
     * Builds time code
     * @param {TimeData} duration The duration object
     * @returns {string}
     */
    static buildTimeCode(duration: TimeData): string;
    /**
     * Picks last item of the given array
     * @param {any[]} arr The array
     * @returns {any}
     */
    static last<T = any>(arr: T[]): T;
    /**
     * Checks if the voice channel is empty
     * @param {VoiceChannel|StageChannel} channel The voice channel
     * @returns {boolean}
     */
    static isVoiceEmpty(channel: VoiceChannel | StageChannel): boolean;
    /**
     * Safer require
     * @param {string} id Node require id
     * @returns {any}
     */
    static require(id: string): any;
    /**
     * Asynchronous timeout
     * @param {number} time The time in ms to wait
     * @returns {Promise<unknown>}
     */
    static wait(time: number): Promise<unknown>;
    static noop(): void;
    static getFetch(): Promise<any>;
}

interface FFmpegStreamOptions {
    fmt?: string;
    encoderArgs?: string[];
    seek?: number;
    skip?: boolean;
}
declare function FFMPEG_ARGS_STRING(stream: string, fmt?: string): string[];
declare function FFMPEG_ARGS_PIPED(fmt?: string): string[];
/**
 * Creates FFmpeg stream
 * @param stream The source stream
 * @param options FFmpeg stream options
 */
declare function createFFmpegStream(stream: Readable | Duplex | string, options?: FFmpegStreamOptions): Readable | Duplex;

declare const version: string;

export { AudioFilters, ErrorStatusCode, ExtractorModel, ExtractorModelData, FFMPEG_ARGS_PIPED, FFMPEG_ARGS_STRING, FFmpegStreamOptions, FiltersName, PlayOptions, Player, PlayerError, PlayerEvents, PlayerInitOptions, PlayerOptions, PlayerProgressbarOptions, PlayerSearchResult, Playlist, PlaylistInitData, PlaylistJSON, QueryResolver, QueryType, Queue, QueueFilters, QueueRepeatMode, RawTrackData, SearchOptions, StreamDispatcher, TimeData, Track, TrackJSON, TrackSource, Util, VoiceEvents, VoiceUtils, createFFmpegStream, version };
