const fse = require('fs-extra')
const crypto = require('crypto')
const request = require('supertest')
const url = require('url')
const nodeVcr = require('../../src')

describe('node-vcr', () => {
  let server, tmpdir, vcr

  beforeEach((done) => { server = global.createServer(done) })
  beforeEach((done) => { tmpdir = global.createTmpdir(done) })

  afterEach((done) => server.teardown(done))
  afterEach((done) => tmpdir.teardown(done))

  describe('record', () => {
    describe('when recording is enabled', () => {
      beforeEach(() => { vcr = nodeVcr(server.host, { dirname: tmpdir.dirname }) })

      it('proxies the request to the server', (done) => {
        request(vcr)
          .get('/record/1')
          .set('host', 'localhost:3001')
          .expect('x-node-vcr-tape', '0aec39cb69f34888e40ffae3b28dd012')
          .expect('content-type', 'text/html')
          .expect(201, 'OK')
          .end((error) => {
            expect(error).toBeNull()
            expect(server.requests).toHaveLength(1)
            done()
          })
      })

      it('writes the tape to disk', (done) => {
        request(vcr)
          .get('/record/2')
          .set('host', 'localhost:3001')
          .expect('x-node-vcr-tape', '430594ed82343510c5670eba378a87df')
          .expect('content-type', 'text/html')
          .expect(201, 'OK')
          .end((error) => {
            expect(error).toBeNull()
            expect(fse.existsSync(tmpdir.join('430594ed82343510c5670eba378a87df.js'))).toBeTruthy()
            done()
          })
      })

      describe('when given a custom hashing function', () => {
        beforeEach(() => {
          // customHash creates an MD5 of the request, ingoring its querystring, headers, etc.
          const customHash = (req, body) => {
            const hash = crypto.createHash('md5')
            const parts = new url.URL(req.url, 'relative:///')

            hash.update(req.method)
            hash.update(parts.pathname)
            hash.write(body)

            return hash.digest('hex')
          }

          vcr = nodeVcr(server.host, { dirname: tmpdir.dirname, hash: customHash })
        })

        it('uses the custom hash to create the tape name', (done) => {
          request(vcr)
            .get('/record/1')
            .query({ foo: 'bar' })
            .query({ date: new Date() }) // without the custom hash, this would always cause 404s
            .set('host', 'localhost:3001')
            .expect('x-node-vcr-tape', '3f142e515cb24d1af9e51e6869bf666f')
            .expect('content-type', 'text/html')
            .expect(201, 'OK')
            .end((error) => {
              expect(error).toBeNull()
              expect(fse.existsSync(tmpdir.join('3f142e515cb24d1af9e51e6869bf666f.js'))).toBeTruthy()
              done()
            })
        })
      })

      describe('when given a custom hashing function with slash', () => {
        beforeEach(() => {
          // customHash creates an MD5 of the request, ingoring its querystring, headers, etc.
          const customHash = (req, body) => {
            const hash = crypto.createHash('md5')
            const parts = new url.URL(req.url, 'relative:///')

            hash.update(req.method)
            hash.update(parts.pathname)
            hash.write(body)

            return `${parts.pathname}/${hash.digest('hex')}`
          }

          vcr = nodeVcr(server.host, { dirname: tmpdir.dirname, hash: customHash })
        })

        it('uses the custom hash to create the tape name', (done) => {
          request(vcr)
            .get('/record/1')
            .query({ foo: 'bar' })
            .query({ date: new Date() }) // without the custom hash, this would always cause 404s
            .set('host', 'localhost:3001')
            .expect('x-node-vcr-tape', '3f142e515cb24d1af9e51e6869bf666f')
            .expect('content-type', 'text/html')
            .expect(201, 'OK')
            .end((error) => {
              expect(error).toBeNull()
              expect(fse.existsSync(tmpdir.join('/record/1/3f142e515cb24d1af9e51e6869bf666f.js'))).toBeTruthy()
              done()
            })
        })
      })
    })

    describe('when recording is not enabled', () => {
      beforeEach(() => { vcr = nodeVcr(server.host, { dirname: tmpdir.dirname, noRecord: true }) })

      it('returns a 404 error', (done) => {
        request(vcr)
          .get('/record/1')
          .set('host', 'localhost:3001')
          .expect(404)
          .end(done)
      })

      it('does not make a request to the server', (done) => {
        request(vcr)
          .get('/record/2')
          .set('host', 'localhost:3001')
          .end((error) => {
            expect(error).toBeNull()
            expect(server.requests).toHaveLength(0)
            done()
          })
      })

      it('does not write the tape to disk', (done) => {
        request(vcr)
          .get('/record/2')
          .set('host', 'localhost:3001')
          .end((error) => {
            expect(error).toBeNull()
            expect(fse.existsSync(tmpdir.join('5cf1bd6b8d3943e5c3fb3b75b23d0265.js'))).toBeFalsy()
            done()
          })
      })
    })
  })

  describe('playback', () => {
    beforeEach(() => { vcr = nodeVcr(server.host, { dirname: tmpdir.dirname }) })
    beforeEach((done) => {
      const file = '6b25ffd68922f5faeb9d97dc83ea8eb0.js'
      const tape = [
        "const path = require('path')",
        'module.exports = function (req, res) {',
        '  res.statusCode = 201',
        "  res.setHeader('content-type', 'text/html')",
        "  res.setHeader('x-node-vcr-tape', path.basename(__filename, '.js'))",
        "  res.end('YAY')",
        '}',
        ''
      ].join('\n')

      fse.writeFile(tmpdir.join(file), tape, done)
    })

    it('does not make a request to the server', (done) => {
      request(vcr)
        .get('/playback/1')
        .set('host', 'localhost:3001')
        .expect('x-node-vcr-tape', '6b25ffd68922f5faeb9d97dc83ea8eb0')
        .expect('content-type', 'text/html')
        .expect(201, 'YAY')
        .end((error) => {
          expect(error).toBeNull()
          expect(server.requests).toHaveLength(0)
          done()
        })
    })
  })

  describe('reload', () => {
    beforeEach(() => { vcr = nodeVcr(server.host, { dirname: tmpdir.dirname, reload: true }) })
    beforeEach((done) => {
      const file = '6b25ffd68922f5faeb9d97dc83ea8eb0.js'
      const tape = [
        "const path = require('path')",
        'module.exports = function (req, res) {',
        '  res.statusCode = 201',
        "  res.setHeader('content-type', 'text/html')",
        "  res.setHeader('x-node-vcr-tape', path.basename(__filename, '.js'))",
        "  res.end('YAY')",
        '}',
        ''
      ].join('\n')

      fse.writeFile(tmpdir.join(file), tape, done)
    })

    it('does make a request to the server', (done) => {
      request(vcr)
        .get('/playback/1')
        .set('host', 'localhost:3001')
        .expect('x-node-vcr-tape', '6b25ffd68922f5faeb9d97dc83ea8eb0')
        .expect('content-type', 'text/html')
        .expect(201, 'OK')
        .end((error) => {
          expect(error).toBeNull()
          expect(server.requests).toHaveLength(1)
          done()
        })
    })
  })
})
