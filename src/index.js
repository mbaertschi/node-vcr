const assert = require('assert')
const debug = require('debug')('node-vcr')
const fse = require('fs-extra')
const messageHash = require('incoming-message-hash')
const path = require('path')
const buffer = require('./buffer')
const curl = require('./curl')
const record = require('./record')
const proxy = require('./proxy')

const defaultOpts = {
  dirname: './tapes/',
  noRecord: false,
  maxRedirects: 5,
  ignoreHeaders: [],
  hash: messageHash.sync
}

const RecordingDisabledError = new Error('Recording Disabled')
RecordingDisabledError.status = 404

/**
 * Returns a new node-vcr proxy middleware.
 *
 * @module node-vcr
 * @param { string } host                               The hostname to proxy to
 * @param { object } options
 * @param { string } options.dirname                    The tapes directory
 * @param { boolean } [options.noRecord=false]          If true, requests will return a 404 error if the tape doesn't exist
 * @param { boolean } [options.maxRedirects=5]          If set to 0 redirects will be disabled
 * @param { array } [options.ignoreHeaders=[]]          A list of headers which must not be written down to tape
 * @param { function } [options.hash=messageHash.sync]  Provide your own IncomingMessage hash function of the signature `function (req, body)`
 * @returns { function } A function of the signature `function (req, res)` that you can give to an `http.Server` as its handler
 */
module.exports = (host, usrOpts) => {
  assert(host)

  const opts = Object.assign({}, defaultOpts, usrOpts)
  debug('opts', opts)

  return (req, res) => {
    return fse.ensureDir(opts.dirname)
      .then(() => {
        return buffer(req)
      })
      .then((body) => {
        const filename = path.join(opts.dirname, `${opts.hash(req, Buffer.concat(body))}.js`)

        if (fse.existsSync(filename)) {
          return filename
        } else if (opts.noRecord) {
          throw RecordingDisabledError
        } else {
          return proxy(req, body, host, opts.maxRedirects)
            .then((pRes) => {
              return record(pRes.req, pRes, filename, opts.ignoreHeaders)
            })
        }
      })
      .then((file) => {
        return require(file)
      })
      .then((tape) => {
        return tape(req, res)
      })
      .catch((err) => {
        /* eslint-disable no-console */
        console.log('An HTTP request has been made that node-vcr does not know how to handle')
        console.log(curl.request(req))
        /* eslint-enable no-console */
        res.statusCode = err.status
        res.end(err.message)
      })
  }
}
