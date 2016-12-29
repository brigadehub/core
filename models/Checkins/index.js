var mongoose = require('mongoose')
mongoose.Promise = global.Promise

const Users = require('../Users')

const syncUser = require('./syncUser')

var checkinSchema = require('../../schemas/checkins')

checkinSchema.post('save', function (doc, next) {
  // check username presence + for corresponding user
  if (!doc.githubUsername || !doc.githubUsername.length) return next()
  Users.findOne({ username: doc.githubUsername }, (err, user) => {
    if (err) throw err
    if (!user) user = new Users()
    syncUser(doc, user).then(next).catch((err) => {
      console.log(err)
      next()
    })
  })
})

module.exports = mongoose.model('Checkins', checkinSchema)
