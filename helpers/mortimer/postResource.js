const Posts = require('../../models/Posts')
const AfterResourceHook = require('./afterResourceHook')
class PostsResource extends AfterResourceHook {
  constructor () {
    super(Posts)
  }
  // This method implements the counting routine.
  after (tag) {
    return function (req, res, next) {
      // console.log('running', req.mrt.result, req.user)
      // TODO: edit req.mrt.result to sanitize returns
      req.mrt.result = req.mrt.result.map((post) => {
        post = post.toObject()
        return post
      })
      next()
    }
  }
}
const postResource = new PostsResource(Posts)

module.exports = postResource
