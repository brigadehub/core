var Users = require('../Users')

module.exports = function fetchUser (checkin, index) {
  return new Promise((resolve, reject) => {
    if (!checkin || !checkin.githubUsername || !checkin.githubUsername.length) return resolve({user: {}, index})
    Users.findOne({ username: checkin.githubUsername }, (err, user) => {
      if (err) return reject(err)
      resolve({user, index: parseInt(index, 10)})
    })
  })
}
