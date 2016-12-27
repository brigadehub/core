var mongoose = require('mongoose')
mongoose.Promise = global.Promise

var passport = require('passport')
var getProp = require('@f/get-prop')

var brigadeSchema = new mongoose.Schema({
  name: {type: String, default: ''},
  slug: {type: String, default: ''},
  heroImage: {type: String, default: ''},
  recoveryEmail: {type: String, default: ''},
  checkIn: {
    day: {type: String, default: ''},
    urlLink: {type: String, default: ''}
  },
  location: {
    general: {type: String, default: ''},
    specific: {type: String, default: ''},
    geo: {type: String, default: ''},
    timezone: {type: String, default: 'America/Los_Angeles'}
  },
  url: {type: String, default: ''},
  github: {type: String, default: ''},
  slack: {type: String, default: 'http://c4a.me/cfsfslack'},
  slackcount: {type: Number, default: 0},
  brigadecount: {type: Number, default: 0},
  meetup: {type: String, default: 'Code-for-San-Francisco-Civic-Hack-Night'},
  blog: {
    jekyll: {type: String, default: ''},
    wordpress: {type: String, default: ''},
    medium: {type: String, default: ''}
  },
  redirects: {type: Array, default: []},
  theme: {
    public: {type: String, default: ''},
    admin: {type: String, default: ''},
    slug: {type: String, default: ''},
    logo: {type: String, default: ''},
    page: {
      title: {type: Boolean, default: false},
      events: {type: Boolean, default: true},
      projects: {type: Boolean, default: true},
      blog: {type: Boolean, default: true},
      about: {type: Boolean, default: true},
      login: {type: Boolean, default: true},
      external: {type: Array, default: []}
    }
  },
  copy: {
    tagline: {type: String, default: ''},
    description: {type: String, default: ''}
  },
  sponsors: {type: Array, default: []},
  landingstats: {type: Array, default: []},
  displayedstats: {type: Array, default: []},
  auth: {
    segment: {
      writeKey: {type: String, default: ''}
    },
    github: {
      clientId: {type: String, default: ''},
      clientSecret: {type: String, default: ''}
    },
    slack: {
      clientId: {type: String, default: ''},
      clientSecret: {type: String, default: ''}
    },
    meetup: {
      consumerKey: {type: String, default: ''},
      consumerSecret: {type: String, default: ''}
    },
    google: {
      analyticsId: {type: String, default: ''},
      clientId: {type: String, default: ''},
      clientSecret: {type: String, default: ''}
    },
    email: {
      user: {type: String, default: ''},
      password: {type: String, default: ''}
    }
  },
  auditLog: {type: Array, default: []}
})
brigadeSchema.pre('save', function (next) {
  const brigade = this
  if (getProp('_strategies.github._oauth2._clientId', passport)) {
    passport._strategies.github._oauth2._clientId = brigade.auth.github.clientId
    passport._strategies.github._oauth2._clientSecret = brigade.auth.github.clientSecret
  }
  next()
})
module.exports = mongoose.model('Brigade', brigadeSchema)
