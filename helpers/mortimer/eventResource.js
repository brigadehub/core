const Events = require('../../models/Events')
const AfterResourceHook = require('./afterResourceHook')
class EventsResource extends AfterResourceHook {
  constructor () {
    super(Events)
  }
  // This method implements the counting routine.
  after (tag) {
    return function (req, res, next) {
      // console.log('running', req.mrt.result, req.user)
      // TODO: edit req.mrt.result to sanitize returns
      req.mrt.result = req.mrt.result.map((event) => {
        event = event.toObject()
        return event
      })
      next()
    }
  }
}
const eventResource = new EventsResource(Events)

module.exports = eventResource
