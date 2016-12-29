module.exports = {
  name: 'users',
  description: 'User schema',
  class: 'GraphQLObjectType',
  exclude: ['_id','tokens','jwt']
}
