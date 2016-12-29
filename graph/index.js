const MTGQL = require('mongoose-schema-to-graphql').default
const schemas = require('../schemas')
console.log(schemas)
const _ = require('lodash')

const mtgqlConfigs = {}
const mtgqlSchemas = {}

_.forEach(schemas, (schema, key) => {
  if (key === 'graph') return
  mtgqlConfigs[key] = {}
  mtgqlConfigs[key] = schemas.graph[key]
  mtgqlConfigs[key].schema = schema
  mtgqlSchemas[key] = {}
  mtgqlSchemas[key] = MTGQL(mtgqlConfigs[key])
})
console.log(mtgqlSchemas)
module.exports = mtgqlSchemas.users
