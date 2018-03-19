const http = require('http')
const proxy = require('../../src/proxy')

describe('proxy', () => {
  let server, req

  beforeEach((done) => { server = global.createServer(done) })
  beforeEach(() => {
    req = new http.IncomingMessage()
    req.method = 'GET'
    req.url = '/'
    req.headers['connection'] = 'close'
  })

  afterEach((done) => server.teardown(done))

  it('proxies the request', (done) => {
    server.once('request', (pReq) => {
      expect(pReq.method).toBe(req.method)
      expect(pReq.url).toBe(req.url)
      expect(pReq.headers.host).toBe(`${server.addr}:${server.port}`)
      done()
    })

    proxy(req, [], server.host, 0).catch(done)
  })

  it('proxies the request body', (done) => {
    const body = [
      Buffer.from('a'),
      Buffer.from('b'),
      Buffer.from('c')
    ]

    server.once('request', (pReq) => {
      const data = []

      pReq.on('data', (buf) => {
        data.push(buf)
      })

      pReq.on('end', () => {
        expect(Buffer.concat(data)).toEqual(Buffer.concat(body))
        done()
      })
    })

    req.method = 'POST'
    proxy(req, body, server.host, 0).catch(done)
  })

  it('yields the response', (done) => {
    proxy(req, [], server.host, 0).then((res) => {
      expect(res.statusCode).toBe(201)
      return done()
    }).catch(done)
  })
})
