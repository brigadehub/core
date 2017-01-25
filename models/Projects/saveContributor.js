
var _ = require('lodash')
var Users = require('../Users')

module.exports = function saveContributor (type, project, contributorUsername) {
  return new Promise((resolve, reject) => {
    Users.findOne({ username: contributorUsername }, (err, member) => {
      if (err) return reject(err)
      member.teams[type].push(project.id)
      if (project.oldId !== project.id) member.teams[type] = _.without(member.teams[type], project.oldId)
      member.teams[type] = _.uniq(member.teams[type])
      member.save(function (err, member) {
        if (err) return reject(err)
        resolve(member)
      })
    })
  })
}
