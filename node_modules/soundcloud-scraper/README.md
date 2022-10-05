# SoundCloud Scraper
Get data from soundcloud easily.

[![NPM](https://nodei.co/npm/soundcloud-scraper.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/soundcloud-scraper/)

# Installation

```sh
$ npm i soundcloud-scraper
```

# Documentation
**[https://soundcloud-scraper.js.org](https://soundcloud-scraper.js.org)**

# Example
## Downloading a Song

> Note: This process can take few seconds if you do not provide api key
> because it will first find the api key and then fetch respective track url to get final stream url
> and then download it. To solve this issue, first get your soundcloud key using `SoundCloud.keygen()` and then save it somewhere.
> Later you can pass that key in `SoundCloud.Client` constructor: `new SoundCloud.Client("API_KEY")`.
> SoundCloud Scraper automatically detects `SOUNDCLOUD_API_KEY` from `process.env`.

```js
const SoundCloud = require("soundcloud-scraper");
const client = new SoundCloud.Client();
const fs = require("fs");

client.getSongInfo("https://soundcloud.com/dogesounds/alan-walker-feat-k-391-ignite")
    .then(async song => {
        const stream = await song.downloadProgressive();
        const writer = stream.pipe(fs.createWriteStream(`./${song.title}.mp3`));
        writer.on("finish", () => {
          console.log("Finished writing song!")
          process.exit(1);
        });
    })
    .catch(console.error);
```

# Responses
## Song Info

<details>
<summary>👉 Preview Response</summary>

```js
Song {
  id: '316547873',
  title: 'Alan Walker feat. K-391 - Ignite [FREE DOWNLOAD]',
  description: 'FREE DOWNLOAD: http://discoverysounds.com/gate/alan-walker-feat-k-391-ignite\n' +
    '\n' +
    'Alan Walker Feat K 391 Ignite Download\n' +
    'Alan Walker Feat K 391 Ignite Mp3 Download\n' +
    'Alan Walker Feat K 391 Ignite New Song 2',
  thumbnail: 'https://i1.sndcdn.com/artworks-000216694368-wsysn4-t500x500.jpg',
  url: 'https://soundcloud.com/dogesounds/alan-walker-feat-k-391-ignite',
  duration: 210000,
  playCount: '771664',
  commentsCount: '371',
  likes: '13514',
  genre: 'Dance & EDM',
  author: {
    name: 'Doge Sounds',
    username: 'dogesounds',
    url: 'https://soundcloud.com/dogesounds',
    avatarURL: 'https://i1.sndcdn.com/avatars-000304905983-a0568r-large.jpg',
    urn: 298449071,
    verified: false,
    followers: 149,
    following: 32
  },
  publishedAt: 2017-04-07T11:02:54.000Z,
  embedURL: 'https://soundcloud.com/oembed?url=https%3A%2F%2Fsoundcloud.com%2Fdogesounds%2Falan-walker-feat-k-391-ignite&format=json',
  embed: null,
  streams: {
    hls: 'https://api-v2.soundcloud.com/media/soundcloud:tracks:316547873/7ccfb0e4-2d57-4f9b-b5df-9d340a3a2dd6/stream/hls',
    progressive: 'https://api-v2.soundcloud.com/media/soundcloud:tracks:316547873/7ccfb0e4-2d57-4f9b-b5df-9d340a3a2dd6/stream/progressive'
  },
  trackURL: 'https://api-v2.soundcloud.com/media/soundcloud:tracks:316547873/7ccfb0e4-2d57-4f9b-b5df-9d340a3a2dd6/stream/progressive',
  comments: [],
  streamURL: null
}
```
</details>

## Song Embed

<details>
<summary>👉 Preview Response</summary>

```js
Embed {
  url: 'https://soundcloud.com/oembed?url=https%3A%2F%2Fsoundcloud.com%2Fdogesounds%2Falan-walker-feat-k-391-ignite&format=json',
  version: 1,
  type: 'rich',
  provider: { name: 'SoundCloud', url: 'https://soundcloud.com' },
  height: 400,
  width: '100%',
  title: 'Alan Walker feat. K-391 - Ignite [FREE DOWNLOAD] by Doge Sounds',
  description: 'FREE DOWNLOAD: http://discoverysounds.com/gate/alan-walker-feat-k-391-ignite\n' +
    '\n' +
    'Alan Walker Feat K 391 Ignite Download\n' +
    'Alan Walker Feat K 391 Ignite Mp3 Download\n' +
    'Alan Walker Feat K 391 Ignite New Song 2017\n' +
    'Alan Walker Feat K 391 Ignite 2017',
  author: { name: 'Doge Sounds', url: 'https://soundcloud.com/dogesounds' },
  thumbnailURL: 'https://i1.sndcdn.com/artworks-000216694368-wsysn4-t500x500.jpg'
}
```
</details>

## Song Comments

<details>
<summary>👉 Preview Response</summary>

```js
[
  {
    text: '����',
    createdAt: 2020-10-30T11:58:13.000Z,
    author: {
      name: 'askaria22',
      username: 'mohamed-askaria-541170196',
      url: 'https://soundcloud.com/mohamed-askaria-541170196'
    }
  },
  {
    text: 'Cool',
    createdAt: 2020-10-28T15:03:21.000Z,
    author: {
      name: 'Matias Ronkainen',
      username: 'matias-ronkainen',
      url: 'https://soundcloud.com/matias-ronkainen'
    }
  },
  {
    text: 'wow nice song i love the beat',
    createdAt: 2020-10-27T05:35:39.000Z,
    author: {
      name: 'saathvika vempati',
      username: 'saathvika-vempati',
      url: 'https://soundcloud.com/saathvika-vempati'
    }
  },
  {
    text: 'tempik',
    createdAt: 2020-10-23T04:49:11.000Z,
    author: {
      name: 'didik8336@gmail.com',
      username: 'didik-saputra-908291434',
      url: 'https://soundcloud.com/didik-saputra-908291434'
    }
  },
  {
    text: '@jazmine-powers-328939011: ew chain mail',
    createdAt: 2020-10-21T18:40:33.000Z,
    author: {
      name: 'FallenQbjYT',
      username: 'fallen-qbj',
      url: 'https://soundcloud.com/fallen-qbj'
    }
  },
  ...
]
```
</details>

## User Info

<details>
<summary>👉 Preview Response</summary>

```js
{
  urn: 298449071,
  username: 'dogesounds',
  name: 'Doge Sounds',
  verified: false,
  createdAt: 2017-03-29T21:35:45.000Z,
  avatarURL: 'https://i1.sndcdn.com/avatars-000304905983-a0568r-large.jpg',
  profile: 'https://soundcloud.com/dogesounds',
  bannerURL: 'https://i1.sndcdn.com/visuals-000298449071-KhchhU-original.jpg',
  followers: 149,
  following: 32,
  likesCount: 6,
  tracksCount: 2,
  tracks: [
    {
      title: 'Alan Walker feat. K-391 - Ignite [FREE DOWNLOAD]',
      url: 'https://soundcloud.com/dogesounds/alan-walker-feat-k-391-ignite',
      publishedAt: 2017-04-07T11:02:54.000Z,
      genre: 'Dance & EDM',
      author: 'dogesounds',
      duration: 210000
    },
    {
      title: 'W&W & Daddy Yankee - Gasolina (Hardwell Mashup) [FREE DOWNLOAD]',
      url: 'https://soundcloud.com/dogesounds/ww-daddy-yankee-gasolina-hardwell-mashup',
      publishedAt: 2017-03-29T21:38:38.000Z,
      genre: 'Dance & EDM',
      author: 'dogesounds',
      duration: 267000
    }
  ],
  likes: [
    {
      title: 'Alan Walker feat. K-391 - Ignite [FREE DOWNLOAD]',
      url: 'https://soundcloud.com/dogesounds/alan-walker-feat-k-391-ignite',
      publishedAt: 2017-04-07T11:02:54.000Z,
      genre: 'Dance & EDM',
      author: {
        name: 'Doge Sounds',
        username: 'dogesounds',
        profile: 'https://soundcloud.com/dogesounds'
      }
    },
    {
      title: 'W&W & Daddy Yankee - Gasolina (Hardwell Mashup) [FREE DOWNLOAD]',
      url: 'https://soundcloud.com/dogesounds/ww-daddy-yankee-gasolina-hardwell-mashup',
      publishedAt: 2017-03-29T21:38:38.000Z,
      genre: 'Dance & EDM',
      author: {
        name: 'Doge Sounds',
        username: 'dogesounds',
        profile: 'https://soundcloud.com/dogesounds'
      }
    }
  ]
}
```

</details>

## Playlist

<details>
<summary>👉 Preview Response</summary>

```js
{
  id: 1001644540,
  title: 'albert vishi',
  url: 'https://soundcloud.com/ambreen-kanwal-397095258/sets/albert-vishi',
  description: 'Listen to albert vishi by Ambreen Kanwal #np on #SoundCloud',
  thumbnail: 'https://i1.sndcdn.com/artworks-y5WKIPZcAx2gKBSU-UGgDzA-t500x500.jpg',
  author: {
    profile: 'https://soundcloud.com/ambreen-kanwal-397095258',
    username: 'ambreen-kanwal-397095258',
    name: 'Ambreen Kanwal',
    urn: 311943633
  },
  embedURL: 'https://soundcloud.com/oembed?url=https%3A%2F%2Fsoundcloud.com%2Fambreen-kanwal-397095258%2Fsets%2Falbert-vishi&format=json',
  embed: null,
  genre: '',
  trackCount: 54,
  tracks: [
    Song {
      id: 754856170,
      title: 'Albert Vishi Ft. Ane Flem - Zombie (The Cranberries Cover In Alan Walker Style)',
      description: null,
      thumbnail: 'https://i1.sndcdn.com/artworks-y5WKIPZcAx2gKBSU-UGgDzA-large.jpg',
      url: 'https://soundcloud.com/albertvishi/albert-vishi-ft-ane-flem-zombie-the-cranberries-cover-in-alan-walker-style',
      duration: 252056,
      playCount: 138735,
      commentsCount: 52,
      likes: 2174,
      genre: 'Dance & EDM',
      author: [Object],
      publishedAt: 2020-02-04T11:41:24.000Z,
      embedURL: null,
      embed: null,
      streams: [Object],
      trackURL: 'https://api-v2.soundcloud.com/media/soundcloud:tracks:754856170/8a6b90d7-59fc-4669-baa6-c7e53d45a6ef/stream/progressive',
      comments: [],
      streamURL: null
    },
    ...
  ]
}
```

</details>

# Join Our Discord Server
[![](https://i.imgur.com/f6hNUfc.png)](https://discord.gg/2SUybzb)
