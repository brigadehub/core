const fetchContributors = require('./fetchContributors')
const fetchGithubActivity = require('./fetchGithubActivity')

module.exports = function projectsPostFindOne (project, next) {
  if (!project) return next(null, project)
  fetchGithubActivity(project)
    .then((activity) => {
      if (activity) { // save this asyncronously
        project.recentGithubActivity = activity
        project.save((err, results) => {
          if (err) return console.log('ERROR SAVING ACTIVITY', err)
          console.log(`saved activity data for ${project.id}`)
        })
      }
      return fetchMembers(project, next)
    })
    .catch(err => {
      console.log(err)
      return fetchMembers(project, next)
    })

}

function fetchMembers(project, next) {
  return fetchContributors(project).then(function (results) {
    project.leads = results.leads
    project.members = results.members
    next(null, project)
  }).catch(next)
}
