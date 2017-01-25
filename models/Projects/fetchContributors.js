
var Users = require('../Users')

module.exports = function fetchContributors (project, index) {
  return new Promise((resolve, reject) => {
    if (!project) return resolve({leads: [], members: [], index: index})
    Users.find({ 'teams.project': project.id }, (err, members) => {
      if (err) return reject(err)
      Users.find({ 'teams.lead': project.id }, (err, leads) => {
        if (err) return reject(err)
        resolve({leads: leads, members: members, index: parseInt(index, 10)})
      })
    })
  })
}
