const saveContributor = require('./saveContributor')
module.exports = function projectsPreSave (next) {
  const project = this
  const saveContributorsCalls = []
  if (project.leads && project.leads.length) {
    for (let leadIndex in project.leads) {
      const lead = project.leads[leadIndex]
      saveContributorsCalls.push(saveContributor('lead', project, lead))
    }
  }
  if (project.members && project.members.length) {
    for (let memberIndex in project.members) {
      const member = project.members[memberIndex]
      saveContributorsCalls.push(saveContributor('project', project, member))
    }
  }
  Promise.all(saveContributorsCalls).then(function (results) {
    if (project.leads) delete project.leads
    if (project.members) delete project.members
    next()
  }).catch((err) => {
    console.error(err)
    next(err)
  })
}
