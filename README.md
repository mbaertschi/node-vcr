# Node VCR
<!-- circleci status -->
<a href="https://github.com/mbaertschi/node-vcr">
  <img src="https://circleci.com/gh/mbaertschi/node-vcr.svg?style=shield&circle-token=bcaf10afef571e25d54c781f910431cb4c3cdb0c" alt="Build Status">
</a>
<!-- Dependency Status -->
<a href="https://david-dm.org/mbaertschi/node-vcr">
  <img src="https://david-dm.org/mbaertschi/node-vcr.svg" alt="Dependency Status" />
</a>
<!-- devDependency Status -->
<a href="https://david-dm.org/mbaertschi/node-vcr?type=dev">
  <img src="https://david-dm.org/mbaertschi/node-vcr/dev-status.svg" alt="devDependency Status" />
</a>
[![NPM version](https://badge.fury.io/js/badge-list.svg)](http://badge.fury.io/js/badge-list)

Record HTTP interactions The Node Way™. Inspired by ruby's [vcr][1] and heavily based on [flickr/yakbak][2] and [ijpiantanida/talkback][3].

## Installation
```bash
$ npm install node-vcr --save-dev
```

## Code Documentation
Please refer to the [github wiki page](https://mbaertschi.github.io/node-vcr/)

## Usage
The main idea behind testing HTTP clients with node-vcr is:

1. Make your client's target host configurable
2. Set up a node-vcr server locally to proxy the target host
3. Point your client at the node-vcr server.

Then develop or run your tests. If a recorded HTTP request is found on disk, it will be played back instead of hitting the target host. If no recorded request is found, the request will be forwarded to the target host and recorded to disk (or return 404).

```javascript
const crypto = require('crypto')
const http = require('http')
const nodeVcr = require('node-vcr')
const path = require('path')
const _ = require('lodash')

const proxyTarget = 'https://api.github.com/users/mbaertschi/orgs'
const dirname = path.join(__dirname, 'playback')
const port = 8888

const hash = (req, body) => {
  const action = `${req.method.toLowerCase()}_${_.last(req.url.split('/'))}`
  const content = body.toString()
  const md5sum = crypto.createHash('md5')

  return `${action}_${md5sum.update(content).digest('hex')}`
}

const handler = nodeVcr(proxyTarget, {
  dirname,
  hash
})

const server = http.createServer(handler)
server.listen(port)
```

### Options
| Name | Type | Description | Default |
| --- | --- | --- | --- |
| **host** | String | The proxy target to tape | |
| **dirname** | String | The tapes directory | `./tapes/`
| **noRecord** | Boolean | If true, requests will return a 404 error if the tape doesn't exist | `false` |
| **maxRedirects** | Number | Number of max http redirects. 0 means no redirects | `5` |
| **hash** | Function | Provide your own IncomingMessage hash function of the signature `function (req, body)` | `see source` |

## Tech-Stack
- [nodemon](https://github.com/remy/nodemon) development mode
- [jest](https://facebook.github.io/jest/) test environment
- [jsdoc](http://usejsdoc.org/) documentation
- [npm-check](https://www.npmjs.com/package/npm-check) for dependencies check
- [pre-commit](https://www.npmjs.com/package/pre-commit) for pre git commit hooks
- [babel](https://babeljs.io/) to compile to es2015

## Scripts
```bash
# start development mode with nodemon
yarn dev
# run tests with jest
yarn test
# start continous integration testing with jest
yarn ci
# generate the jsdoc documentation
yarn jsdoc
# run eslint
yarn lint
# check for dependendies updates
yarn deps
# build with babel
yarn build
```

## License
MIT

[1]: https://github.com/vcr/vcr
[2]: https://github.com/flickr/yakbak
[3]: https://github.com/ijpiantanida/talkback
