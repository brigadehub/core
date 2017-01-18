const Checkins = require('../../models/Checkins')
const mortimer = require('mortimer')
const AfterResourceHook = require('./afterResourceHook')
class CheckinsResource extends AfterResourceHook {
  constructor () {
    super(Checkins)
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
      req.mrt.result = req.mrt.result.map((checkin) => {
        checkin = checkin.toObject()
        delete checkin.user.jwt
        delete checkin.user.tokens
        return checkin
      })
      next()
    }
  }
}
const checkinResource = new CheckinsResource(Checkins)

module.exports = checkinResource
