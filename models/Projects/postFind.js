const fetchContributors = require('./fetchContributors')
module.exports = function projectsPostFind (projects, next) {
  const fetchContributorCalls = []
  for (let index in projects) {
    const project = projects[index]
    fetchContributorCalls.push(fetchContributors(project, index))
  }
  Promise.all(fetchContributorCalls).then((results) => {
    for (let resultIndex in results) {
      const result = results[resultIndex]
      projects[result.index].leads = result.leads
      projects[result.index].members = result.members
    }
    next(null, projects)
  }).catch((err) => {
    next(err)
  })
}
