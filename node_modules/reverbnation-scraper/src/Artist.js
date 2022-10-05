class Artist {

    constructor(json) {
        this._patch(json);
    }

    _patch(json) {
        this.id = json.ARTIST.id;
        this.name = json.ARTIST.name;
        this.profile = `https:${json.ARTIST.homepage_url}`;
        this.type = json.ARTIST.type;
        this.avatar = `https:${json.ARTIST.image}`;
        this.thumbnail = `https:${json.ARTIST.thumbnail}`;
        this.bio = json.ARTIST.bio;
        this.genres = json.ARTIST.genres;
        this.location = json.ARTIST.location;
    }

    toString() {
        return this.name;
    }

}

module.exports = Artist;