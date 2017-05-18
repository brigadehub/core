const { pick, forEach } = require('lodash')

const brigade = require('./brigade')
const projects = require('./projects')
const users = require('./users')
const events = require('./events')
const posts = require('./posts')
const checkins = require('./checkins')

const nested = require('../helpers/nested')

function stripForMongoose (schema) {
  const newSchema = flattenSchema(schema)
  schema = newSchema
  schema = forEach(schema, (field, key) => { schema[key] = pick(field, ['type', 'default']) })
  schema = nested.unflatten(schema)
  return schema
}

function flattenSchema (schema) {
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
  return newSchema
}

module.exports = {
  brigade: stripForMongoose(brigade),
  projects: stripForMongoose(projects),
  users: stripForMongoose(users),
  events: stripForMongoose(events),
  posts: stripForMongoose(posts),
  checkins: stripForMongoose(checkins),
  flat: {
    brigade: flattenSchema(brigade),
    projects: flattenSchema(projects),
    users: flattenSchema(users),
    events: flattenSchema(events),
    posts: flattenSchema(posts),
    checkins: flattenSchema(checkins)
  },
  raw: {
    brigade,
    projects,
    users,
    events,
    posts,
    checkins
  }
}
