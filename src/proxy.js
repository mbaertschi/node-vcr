const debug = require('debug')('node-vcr')
const http = require('http')
const https = require('https')
const followRedirects = require('follow-redirects')
const { promisify } = require('util')
const url = require('url')

const modMapping = {
  'http': http,
  'https': https
}

/**
 * Proxy `req` to `host` and yield the response.
 *
 * @module node-vcr/proxy
 * @param { http.IncomingMessage } req
 * @param { Array.<Buffer> } body
 * @param { String } host
 * @param { Number } maxRedirects
 * @returns { Promise.<http.IncomingMessage> }
 */
const proxy = (req, body, host, maxRedirects, callback) => {
  followRedirects.maxRedirects = maxRedirects

  const uri = url.parse(host)
  const protocol = uri.protocol.replace(':', '')
  const mod = maxRedirects ? (followRedirects[protocol] || followRedirects.http) : (modMapping[protocol] || http)
  const pReq = mod.request({
    hostname: uri.hostname,
    port: uri.port,
    method: req.method,
    path: req.url,
    headers: req.headers,
    servername: uri.hostname,
    rejectUnauthorized: false
  }, (pRes) => {
    return callback(null, pRes)
  })

  pReq.setHeader('host', uri.host)

  debug(`req=${req.url} host=${uri.host}`)

  body.forEach((buf) => {
    pReq.write(buf)
  })

  pReq.end()
}

module.exports = promisify(proxy)
