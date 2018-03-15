const debug = require('debug')('test')

module.exports = async function () {
  // teardown your sandbox environment
  debug('closing test environment')
  await Promise.resolve()
}
