"use strict";
// prism's volume transformer with smooth volume support
Object.defineProperty(exports, "__esModule", { value: true });
exports.VolumeTransformer = void 0;
const stream_1 = require("stream");
class VolumeTransformer extends stream_1.Transform {
    constructor(options = {}) {
        super(options);
        switch (options.type) {
            case "s16le":
                this._readInt = (buffer, index) => buffer.readInt16LE(index);
                this._writeInt = (buffer, int, index) => buffer.writeInt16LE(int, index);
                this._bits = 16;
                break;
            case "s16be":
                this._readInt = (buffer, index) => buffer.readInt16BE(index);
                this._writeInt = (buffer, int, index) => buffer.writeInt16BE(int, index);
                this._bits = 16;
                break;
            case "s32le":
                this._readInt = (buffer, index) => buffer.readInt32LE(index);
                this._writeInt = (buffer, int, index) => buffer.writeInt32LE(int, index);
                this._bits = 32;
                break;
            case "s32be":
                this._readInt = (buffer, index) => buffer.readInt32BE(index);
                this._writeInt = (buffer, int, index) => buffer.writeInt32BE(int, index);
                this._bits = 32;
                break;
            default:
                throw new Error("VolumeTransformer type should be one of s16le, s16be, s32le, s32be");
        }
        this.type = options.type;
        this._bytes = this._bits / 8;
        this._extremum = Math.pow(2, this._bits - 1);
        this.volume = Number.isNaN(options.volume) ? 1 : Number(options.volume);
        if (!Number.isFinite(this.volume))
            this.volume = 1;
        this._targetVolume = this.volume;
        this._chunk = Buffer.alloc(0);
        this._smoothing = options.smoothness || 0;
    }
    _readInt(buffer, index) {
        return index;
    }
    _writeInt(buffer, int, index) {
        return index;
    }
    _applySmoothness() {
        if (this.volume < this._targetVolume) {
            this.volume = this.volume + this._smoothing >= this._targetVolume ? this._targetVolume : this.volume + this._smoothing;
        }
        else if (this.volume > this._targetVolume) {
            this.volume = this.volume - this._smoothing <= this._targetVolume ? this._targetVolume : this.volume - this._smoothing;
        }
    }
    _transform(chunk, encoding, done) {
        if (this.smoothingEnabled() && this.volume !== this._targetVolume)
            this._applySmoothness();
        if (this.volume === 1) {
            this.push(chunk);
            return done();
        }
        const { _bytes, _extremum } = this;
        chunk = this._chunk = Buffer.concat([this._chunk, chunk]);
        if (chunk.length < _bytes)
            return done();
        const complete = Math.floor(chunk.length / _bytes) * _bytes;
        for (let i = 0; i < complete; i += _bytes) {
            const int = Math.min(_extremum - 1, Math.max(-_extremum, Math.floor(this.volume * this._readInt(chunk, i))));
            this._writeInt(chunk, int, i);
        }
        this._chunk = chunk.slice(complete);
        this.push(chunk.slice(0, complete));
        return done();
    }
    _destroy(err, cb) {
        super._destroy(err, cb);
        this._chunk = null;
    }
    setVolume(volume) {
        if (Number.isNaN(volume))
            volume = 1;
        if (typeof volume !== "number")
            volume = Number(volume);
        if (!Number.isFinite(volume))
            volume = volume < 0 ? 0 : 1;
        this._targetVolume = volume;
        if (this._smoothing <= 0)
            this.volume = volume;
    }
    setVolumeDecibels(db) {
        this.setVolume(Math.pow(10, db / 20));
    }
    setVolumeLogarithmic(value) {
        this.setVolume(Math.pow(value, 1.660964));
    }
    get volumeDecibels() {
        return Math.log10(this.volume) * 20;
    }
    get volumeLogarithmic() {
        return Math.pow(this.volume, 1 / 1.660964);
    }
    get smoothness() {
        return this._smoothing;
    }
    setSmoothness(smoothness) {
        this._smoothing = smoothness;
    }
    smoothingEnabled() {
        return Number.isFinite(this._smoothing) && this._smoothing > 0;
    }
    get hasSmoothness() {
        return true;
    }
    static get hasSmoothing() {
        return true;
    }
}
exports.VolumeTransformer = VolumeTransformer;
