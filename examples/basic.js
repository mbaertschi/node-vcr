/*
 * Example for basic usage. Result is stored in `playback/basic.js`
 */

const http = require('http')
/* eslint-disable-next-line node/no-unpublished-require */
const nodeVcr = require('../src')
const path = require('path')
const debug = require('debug')('node-vcr:examples:basic')

const proxyTarget = 'https://api.github.com/users/mbaertschi/orgs'
const dirname = path.join(__dirname, 'playback')
const port = 8888

const handler = nodeVcr(proxyTarget, {
  dirname
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
