const sanitizeHeader = (header) => {
  if (Array.isArray(header)) {
    header = header.map((value) => {
      return value.replace(/'/g, '\\\'')
    })
  } else if (typeof header === 'string') {
    header = header.replace(/'/g, '\\\'')
  }

  return header
}

const render = (req, res, body, encoding, ignoredHeaders, reqBody) => {
  let template =
`const path = require('path')

// ${req.method} ${decodeURIComponent(req.path)}

`

  Object.keys(req._headers)
    .filter((key) => ignoredHeaders.indexOf(key) === -1)
    .forEach((key) => {
      template +=
`// ${key}: ${sanitizeHeader(req._headers[key])}
`
    })

  if (reqBody) {
    template +=
`
// Request Body:
`
    reqBody.split('\n').forEach((line) => {
      template +=
`// ${line}
`
    })
  }

  template +=
`
module.exports = function (req, res) {
  res.statusCode = ${JSON.stringify(res.statusCode)}
`

  Object.keys(res.headers)
    .filter((key) => ignoredHeaders.indexOf(key) === -1)
    .forEach((key) => {
      template +=
`
  res.setHeader('${key}', '${sanitizeHeader(res.headers[key])}')`
    })

  template +=
`

  res.setHeader('x-node-vcr-tape', path.basename(__filename, '.js'))
`

  template +=
`
  res.write(Buffer.from(\`${body}\`, '${encoding}'))`

  template +=
`
  res.end()

  return __filename
}
`

  return template
}

module.exports = {
  render
}
