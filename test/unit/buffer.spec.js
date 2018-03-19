const stream = require('stream')
const buffer = require('../../src/buffer')

describe('buffer', () => {
  it('yields the stream contents', (done) => {
    const str = new stream.PassThrough()

    buffer(str)
      .then((body) => {
        expect(body).toEqual([
          Buffer.from('a'),
          Buffer.from('b'),
          Buffer.from('c')
        ])
        return done()
      })
      .catch(done)

    str.write('a')
    str.write('b')
    str.write('c')
    str.end()
  })

  it('yields an error', (done) => {
    const str = new stream.PassThrough()

    buffer(str)
      .then(() => {
        return done(new Error('should have yielded an error'))
      })
      .catch((error) => {
        expect(error.message).toBe('boom')
        return done()
      })

    str.emit('error', new Error('boom'))
  })
})
