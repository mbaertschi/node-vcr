const debug = require('debug')('test')

debug('setup global test configurations')
// setup your global test environment
global.integration = 'integration'
global.unit = 'unit'

require('jest-plugins')([
  'jest-plugins-recommended'
])
