const pd = require('pretty-data').pd
const fse = require('fs-extra')
const zlib = require('zlib')
const JSONBigInt = require('json-bigint')
const buffer = require('./buffer')
const { getContentType, isHumanReadable, isCompressed } = require('./media-type')
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
  let stream = res
  const finalIgnoredHeaders = [...ignoredHeaders]
  if (isCompressed(res) && isHumanReadable(res)) {
    stream = res.pipe(zlib.createUnzip())
    finalIgnoredHeaders.push('content-encoding')
    finalIgnoredHeaders.push('content-length')
  }

  return buffer(stream)
    .then((body) => {
      const encoding = isHumanReadable(res) ? 'utf-8' : 'base64'
      let contentType = getContentType(res)

      if (contentType && contentType.indexOf('/') >= 0) {
        const parts = contentType.split('/')
        contentType = parts[parts.length - 1]
      }

      body = Buffer.concat(body).toString(encoding)
      let data = body
      try {
        if (contentType === 'json') {
          data = JSON.stringify(JSONBigInt.parse(data), null, 2)
        } else {
          if (pd[contentType]) {
            data = pd[contentType](body)
            if (reqBody) {
              reqBody = pd[contentType](reqBody)
            }
          }
        }
      } catch (error) {
        data = body
      }

      return render(req, res, data, encoding, finalIgnoredHeaders, reqBody)
    })
    .then((data) => {
      return fse.writeFile(filename, data)
    })
    .then(() => {
      return filename
    })
}

module.exports = record
