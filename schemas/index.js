const { pick } = require('lodash')
const flatten = require('flat')
const unflatten = flatten.unflatten

const brigade = require('./brigade')
const projects = require('./projects')
const users = require('./users')
const events = require('./events')
const posts = require('./posts')
const checkins = require('./checkins')

function stripForMongoose(schema) {
  console.log(schema)
  schema = flatten(schema, { maxDepth: 2 })
  console.log(schema)
  schema = pick(schema, ['type', 'default'])
  console.log(schema)
  schema = unflatten(schema)
  console.log(schema)
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
