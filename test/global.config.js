const debug = require('debug')('test')
const fse = require('fs-extra')
const http = require('http')
const path = require('path')
const tmpdir = require('os-tmpdir')

debug('setup global test configurations')

require('jest-plugins')([
  'jest-plugins-recommended'
])

const createServer = (done, reqHandler) => {
  const server = http.createServer((req, res) => {
    req.resume() // consume the request body if any

    req.on('end', () => {
      if (reqHandler) {
        reqHandler(req, res)
      } else {
        res.statusCode = 201
        res.setHeader('content-type', 'text/html')
        res.setHeader('date', 'Sat, 26 Oct 1985 08:20:00 GMT')
        res.end('OK')
      }
    })
  }).on('listening', function () {
    this.addr = 'localhost'
    this.port = this.address().port
    this.host = `http://${this.addr}:${this.port}`
  }).on('listening', function () {
    this.requests = []
  }).on('close', function () {
    this.requests = []
  }).on('request', function (req) {
    this.requests.push(req)
  })

  server.teardown = function (doneT) {
    this.close(doneT)
  }

  return server.listen(done)
}

class Dir {
  constructor () {
    this.dirname = path.join(tmpdir(), Date.now().toString())
  }

  join (val) {
    return path.join(this.dirname, val)
  }

  setup (done) {
    fse.ensureDir(this.dirname, done)
    return this
  }

  teardown (done) {
    fse.emptyDir(this.dirname, done)
    return this
  }
}

const createTmpdir = (done) => {
  return new Dir().setup(done)
}

global.createServer = createServer
global.createTmpdir = createTmpdir
