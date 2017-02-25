const constructEndpoint = require('./constructEndpoint')
module.exports = function buildOutDynamicEndpoints (dynamicRoutes, middleware, app, themeConfig) {
  /**
   *  Dynamic param routes
   */
  for (let dynamicLevel in dynamicRoutes) {
    const ctrls = dynamicRoutes[dynamicLevel]
    for (let ctrlIndex in ctrls) {
      const ctrl = ctrls[ctrlIndex]
      if (ctrl.endpoint) {
        constructEndpoint(ctrl, middleware, app, themeConfig)
      }
    }
  }
}
