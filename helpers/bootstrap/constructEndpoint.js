const ejwt = require('express-jwt')
const fromHeaderOrQuerystring = require('../fromHeaderOrQuerystring')
/**
 * constructEndpoint - Instantiate express routes
 *
 * @param  {Object} ctrl controller object
 * @param  {Object} app  Express Application
 */
function constructEndpoint (ctrl, middleware, app) {
  let ctrlParams = [ctrl.endpoint]
  const jwtsecret = app.get('jwtsecret')
  if (ctrl.jwt) {
    ctrlParams.push(ejwt({
      secret: jwtsecret,
      userProperty: 'tokenPayload',
      getToken: fromHeaderOrQuerystring
    }))
    ctrlParams.push(middleware.jwtLoadUser)
  }
  if (ctrl.authenticated) ctrlParams.push(middleware.passport.isAuthenticated)
  if (ctrl.roles) ctrlParams.push(middleware.passport.checkRoles(ctrl.roles))
  if (ctrl.scopes) ctrlParams.push(middleware.passport.checkScopes(ctrl.scopes))

  // set other middleware
  ctrl.middleware = ctrl.middleware.map(function (mwName) {
    return middleware[mwName]
  })
  ctrlParams = ctrlParams.concat(ctrl.middleware)

  // set final controller
  ctrlParams.push(ctrl.controller)

  // apply configuration and run on express
  app[ctrl.method].apply(app, ctrlParams)
}

module.exports = constructEndpoint
