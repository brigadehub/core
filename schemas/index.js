const { pick, forEach } = require('lodash')
const flatten = require('flat')
const unflatten = flatten.unflatten

const brigade = require('./brigade')
const projects = require('./projects')
const users = require('./users')
const events = require('./events')
const posts = require('./posts')
const checkins = require('./checkins')

const nested = require('../helpers/nested')

function stripForMongoose (schema) {
  const newSchema = {}
  schema = nested.flatten(schema)
  for (let keyIndex in Object.keys(schema)) {
    const key = Object.keys(schema)[keyIndex]
    const value = schema[key]
    let newKey = key.split('.')
    const subKey = newKey.pop()
    newKey = newKey.join('.')
    newSchema[newKey] = newSchema[newKey] || {}
    newSchema[newKey][subKey] = value
  }
  console.log('schema', schema)
  console.log('newSchema', newSchema)
  schema = newSchema
  schema = forEach(schema, (field, key) => schema[key] = pick(field, ['type', 'default']))
  console.log('pick', schema)
  schema = nested.unflatten(schema)
  console.log('unflatten', schema)
  return schema
}

module.exports = {
  brigade: stripForMongoose(brigade),
  projects: stripForMongoose(projects),
  users: stripForMongoose(users),
  events: stripForMongoose(events),
  posts: stripForMongoose(posts),
  checkins: stripForMongoose(checkins),
  raw: {
    brigade,
    projects,
    users,
    events,
    posts,
    checkins
  }
}
