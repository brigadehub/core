const core = require('./app')
var pkg = require('./package.json')

const bhConfig = {
  dotenv: require('./dotenv')(),
  info: '[Brigadehub Core]',
  version: pkg.version
}
core(bhConfig)
