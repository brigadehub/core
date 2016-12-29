const fetchContributors = require('./fetchContributors')
module.exports = function projectsPostFindOne (project, next) {
  fetchContributors(project).then(function (results) {
    project.leads = results.leads
    project.members = results.members
    next(null, project)
  }).catch((err) => {
    next(err)
  })
}
