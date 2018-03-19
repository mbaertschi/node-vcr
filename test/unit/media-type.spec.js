const mediaType = require('../../src/media-type')

describe('media-type', () => {
  describe('isHumanReadable', () => {
    it('returns false when the content-type is not set', () => {
      const res = { headers: { } }

      expect(mediaType.isHumanReadable(res)).toBeFalsy()
    })

    it("returns true when the content-type is human readable and there's no content-encoding", () => {
      const res = {
        headers: {
          'content-type': ['application/json']
        }
      }

      expect(mediaType.isHumanReadable(res)).toBeTruthy()
    })

    it('returns false when the content-type is not human readable', () => {
      const res = {
        headers: {
          'content-type': ['img/png']
        }
      }

      expect(mediaType.isHumanReadable(res)).toBeFalsy()
    })

    it('returns true when the content-type is human readable and the content-encoding is identity', () => {
      const res = {
        headers: {
          'content-encoding': ['identity'],
          'content-type': ['application/json']
        }
      }

      expect(mediaType.isHumanReadable(res)).toBeTruthy()
    })

    it('returns false when the content-type is human readable and the content-encoding is gzip', () => {
      const res = {
        headers: {
          'content-encoding': ['gzip'],
          'content-type': ['application/json']
        }
      }

      expect(mediaType.isHumanReadable(res)).toBeFalsy()
    })
  })
})
