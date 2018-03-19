const { promisify } = require('util')

/**
 * Collect `stream`'s data in to an array of Buffers.
 *
 * @module node-vcr/buffer
 * @param { stream.Readable } stream
 * @returns { Promise.<Array> }
 */
const buffer = (stream, callback) => {
  const data = []

  stream.on('data', (chunk) => {
    data.push(chunk)
  })

  stream.on('error', (error) => {
    return callback(error)
  })

  stream.on('end', () => {
    return callback(null, data)
  })
}

module.exports = promisify(buffer)
