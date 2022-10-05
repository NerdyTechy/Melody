'use strict'

const spotifyURI = require('spotify-uri')
const { parse } = require('himalaya')

const TYPE = {
  ALBUM: 'album',
  ARTIST: 'artist',
  EPISODE: 'episode',
  PLAYLIST: 'playlist',
  TRACK: 'track'
}

const SUPPORTED_TYPES = Object.values(TYPE)

const createGetData = fetch => async (url, opts) => {
  const parsedUrl = getParsedUrl(url)
  const embedURL = spotifyURI.formatEmbedURL(parsedUrl)

  const response = await fetch(embedURL, opts)
  const text = await response.text()
  const embed = parse(text)

  const scripts = embed
    .filter(e => e.tagName === 'html')[0]
    .children.filter(e => e.tagName === 'body')[0]
    .children.filter(e => e.tagName === 'script')

  const resourceScript = scripts.filter(
    e => e.attributes.findIndex(a => a.value === 'resource') !== -1
  )

  if (resourceScript.length > 0) {
    // found data in the older embed style
    return JSON.parse(decodeURIComponent(resourceScript[0].children[0].content))
  }

  const hydrateScript = scripts.filter(
    e => e.children[0] && /%22data%22%|"data":/.test(e.children[0].content)
  )

  if (hydrateScript.length > 0) {
    // found hydration data
    // parsing via looking for { to be a little bit resistant to code changes
    const scriptContent = hydrateScript[0].children[0].content.includes(
      '%22data%22%'
    )
      ? decodeURIComponent(hydrateScript[0].children[0].content)
      : hydrateScript[0].children[0].content
    return normalizeData(
      JSON.parse(
        '{' +
          scriptContent
            .split('{')
            .slice(1)
            .join('{')
            .trim()
      )
    )
  }

  throw new Error(
    "Couldn't find any data in embed page that we know how to parse"
  )
}

function getParsedUrl (url) {
  try {
    const parsedURL = spotifyURI.parse(url)
    if (!parsedURL.type) throw new TypeError()
    return spotifyURI.formatEmbedURL(parsedURL)
  } catch (_) {
    throw new TypeError(`Couldn't parse '${url}' as valid URL`)
  }
}

function getImages (data) {
  switch (data.type) {
    case TYPE.TRACK:
      return data.album.images
    case TYPE.EPISODE:
      return data.coverArt.sources
    default:
      return data.images
  }
}

function getDate (data) {
  switch (data.type) {
    case TYPE.TRACK:
      return data.album.release_date
    case TYPE.EPISODE:
      return data.releaseDate.isoString
    default:
      return data.release_date
  }
}

function getArtistTrack (track) {
  return track.show
    ? track.show.publisher
    : []
        .concat(track.artists)
        .filter(Boolean)
        .map(a => a.name)
        .join(' & ')
}

function getLink (data) {
  switch (data.type) {
    case TYPE.EPISODE:
      return spotifyURI.formatOpenURL(data.uri)
    default:
      return data.external_urls.spotify
  }
}

function getPreview (data) {
  const track = getFirstTrack(data)
  const date = getDate(data)

  return {
    date: date ? new Date(date).toISOString() : date,
    title: data.name,
    type: data.type,
    track: track.name,
    description: data.description || track.description,
    artist: getArtistTrack(track) || track.artist,
    image: getImages(data).reduce((a, b) => (a.width > b.width ? a : b)).url,
    audio: track.audio_preview_url || track.preview_url,
    link: getLink(data),
    embed: `https://embed.spotify.com/?uri=${data.uri}`
  }
}

function getTracks (data) {
  switch (data.type) {
    case TYPE.PLAYLIST:
      return data.tracks.items.map(({ track }) => track)
    case TYPE.ARTIST:
      return data.tracks
    case TYPE.ALBUM:
      return data.tracks.items
    default:
      return [data]
  }
}

function getFirstTrack (data) {
  switch (data.type) {
    case TYPE.TRACK:
      return data
    case TYPE.PLAYLIST:
      return data.tracks.items[0].track
    case TYPE.ALBUM:
      return data.tracks.items[0]
    case TYPE.ARTIST:
      return data.tracks[0]
    case TYPE.EPISODE: {
      const { subtitle, audioPreview } = data
      const [artist, description] = data.subtitle.split(' - ')
      return {
        artist,
        description,
        name: subtitle,
        preview_url: audioPreview.url
      }
    }
  }
}

function normalizeData ({ data }) {
  data = data.entity ? data.entity : data

  if (data.episode) {
    data = data.episode
    data.type = TYPE.EPISODE
  }

  if (!data || !data.type || !data.name) {
    throw new Error("Data doesn't seem to be of the right shape to parse")
  }

  if (!SUPPORTED_TYPES.includes(data.type)) {
    throw new Error(
      `Not an ${SUPPORTED_TYPES.join(', ')}. Only these types can be parsed`
    )
  }

  return data
}

function spotifyUrlInfo (fetch) {
  const getData = createGetData(fetch)
  return {
    getData,
    getPreview: (url, opts) => getData(url, opts).then(getPreview),
    getTracks: (url, opts) => getData(url, opts).then(getTracks),
    getDetails: (url, opts) =>
      getData(url, opts).then(data => ({
        preview: getPreview(data),
        tracks: getTracks(data)
      }))
  }
}

module.exports = spotifyUrlInfo
