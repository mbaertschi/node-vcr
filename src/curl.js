const http = require('http')

/**
 * Formats an http.IncomingMessage like curl does.
 *
 * @memberof module:node-vcr/curl
 * @param { http.IncomingMessage }
 * @returns { String }
 */
const request = (req) => {
  let out = `< ${req.method} ${req.url} HTTP/${req.httpVersion}\n`

  Object.keys(req.headers).forEach((name) => {
    out += `< ${name}: ${req.headers[name]}\n`
  })

  return `${out}<`
}

/**
 * Formats an http.ServerResponse like curl does.
 *
 * @memberof module:node-vcr/curl
 * @param { http.ServerResponse }
 * @returns { String }
 */
const response = (req, res) => {
  let out = `> HTTP/${req.httpVersion} ${res.statusCode} ${
    http.STATUS_CODES[res.statusCode]
  }\n`

  Object.keys(res._headers).forEach((name) => {
    out += `> ${name}: ${res._headers[name]}\n`
  })

  return `${out}>`
}

/**
 * @module node-vcr/curl
 */
module.exports = {
  request,
  response
}
