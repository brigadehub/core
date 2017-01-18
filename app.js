require('app-module-path/register')
require('node-version-checker')

/**
 * Module dependencies.
 */
const express = require('express')
const _ = require('lodash')
const cookieParser = require('cookie-parser')
const compress = require('compression')
const favicon = require('serve-favicon')
const session = require('express-session')
const ejwt = require('express-jwt')
const jwtsecret = process.env.JWT_SECRET || 'sUp3r$3creT'
// const graphqlHTTP = require('express-graphql')
const bodyParser = require('body-parser')
const logger = require('morgan')
const errorHandler = require('errorhandler')
const lusca = require('lusca')
const methodOverride = require('method-override')
const MongoStore = require('connect-mongo/es5')(session)
const flash = require('express-flash')
const passport = require('passport')
const expressValidator = require('express-validator')
const sass = require('node-sass-middleware')
const path = require('path')
const requireDir = require('require-dir')
const pkg = require('./package.json')
const isUrl = require('is-url')


require('colors')

let controllers
let middleware
const helpers = requireDir('./helpers', {recurse: true})
let models
let config
let brigadeDetails
let info = '[Brigadehub Core]'.yellow

module.exports = function (opts) {
  if (opts.info) info = opts.info.yellow
  console.log("                      \u2590\u2593\u2580\u2593\u2580\u2593\u2580\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593              \u2584\u2584\u2584                 \r\n                      \u2590\u2593\u2584\u2593\u2584\u2593\u2584\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593            \u2584\u2593\u2593\u2593                 \r\n              \u2593\u2593\u2593\u2593\u2593   \u2590\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593           \u2553\u2593\u2593\u2593   \u2552\u2593\u2593\u2584\u2584          \r\n          \u2584\u2593\u2593\u2593\u2593\u2593\u2593     \u2590\u2593\u2593\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2593\u2593\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2593\u2593\u2593          \u2554\u2593\u2593\u2593     \u2580\u2588\u2593\u2593\u2593\u2593\u2584\u2584      \r\n      \u2584\u2584\u2593\u2593\u2593\u2593\u2588\u2580\u2518       \u2590\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593          \u2590\u2593\u2593         \u2584\u2593\u2593\u2588         \u2559\u2580\u2588\u2593\u2593\u2593\u2593\u2584\u2584  \r\n    \u2593\u2593\u2593\u2593\u2593\u2593\u2593           \u2590\u2593\u2593\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2593\u2593          \u2590\u2593\u2593        \u2584\u2593\u2593\u2588              \u2559\u2593\u2593\u2593\u2593\u2593\u2593\r\n      \u2580\u2588\u2593\u2593\u2593\u2593\u2593\u2584        \u2590\u2593\u2593\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2580\u2593\u2593          \u2590\u2593\u2593       \u2584\u2593\u2593\u2588            ;\u2584\u2593\u2593\u2593\u2593\u2588\u2580\u2559 \r\n          \u2580\u2588\u2593\u2593\u2593\u2593\u2593\u2584    \u2590\u2593\u2593\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2593\u2593\u2593      \u2584\u2593\u2593\u2588         ,\u2584\u2593\u2593\u2593\u2593\u2588\u2580\u2580     \r\n              \u2593\u2593\u2593\u2593\u258C   \u2590\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593     \u2584\u2593\u2593\u2588         \u2590\u2593\u2593\u2593\u2580\u2580.        \r\n                      \u2590\u2593\u2593\u2593\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2584\u2593\u2593\u2593    \u2584\u2593\u2593\u2588            \u00AC            \r\n                      \u2590\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593   \u2588\u2580\u2580                          \r\n __                                      __          __               __        \r\n/\\ \\             __                     /\\ \\        /\\ \\             /\\ \\       \r\n\\ \\ \\____  _ __ /\\_\\     __      __     \\_\\ \\     __\\ \\ \\___   __  __\\ \\ \\____  \r\n \\ \\ '__`\\/\\`'__\\/\\ \\  /'_ `\\  /'__`\\   /'_` \\  /'__`\\ \\  _ `\\/\\ \\/\\ \\\\ \\ '__`\\ \r\n  \\ \\ \\L\\ \\ \\ \\/ \\ \\ \\/\\ \\L\\ \\/\\ \\L\\.\\_/\\ \\L\\ \\/\\  __/\\ \\ \\ \\ \\ \\ \\_\\ \\\\ \\ \\L\\ \\\r\n   \\ \\_,__/\\ \\_\\  \\ \\_\\ \\____ \\ \\__/.\\_\\ \\___,_\\ \\____\\\\ \\_\\ \\_\\ \\____/ \\ \\_,__/\r\n    \\/___/  \\/_/   \\/_/\\/___L\\ \\/__/\\/_/\\/__,_ /\\/____/ \\/_/\\/_/\\/___/   \\/___/ \r\n                         /\\____/                                                \r\n                         \\_/__/      ")
  console.log(`${info} v${opts.version || pkg.version}`)

  process.env.DB_INSTANTIATED = ''

  if (!opts.dotenv) {
    console.log('Loading core .env')
    require('./dotenv.js')()
  } else {
    console.log('.env provided')
  }

  controllers = requireDir('./controllers', {recurse: true})
  middleware = requireDir('./middleware', {recurse: true})
  models = require('./models')
  config = requireDir('./config')

  var app = express()

  helpers.bootstrapDatabase(opts.brigade, startServer)

  function startServer (brigade) {
    var Brigade = require('./models/Brigade')
    brigadeDetails = brigade

    const publicThemeLocation = brigade.theme.public ? path.join(process.cwd(), 'node_modules', `brigadehub-public-${brigadeDetails.theme.public}`) : false
    const adminThemeLocation = brigade.theme.admin ? path.join(process.cwd(), 'node_modules', `brigadehub-admin-${brigadeDetails.theme.admin}`) : false

    const publicControllers = publicThemeLocation ? requireDir(`${publicThemeLocation}/controllers`, {recurse: true}) : {}
    const adminControllers = adminThemeLocation ? requireDir(`${adminThemeLocation}/controllers`, {recurse: true}) : {}

    const publicFileList = publicThemeLocation ? helpers.bootstrap.listAllFiles(`${publicThemeLocation}/public`) : []
    const adminFileList = adminThemeLocation ? helpers.bootstrap.listAllFiles(`${adminThemeLocation}/public`) : []
    let redirectBlacklist = [
      'api/',
      'auth/',
      'login',
      'logout',
      'favicon',
      '.css',
      '.js',
      '.min',
      '.map',
      '.eot',
      '.svg',
      '.ttf',
      '.woff',
      '.woff2',
      '.otf',
      '.jpg',
      '.png',
      '.scss'
    ]
    redirectBlacklist = redirectBlacklist.concat(publicFileList).concat(adminFileList)
    redirectBlacklist = redirectBlacklist.sort()
    redirectBlacklist = _.uniq(redirectBlacklist)


    /**
     * Express configuration.
     */

    app.set('port', process.env.PORT || 5465)
    app.set('jwtsecret', jwtsecret)
    app.set('query parser', 'simple') // for mortimer mongoose rest apis

    // set theme view settings if present
    let adminApp
    if (publicThemeLocation || adminThemeLocation) {
      app.set('views', path.join(process.cwd(), 'node_modules'))
      app.set('view engine', 'pug')
      app.use(flash())
      app.use(sass({
        src: path.join(publicThemeLocation, 'public'),
        dest: path.join(publicThemeLocation, 'public'),
        debug: true,
        sourceMap: true,
        outputStyle: 'expanded'
      }))
    }
    if (adminThemeLocation) {
      adminApp = express()
      adminApp.set('views', path.join(process.cwd(), 'node_modules'))
      adminApp.set('view engine', 'pug')
      adminApp.use(flash())
      adminApp.use(sass({
        src: path.join(adminThemeLocation, 'public'),
        dest: path.join(adminThemeLocation, 'public'),
        debug: true,
        sourceMap: true,
        outputStyle: 'expanded'
      }))
    }

    // set locals functions for use in view renderer
    app.locals.capitalize = function (value) {
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
    app.locals.plural = function (value) {
      if (value[value.length - 1] === 's') {
        return value + 'es'
      }
      return value + 's'
    }
    app.locals.isUrl = isUrl

    // general middleware
    app.use(compress())
    app.use(logger('dev'))
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(expressValidator())
    app.use(methodOverride())
    app.use(cookieParser())

    // set up session
    app.use(session({
      resave: true,
      saveUninitialized: true,
      secret: process.env.SESSION_SECRET,
      store: new MongoStore({
        url: process.env.MONGODB_URI,
        autoReconnect: true
      })
    }))

    app.use(middleware.bootstrap.checkDB)
    app.use(middleware.bootstrap.attachBrigadeToReq)

    // start passport + sessions
    app.use(passport.initialize())
    app.use(passport.session())

    app.use(middleware.bootstrap.attachPaths(redirectBlacklist))
    app.use(middleware.bootstrap.noThemeNotify(publicThemeLocation, adminThemeLocation))
    app.use(middleware.bootstrap.attachUser)

    /**
     * Initial Application configuration.
     */

    app.use(middleware.bootstrap.initConfig)
    app.get('/init/configure', function (req, res) {
      res.sendFile(path.resolve(__dirname, './config/configure.html'))
    })

    app.post('/init/configure', function (req, res) {
      res.locals.brigade.auth.github.clientId = req.body.GITHUB_ID
      res.locals.brigade.auth.github.clientSecret = req.body.GITHUB_SECRET
      res.locals.brigade.url = req.body.base_url
      res.locals.brigade.save(function (err, brigade) {
        if (err) throw err
        res.redirect('/')
      })
    })

    /**
     * Authorization routes
     */

    app.get('/auth/github', passport.authenticate('github', {
      scope: [ 'user:email', 'public_repo' ]
    }))
    app.get('/auth/github/elevate', middleware.passport.elevateScope)
    app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), function (req, res) {
      res.redirect(req.session.returnTo || '/')
    })
    app.get('/auth/meetup', passport.authenticate('meetup', { scope: ['basic', 'rsvp'] }))
    app.get('/auth/meetup/callback', passport.authenticate('meetup', { failureRedirect: '/account' }), function (req, res) {
      res.redirect(req.session.returnTo || '/account')
    })

    /**
     *  Dynamically Generated Routes
     */

    let dynamicRoutes = {}
    helpers.bootstrap.buildOutEndpoints(controllers, middleware, app, dynamicRoutes)
    helpers.bootstrap.buildOutDynamicEndpoints(dynamicRoutes, middleware, app)
    // don't require csrf for api endpoints ^
    app.use(lusca({
      csrf: true,
      xframe: 'SAMEORIGIN',
      xssProtection: true
    }))
    // but do for everything else
    dynamicRoutes = {}
    if (publicThemeLocation) helpers.bootstrap.buildOutEndpoints(publicControllers, middleware, app, dynamicRoutes)
    if (adminThemeLocation) helpers.bootstrap.buildOutEndpoints(adminControllers, middleware, adminApp, dynamicRoutes)
    helpers.bootstrap.buildOutDynamicEndpoints(dynamicRoutes, middleware, app)
    if (adminThemeLocation) {
      helpers.bootstrap.buildOutDynamicEndpoints(dynamicRoutes, middleware, adminApp)
      app.use('/admin', adminApp );
    }


    app.use(errorHandler())
    if (publicThemeLocation) {
      app.use(sass({
        src: path.join(publicThemeLocation, 'public'),
        dest: path.join(publicThemeLocation, 'public'),
        debug: true,
        sourceMap: true,
        outputStyle: 'expanded'
      }))
    }
    if (adminThemeLocation) {
      adminApp.use(sass({
        src: path.join(adminThemeLocation, 'public'),
        dest: path.join(adminThemeLocation, 'public'),
        debug: true,
        sourceMap: true,
        outputStyle: 'expanded'
      }))
    }
    app.use(middleware.bootstrap.brigadeRedirects)
    if (publicThemeLocation) {
      app.use(favicon(path.join(publicThemeLocation, 'public', 'favicon.png')))
      app.use(express.static(path.join(publicThemeLocation, 'public'), { maxAge: 31557600000 }))
    }
    if (adminThemeLocation) adminApp.use(express.static(path.join(adminThemeLocation, 'public'), { maxAge: 31557600000 }))
    app.listen(app.get('port'), function () {
      console.log(`${info} Server listening on port ${app.get('port')}`)
    })
    return app
  }
}
