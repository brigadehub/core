const Posts = require('../../models/Posts')
const mortimer = require('mortimer')
const AfterResourceHook = require('./afterResourceHook')
class PostsResource extends AfterResourceHook {
  constructor () {
    super(Posts)
  }
  // This method implements the counting routine.
  after (tag) {
    // console.log('arguments', arguments, this)
    if (!this.counters) {
      this.counters = {}
    }
    if (!this.counters[tag]) {
      this.counters[tag] = 0
    }
    var that = this
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
