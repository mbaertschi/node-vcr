/*
 * Example for custom hash method. Result is stored in `playback/get_orgs_d41d8cd98f00b204e9800998ecf8427e.js`
 */

const crypto = require('crypto')
const http = require('http')
/* eslint-disable-next-line node/no-unpublished-require */
const nodeVcr = require('../src')
const path = require('path')
const debug = require('debug')('node-vcr:examples:hash')

const proxyTarget = 'https://api.github.com/users/mbaertschi/orgs'
const dirname = path.join(__dirname, 'playback')
const port = 8888

const hash = (req, body) => {
  const parts = req.url.split('/')
  const action = `${req.method.toLowerCase()}_${parts[parts.length - 1]}`
  const content = body.toString()
  const md5sum = crypto.createHash('md5')

  return `${action}_${md5sum.update(content).digest('hex')}`
}

const handler = nodeVcr(proxyTarget, {
  dirname,
  hash
})

const server = http.createServer(handler)
server.listen(port, () => {
  const options = {
    protocol: 'http:',
    host: 'localhost',
    port: 8888,
    method: 'GET',
    path: '/users/mbaertschi/orgs',
    headers: {
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'
    }
  }

  debug(JSON.stringify(options, null, 2))
  http.get(options, (res) => {
    const data = []
    res.on('data', (chunk) => {
      data.push(chunk)
    })
    res.on('end', () => {
      debug(data.toString())
      server.close()
    })
    res.on('error', (error) => {
      debug(error)
      server.close()
    })
  })
})
