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
 * @param { Array } ignoredHeaders
 * @param { String } reqBody
 * @returns { Promise.<String> }
 */
const record = (req, res, filename, ignoredHeaders, reqBody) => {
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

        try {
          if (pd[contentType]) {
            stringData = pd[contentType](stringData)
            if (reqBody) {
              reqBody = pd[contentType](reqBody)
            }
          }
        } catch (error) {
          return stringData
        }
        return stringData
      })

      return render(req, res, body, encoding, ignoredHeaders, reqBody)
    })
    .then((data) => {
      return fse.writeFile(filename, data)
    })
    .then(() => {
      return filename
    })
}

module.exports = record
