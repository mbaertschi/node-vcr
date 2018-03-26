const render = (req, res, body, encoding, ignoredHeaders, reqBody) => {
  let template =
`const path = require('path')

// ${req.method} ${decodeURIComponent(req.path)}

`

  Object.keys(req._headers)
    .filter((key) => ignoredHeaders.indexOf(key) === -1)
    .forEach((key) => {
      template +=
`// ${key}: ${req._headers[key].replace(/'/g, '\\\'')}
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
  res.setHeader('${key}', '${res.headers[key].replace(/'/g, '\\\'')}')`
    })

  template +=
`

  res.setHeader('x-node-vcr-tape', path.basename(__filename, '.js'))
`

  body.forEach((data) => {
    template +=
`
  res.write(Buffer.from(\`${data}\`, '${encoding}'))`
  })

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
