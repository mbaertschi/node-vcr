const contentTypeParser = require('content-type')

const humanReadableContentTypes = [
  'application/javascript',
  'application/json',
  'text/css',
  'text/html',
  'text/javascript',
  'text/plain'
]

const getHeader = (headers, headerName) => {
  const value = headers[headerName]

  if (Array.isArray(value)) {
    return value[0]
  }

  return value
}

const getContentType = (res) => {
  const contentType = getHeader(res.headers, 'content-type')

  if (!contentType) {
    return false
  }

  return contentTypeParser.parse(contentType).type
}

/**
 * Returns whether a request's body is human readable.
 *
 * @memberof module:node-vcr/media-type
 * @param { http.IncomingMessage } req
 * @returns { Boolean }
*/
const isHumanReadable = (res) => {
  const headers = res.headers
  const encoding = getHeader(headers, 'content-encoding')
  const notCompressed = !encoding || encoding === 'identity'
  const contentType = getContentType(res)

  return notCompressed && humanReadableContentTypes.indexOf(contentType) >= 0
}

/**
 * @module node-vcr/media-type
 */
module.exports = {
  getContentType,
  isHumanReadable
}
