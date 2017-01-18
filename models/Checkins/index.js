var mongoose = require('mongoose')
mongoose.Promise = global.Promise

const Users = require('../Users')

const syncUser = require('./syncUser')

var checkinSchema = require('../../schemas/checkins')
const fetchUser = require('./fetchUser')

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

checkinSchema.post('find', function (checkins, next) {
  // check username presense + for corresponding user
  const fetchUserCalls = []
  for (let index in checkins) {
    const checkin = checkins[index]
    fetchUserCalls.push(fetchUser(checkin, index))
  }
  Promise.all(fetchUserCalls).then((results) => {
    console.log('after promises', results)
    for (let resultIndex in results) {
      const result = results[resultIndex]
      checkins[result.index].user = result.user
      checkins[result.index].userPresent = !!result.user
    }
    console.log(checkins)
    next(null, checkins)
  }).catch((err) => {
    next(err)
  })
})

checkinSchema.post('findOne', function (checkin, next) {
  // check username presence + for corresponding user
  fetchUser(checkin).then(function (results) {
    console.log('after promise')
    checkin.user = results.user
    checkin.userPresent = !!results.user
    next(null, checkin)
  }).catch((err) => {
    next(err)
  })
})
module.exports = mongoose.model('Checkins', checkinSchema)
