const _ = require('lodash')
const constructEndpoint = require('./constructEndpoint')
module.exports = function buildOutEndpoints (ctrlList, middleware, app, dynamicRoutes) {
  /**
   * Static param routes.
   */
  for (let ctrlFolderName in ctrlList) {
    const ctrlFolder = ctrlList[ctrlFolderName]
    if (_.isObject(ctrlFolder)) {
      for (let ctrlName in ctrlFolder) {
        const ctrl = ctrlFolder[ctrlName]
        if (ctrl.endpoint) {
          if (ctrl.endpoint.indexOf(':') > -1) {
            const endpointArray = ctrl.endpoint.split(':')
            const dynamicLevel = endpointArray.length - 1
            dynamicRoutes[dynamicLevel] = dynamicRoutes[dynamicLevel] || []
            dynamicRoutes[dynamicLevel].push(ctrl)
          } else {
            constructEndpoint(ctrl, middleware, app)
          }
        }
      }
    }
  }
}
