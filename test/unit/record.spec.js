const http = require('http')
const fse = require('fs-extra')
const fixture = require('../fixture')
const record = require('../../src/record')

describe('record', () => {
  let server, tmpdir, req

  beforeEach(() => { tmpdir = global.createTmpdir() })
  afterEach(() => {
    server.teardown()
    tmpdir.teardown()
  })

  describe('filename', () => {
    beforeEach((done) => { server = global.createServer(done) })
    beforeEach(() => {
      req = http.request({
        host: server.addr,
        port: server.port
      })
      req.setHeader('user-agent', 'My User Agent/1.0')
      req.setHeader('connection', 'close')
    })

    it('returns the filename', (done) => {
      req.on('response', (res) => {
        record(req, res, tmpdir.join('foo.js'), [])
          .then((filename) => {
            expect(filename).toBe(tmpdir.join('foo.js'))
            return done()
          })
          .catch(done)
      })

      req.end()
    })
  })

  describe('Template rendering', () => {
    const makeRequest = (requestHandler, test) => {
      server = global.createServer(() => {
        const req = http.request({
          host: server.addr,
          port: server.port
        })
        req.setHeader('user-agent', 'My User Agent/1.0')
        req.setHeader('connection', 'close')

        req.on('response', test)
        req.end()
      }, requestHandler)
    }

    describe('when the body is not human readable', () => {
      it('records the response to disk using base64', (done) => {
        const requestHandler = (req, res) => {
          res.statusCode = 201
          res.setHeader('content-type', 'image/gif')
          res.setHeader('date', 'Sat, 26 Oct 1985 08:20:00 GMT')
          res.end('GIF')
        }

        makeRequest(requestHandler, (res) => {
          const expected = fixture('base64').replace('{addr}', server.addr).replace('{port}', server.port)

          record(res.req, res, tmpdir.join('foo.js'), [])
            .then((filename) => {
              const content = fse.readFileSync(filename, 'utf-8')

              expect(content).toEqual(expected)
              return done()
            })
            .catch(done)
        })
      })
    })

    describe('when the body is human readable', () => {
      it('records the response to disk using utf-8', (done) => {
        const requestHandler = (req, res) => {
          res.statusCode = 201
          res.setHeader('content-type', 'text/html')
          res.setHeader('date', 'Sat, 26 Oct 1985 08:20:00 GMT')
          res.end('OK')
        }

        makeRequest(requestHandler, (res) => {
          const expected = fixture('utf8').replace('{addr}', server.addr).replace('{port}', server.port)

          return record(res.req, res, tmpdir.join('foo.js'), [])
            .then((filename) => {
              const content = fse.readFileSync(filename, 'utf8')

              expect(content).toEqual(expected)
              return done()
            })
            .catch((error) => {
              return done(error)
            })
        })
      })

      it('records the response to disk using utf-8 and filters out the ignored headers', (done) => {
        const requestHandler = (req, res) => {
          res.statusCode = 201
          res.setHeader('content-type', 'text/html')
          res.setHeader('date', 'Sat, 26 Oct 1985 08:20:00 GMT')
          res.end('OK')
        }

        makeRequest(requestHandler, (res) => {
          const expected = fixture('utf8ignoredHeaders').replace('{addr}', server.addr).replace('{port}', server.port)

          return record(res.req, res, tmpdir.join('foo.js'), ['user-agent', 'date'])
            .then((filename) => {
              const content = fse.readFileSync(filename, 'utf8')

              expect(content).toEqual(expected)
              return done()
            })
            .catch((error) => {
              return done(error)
            })
        })
      })

      it('records the response to disk using utf-8 and pretty-prints the json data', (done) => {
        const requestHandler = (req, res) => {
          res.statusCode = 201
          res.setHeader('content-type', 'application/json')
          res.setHeader('date', 'Sat, 26 Oct 1985 08:20:00 GMT')
          res.end(Buffer.from(JSON.stringify({ test: 'json' })))
        }

        makeRequest(requestHandler, (res) => {
          const expected = fixture('json').replace('{addr}', server.addr).replace('{port}', server.port)

          return record(res.req, res, tmpdir.join('foo.js'), [])
            .then((filename) => {
              const content = fse.readFileSync(filename, 'utf8')

              expect(content).toEqual(expected)
              return done()
            })
            .catch((error) => {
              return done(error)
            })
        })
      })

      it('records the response to disk using utf-8, pretty-prints the json data, and sanitize data', (done) => {
        const requestHandler = (req, res) => {
          res.statusCode = 201
          res.setHeader('content-type', 'application/json')
          res.setHeader('date', 'Sat, 26 Oct 1985 08:20:00 GMT')
          res.end(Buffer.from('{ "test": "c:\\temp\\foo.js" }'))
        }

        makeRequest(requestHandler, (res) => {
          const expected = fixture('sanitizeBody').replace('{addr}', server.addr).replace('{port}', server.port)

          return record(res.req, res, tmpdir.join('foo.js'), [])
            .then((filename) => {
              const content = fse.readFileSync(filename, 'utf8')

              expect(content).toEqual(expected)
              return done()
            })
            .catch((error) => {
              return done(error)
            })
        })
      })
    })
  })
})
