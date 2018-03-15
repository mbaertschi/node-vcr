const NodeEnvironment = require('jest-environment-node')
const debug = require('debug')('test')

class Sandbox extends NodeEnvironment {
  async setup () {
    debug('setup sandbox')
    await super.setup()
  }

  async teardown () {
    debug('closing sandbox')
    await super.teardown()
  }

  runScript (script) {
    return super.runScript(script)
  }
}

module.exports = Sandbox
