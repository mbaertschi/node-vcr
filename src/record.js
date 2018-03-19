const pd = require('pretty-data').pd
const fse = require('fs-extra')
const buffer = require('./buffer')
const { getContentType, isHumanReadable } = require('./media-type')
const { render } = require('./template')

/**
 * Record the http interaction between `req` and `res` to disk.
 * The format is a vanilla node module that can be used as
 * an http.Server handler.
 *
 * @module node-vcr/record
 * @param { http.ClientRequest } req
 * @param { http.IncomingMessage } res
 * @param { String } filename
 * @returns { Promise.<String> }
 */
const record = (req, res, filename) => {
  return buffer(res)
    .then((body) => {
      const encoding = isHumanReadable(res) ? 'utf-8' : 'base64'
      let contentType = getContentType(res)

      if (contentType && contentType.indexOf('/') >= 0) {
        const parts = contentType.split('/')
        contentType = parts[parts.length - 1]
      }

      body = body.map((data) => {
        let stringData = data.toString(encoding)

        if (pd[contentType]) {
          stringData = pd[contentType](stringData)
        }
        return stringData
      })

      return render(req, res, body, encoding)
    })
    .then((data) => {
      return fse.writeFile(filename, data)
    })
    .then(() => {
      return filename
    })
}

module.exports = record
