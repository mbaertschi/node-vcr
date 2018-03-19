const curl = require('../../src/curl')

describe('curl', () => {
  it('formats an http.IncomingRequest', () => {
    const req = {
      httpVersion: '1.1',
      method: 'GET',
      url: 'https://www.flickr.com',
      headers: {
        host: 'www.flickr.com'
      }
    }

    expect(curl.request(req)).toBe(
      '< GET https://www.flickr.com HTTP/1.1\n' +
      '< host: www.flickr.com\n' +
      '<'
    )
  })

  it('formats an http.ServerResponse', () => {
    const req = {
      httpVersion: '1.1'
    }

    const res = {
      statusCode: '200',
      _headers: {
        date: 'Wed, 22 Jun 2016 22:02:31 GMT'
      }
    }

    expect(curl.response(req, res)).toEqual(
      '> HTTP/1.1 200 OK\n' +
      '> date: Wed, 22 Jun 2016 22:02:31 GMT\n' +
      '>'
    )
  })
})
