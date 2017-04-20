const requireDir = require('require-dir')
const models = require('../../models')
const config = requireDir('../../config')
const helpers = requireDir('../../helpers', {recurse: true})
const passport = require('passport')

// Segment server-side tracking
const Analytics = require('analytics-node')
let analytics // placeholder for instantiated client
const pkg = require('../../package.json')

const schemas = require('../../schemas')

module.exports = function attachBrigadeToReq (req, res, next) {
  req.models = models
  req.helpers = helpers
  req.config = config
  req.schemas = {
    flat: schemas.flat,
    raw: schemas.raw
  }
  req.models.Brigade.findOne({}, function (err, results) {
    if (err) throw err
    if (!results) throw new Error('BRIGADE NOT IN DATABASE')
    res.locals = res.locals || {}
    res.locals.brigade = results
    // bootstrap segment tracking
    if (!analytics && res.locals.brigade.auth.segment.writeKey.length) {
      analytics = new Analytics(res.locals.brigade.auth.segment.writeKey)
    }
    req.analytics = analytics || {
      track: () => {
      },
      page: () => {
      },
      identify: () => {
      },
      group: () => {
      },
      alias: () => {
      }
    }

    res.locals.brigade.buildVersion = pkg.version

    res.theme = res.theme || {}
    res.theme.public = `brigadehub-public-${results.theme.public}`
    res.theme.admin = `brigadehub-admin-${results.theme.admin}`

    req.helpers.tokenLoader(passport, res.locals.brigade.auth)
    next()
  })
}
