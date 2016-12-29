var mongoose = require('mongoose')
mongoose.Promise = global.Promise

var passport = require('passport')
var getProp = require('@f/get-prop')

var brigadeSchema = require('../schemas/brigade')
brigadeSchema.pre('save', function (next) {
  const brigade = this
  console.log(
    passport,
    getProp('_strategies', passport),
    getProp('_strategies.github', passport),
    getProp('_strategies.github._callbackURL', passport),
    getProp('_strategies.github._oauth2._clientId', passport),
    getProp('_strategies.github._oauth2._clientSecret', passport)
  )
  if (getProp('_strategies.github._oauth2._clientId', passport)) {
    passport._strategies.github._oauth2._clientId = brigade.auth.github.clientId
    passport._strategies.github._oauth2._clientSecret = brigade.auth.github.clientSecret
    passport._strategies.github._callbackURL = brigade.url + '/auth/github/callback'
    console.log(passport._strategies.github)
  }
  next()
})
module.exports = mongoose.model('Brigade', brigadeSchema)
