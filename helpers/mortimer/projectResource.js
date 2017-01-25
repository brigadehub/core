const Projects = require('../../models/Projects')
const AfterResourceHook = require('./afterResourceHook')
class ProjectsResource extends AfterResourceHook {
  constructor () {
    super(Projects)
  }
  // This method implements the counting routine.
  after (tag) {
    return function (req, res, next) {
      // console.log('running', req.mrt.result, req.user)
      // TODO: edit req.mrt.result to sanitize returns
      req.mrt.result = req.mrt.result.map((project) => {
        project = project.toObject()
        return project
      })
      next()
    }
  }
}
const projectResource = new ProjectsResource(Projects)

module.exports = projectResource
