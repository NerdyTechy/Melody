# ReverbnationScraper
Fetches song data from **[https://reverbnation.com](https://reverbnation.com)**.

# Examples

## Download audio

```js
const reverbnation = require("reverbnation-scraper");
const fs = require("fs");

(async () => {
    const stream = await reverbnation("https://www.reverbnation.com/alanwalkermusic/song/22564907-fade");
    stream.pipe(fs.createWriteStream("./Fade.mp3"));
})();
```

## Get basic info

```js
const reverbnation = require("reverbnation-scraper");

reverbnation.getInfo("https://www.reverbnation.com/alanwalkermusic/song/22564907-fade")
.then(console.log);

/*
{
  title: 'Fade',
  id: 22564907,
  image: 'https://gp1.wac.edgecastcdn.net/802892/http_public_production/artists/images/3711400/original/crop:x0y0w1920h1080/hash:1467485695/1419729364_awlogoblue.png?1467485695',
  thumbnail: 'https://gp1.wac.edgecastcdn.net/802892/http_public_production/artists/images/3711400/original/resize:64x48/crop:x370y63w1224h918/hash:1467485695/1419729364_awlogoblue.png?1467485695',
  duration: 264000,
  bitrate: 128,
  lyrics: '',
  streamURL: 'https://gp1.wpc.edgecastcdn.net/802892/http_private_production_west/songs/mp3_files/22564907/original/Alan_Walker_-_Fade_soundcloud_163522130.mp3?e8817609673e6ceae29a01acb0c7efb2998e3776e17ed00e0b4ea379d08cca9ca7ac22dbb49b0037a83598993d0a4bf3980a6b18d03481ca318ff5296613a8efae3c919e88116e970f9c674e302bf35bcacfe86355d31746356c0c3906a0a20fa9c8fcb239c38a546a40ebc5ef7ed4833e3353c8dba74f022fa7bb7c6839b6045ef66ff9b225382f0773ee156565d28ab969ecd32c13c045b84558bccfb3c6191460',
  public: true,
  url: 'https://www.reverbnation.com/alanwalkermusic/song/22564907-fade',
  contextImage: {
    original: 'https://gp1.wac.edgecastcdn.net/802892/http_public_production/artists/images/3711400/original/resize:1067x600/crop:x370y63w1224h918/hash:1467485695/1419729364_awlogoblue.png?1467485695',
    blur: 'https://gp1.wac.edgecastcdn.net/802892/http_public_production/artists/images/3711400/original/resize:1067x600/crop:x370y63w1224h918/blur:40/hash:1467485695/1419729364_awlogoblue.png?1467485695',
    colors: {
      raw: [Object],
      average_lightness: 0.9364344331637557,
      greyscale: false,
      vibrant: '#20a2d3',
      light_vibrant: '#9bcddc',
      dark_vibrant: '#3996aa',
      muted: '#545857',
      light_muted: '#fcfcfc',
      dark_muted: '#060606'
    },
    source: 'artist'
  },
  artist: Artist {
    id: 3711400,
    name: 'Alan Walker',
    profile: 'https://www.reverbnation.com/alanwalkermusic',
    type: 'artist',
    avatar: 'https://gp1.wac.edgecastcdn.net/802892/http_public_production/artists/images/3711400/original/crop:x0y0w1920h1080/hash:1467485695/1419729364_awlogoblue.png?1467485695',
    thumbnail: 'https://gp1.wac.edgecastcdn.net/802892/http_public_production/artists/images/3711400/original/resize:248x186/crop:x370y63w1224h918/hash:1467485695/1419729364_awlogoblue.png?1467485695',
    bio: 'Hi there,\n' +
      '\n' +
      'My name is Alan Walker.\n' +
      "I'm a 17 year old boy who loves to produce electronic dance music.\n" +
      "I'm from Northampton, England and live in Norway and my real name is Alan Walker.\n" +
      '\n' +
      'Back in 2012 I started off producing Hands Up / Techno and later moved over to Electro House in 2014 which has led to success. \n' +
      'I have released one track with the major label NoCopyrightSounds and have more releases coming!',
    genres: [ 'EDM', 'Electro House', 'Progressive House' ],
    location: { city: 'Bergen', state: null, country: 'NO' }
  },
  songs: [
    Song {
      title: 'Dennis 2014',
      id: 18956252,
      image: 'https://gp1.wac.edgecastcdn.net/802892/http_public_production/artists/images/3711400/original/crop:x0y0w1920h1080/hash:1467485695/1419729364_awlogoblue.png?1467485695',
      thumbnail: 'https://gp1.wac.edgecastcdn.net/802892/http_public_production/artists/images/3711400/original/resize:64x48/crop:x370y63w1224h918/hash:1467485695/1419729364_awlogoblue.png?1467485695',
      duration: 184000,
      bitrate: 320,
      lyrics: 'Å nei, Han død.\n' +
        'Å nei, han død.\n' +
        '\n' +
        'Å nei, han død, nå hun er sur på deg, skateboard.\n' +
        '\n' +
        'Å nei, nå hun er sur på deg.\n' +
        'Å nei, han død.\n' +
        '\n' +
        'Å faaa, waaaaah, gangnam style.',
      streamURL: 'https://gp1.wpc.edgecastcdn.net/802892/http_private_production_west/songs/mp3_files/18956252/original/DJ_Walkzz_-_Dennis_2014.mp3?e8817609673e6ceae29a01aeb4c7efb27e9a13df32507336957a252887e9ffb0c2a66eadaf3b3c29e6e6544862ee979e1616d82a8cc17ddb63ffce1be4f1aba2d5b6b10b048a1b44a84bf21ecd9088c63de545179742406847003be231c083d7fb22e039b3506dad4aca362d5595bda826b3ebcf8233c86ea14e84136ef863355aa3fccf382ab0d295705a8fd63360c0a44a',        
      public: true,
      url: 'https://www.reverbnation.com/alanwalkermusic/song/18956252-dennis-2014',
      contextImage: null
    }
  ]
}
*/
```

# Join my discord
**[https://discord.gg/2SUybzb](https://discord.gg/2SUybzb)**