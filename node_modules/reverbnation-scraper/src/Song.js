const Artist = require("./Artist");

class Song {

    constructor(data) {
        this._patch(data);
    }

    _patch(data) {
        this.title = data.name;
        this.id = data.id;
        this.image = data.image;
        this.thumbnail = data.thumbnail;
        this.duration = data.duration * 1000;
        this.bitrate = data.bitrate;
        this.lyrics = data.lyrics;
        this.streamURL = data.url;
        this.public = data.public;
        this.url = data.homepage_url;
        this.contextImage = data.context_image || null;
    }

    toString() {
        return this.title;
    }

}

module.exports = Song;