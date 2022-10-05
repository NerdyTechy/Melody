'use strict'

module.exports = (platform = '') => {
  platform = platform.toLowerCase()
  return (
    [
      'aix',
      'android',
      'darwin',
      'freebsd',
      'linux',
      'openbsd',
      'sunos'
    ].indexOf(platform) !== -1
  )
}
