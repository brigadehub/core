const _ = require('lodash')
module.exports = function brigadeRedirects (req, res, next) {
  if (_.filter(res.locals.brigade.redirects, {endpoint: req.path}).length) {
    var redirect = _.filter(res.locals.brigade.redirects, {endpoint: req.path})[0]
    if (redirect.type === 'permanent') {
      return res.redirect(301, redirect.destination)
    }
    return res.redirect(redirect.destination)
  }
  next()
}
