# is-unix

![Last version](https://img.shields.io/github/tag/Kikobeats/is-unix.svg?style=flat-square)
[![Coverage Status](https://img.shields.io/coveralls/Kikobeats/is-unix.svg?style=flat-square)](https://coveralls.io/github/Kikobeats/is-unix)
[![NPM Status](https://img.shields.io/npm/dm/is-unix.svg?style=flat-square)](https://www.npmjs.org/package/is-unix)

> Determines if a platform is UNIX-like.

## Install

```bash
$ npm install is-unix --save
```

## Usage

```js
const isUnix = require('is-unix')

isUnix('win32') // => false
isUnix('darwin') // => true
isUnix('linux') // => true
isUnix('freebsd') // => true
isUnix('sunos') // => true
```

## API

### isUnix(platform)

#### platform

Type: `string`

## License

MIT © [Kiko Beats](http://kikobeats.com)
