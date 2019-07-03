const contentTypeParser = require('content-type')

const humanReadableContentTypes = [
  'application/javascript',
  'application/json',
  'text/css',
  'text/html',
  'text/javascript',
  'text/plain',
  'text/xml'
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
  const contentType = getContentType(res)
  return humanReadableContentTypes.indexOf(contentType) >= 0
}

/**
 * Returns whether a request's body is compressed.
 *
 * @memberof module:node-vcr/media-type
 * @param { http.IncomingMessage } res
 * @returns { Boolean }
 */
const isCompressed = (res) => {
  const headers = res.headers
  const encoding = getHeader(headers, 'content-encoding')
  return encoding && encoding !== 'identity'
}

/**
 * @module node-vcr/media-type
 */
module.exports = {
  getContentType,
  isHumanReadable,
  isCompressed
}
