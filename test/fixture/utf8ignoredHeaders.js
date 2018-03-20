const path = require('path')

// GET /

// host: {addr}:{port}
// connection: close

module.exports = function (req, res) {
  res.statusCode = 201

  res.setHeader('content-type', 'text/html')
  res.setHeader('connection', 'close')
  res.setHeader('content-length', '2')

  res.setHeader('x-node-vcr-tape', path.basename(__filename, '.js'))

  res.write(Buffer.from(`OK`, 'utf-8'))
  res.end()

  return __filename
}
