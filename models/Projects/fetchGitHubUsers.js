
var Users = require('../Users')

module.exports = function fetchGitHubUsers (users, cb) {
  var promiseArray = []
  function getUser (username) {
    return new Promise(function (resolve, reject) {
      Users.findOne({'username': username}, function (err, foundUser) {
        if (err) console.error(err)
        if (foundUser) {
          resolve(foundUser)
        } else {
          resolve(username)
        }
      })
    })
  }
  users.forEach(function (user) {
    promiseArray.push(getUser(user))
  })
  Promise.all(promiseArray).then(function (contactList) {
    cb(contactList)
  })
}
