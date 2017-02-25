var _ = require('lodash')
var Users = require('../Users')

module.exports = function clearContributors (project) {
  return new Promise((resolve, reject) => {
    Users.find({ 'teams.project': { $in: [ project.oldId, project.id ] } }, (err, members) => {
      if (err) return reject(err)
      const saveMemberCalls = []
      for (let memberIndex in members) {
        const member = members[memberIndex]
        member.teams.project = _.without(member.teams.project, project.oldId)
        member.teams.project = _.without(member.teams.project, project.id)
        if (member.teams.lead.indexOf(project.oldId) > -1 || member.teams.lead.indexOf(project.id) > -1) {
          member.teams.lead = _.without(member.teams.lead, project.oldId)
          member.teams.lead = _.without(member.teams.lead, project.id)
        }
        saveMemberCalls.push(saveMember(member))
      }
      Promise.all(saveMemberCalls).then(() => {
        Users.find({ 'teams.lead': { $in: [ project.oldId, project.id ] } }, (err, members) => {
          if (err) throw err
          const saveLeadCalls = []
          for (let memberIndex in members) {
            const member = members[memberIndex]
            member.teams.lead = _.without(member.teams.lead, project.oldId)
            member.teams.lead = _.without(member.teams.lead, project.id)
            saveLeadCalls.push(saveMember(member))
          }
          Promise.all(saveLeadCalls).then(resolve).catch(reject)
        })
      }).catch(reject)
    })
  })
}

function saveMember (member) {
  return new Promise((resolve, reject) => {
    member.save(function (err, member) {
      if (err) return reject(err)
      resolve(member)
    })
  })
}
