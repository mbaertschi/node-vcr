const fse = require('fs-extra')
const path = require('path')

const load = (sufix) => {
  return fse.readFileSync(path.join(__dirname, `${sufix}.js`), 'utf8')
}

module.exports = load
