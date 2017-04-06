const mongoose = require('mongoose')

module.exports = {
  id: {
    type: String,
    default: '',
    description: 'Unique identifier for your brigade on the BrigadeHub network.',
    modelName: 'Brigade'
  },
  name: {
    type: String,
    default: '',
    description: 'Name of your brigade. Shows in the title of the browser and in social media.',
    label: 'Brigade Name',
    public: true
  },
  slug: {
    type: String,
    description: 'A slugified version of the name. Used internally within BrigadeHub.',
    default: ''
  },
  heroImage: {
    type: String,
    default: '',
    description: 'A fully qualified url to the image displayed on the main page of the brigade website.',
    label: 'Landing Page Image',
    public: true,
    fieldType: 'imageUrl',
    futureModel: 'plugins:theme:public'
  },
  recoveryEmail: {
    type: String,
    default: '',
    description: 'A recovery email for the BrigadeHub installation',
    label: 'Recovery Email',
    fieldType: 'email',
    futureModel: 'application'
  },
  checkIn: {
    day: {
      type: String,
      default: '',
      description: '[DEPRECATED] Day of the week to checkin. Superceded by event-specific checkins'
    },
    urlLink: {
      type: String,
      default: '',
      description: '[DEPRECATED] Link to checkin. Superceded by event-specific checkins'
    }
  },
  location: {
    general: {
      type: String,
      default: '',
      description: 'General location of your brigade. e.g. "San Francisco, CA"',
      label: 'General Location',
      public: true
    },
    specific: {
      type: String,
      default: '',
      description: 'Specific address of your brigade. e.g. "155 9th Street, San Francisco, CA, 94103"',
      label: 'Address',
      public: true
    },
    geo: {
      type: String,
      default: '',
      description: 'Geo Location of your brigade. e.g. "37.775641, -122.413649"',
      label: 'Lat/Lon',
      public: true
    },
    timezone: {
      type: String,
      default: 'America/Los_Angeles',
      description: 'Timezone of your brigade. Used for Events.',
      label: 'Timezone',
      public: true,
      fieldType: 'timezone',
      futureModel: 'application'
    }
  },
  url: {
    type: String,
    default: 'http://localhost:5465',
    description: 'URL to the base installation of brigadehub. Used in OAuth for callback uris. e.g. http://codeforsanfrancisco.org',
    label: 'Installation URL',
    public: true,
    fieldType: 'url',
    futureModel: 'application'
  },
  github: {
    type: String,
    default: '',
    description: 'Slug for Github organization (if applicable). e.g. sfbrigade',
    label: 'Github Org',
    public: true
  },
  slack: {
    type: String,
    default: 'http://c4a.me/cfsfslack',
    description: 'Link to Slack',
    label: 'Slack Link',
    public: true,
    fieldType: 'url'
  },
  slackcount: {
    type: Number,
    default: 0,
    description: '[DEPRECATED] Metric: Number of slack users'
  },
  brigadecount: {
    type: Number,
    default: 0,
    description: '[DEPRECATED] Metric: Number of brigades in the area'
  },
  meetup: {
    type: String,
    default: 'Code-for-San-Francisco-Civic-Hack-Night',
    description: 'Meetup url slug. Used for syncing events.',
    label: 'Meetup Slug',
    public: true,
    futureModel: 'application'
  },
  blog: {
    jekyll: {
      type: String,
      default: '',
      description: 'Jekyll blog sync url. Used for syncing blog posts',
      label: 'Jekyll URL',
      fieldType: 'url',
      futureModel: 'application'
    },
    wordpress: {
      type: String,
      default: '',
      description: 'Jekyll blog sync url. Used for syncing blog posts',
      label: 'Jekyll URL',
      fieldType: 'url',
      futureModel: 'application'
    },
    medium: {
      type: String,
      default: '',
      description: 'Jekyll blog sync url. Used for syncing blog posts',
      label: 'Jekyll URL',
      fieldType: 'url',
      futureModel: 'application'
    }
  },
  redirects: {
    type: Array,
    default: [],
    description: 'List of url redirects for the website. You can link old urls to new ones, or alias urls here.',
    public: true,
    label: 'Redirect URLs',
    fieldType: 'list:url-url',
    futureModel: 'application'
  },
  theme: {
    public: {
      type: mongoose.Schema.Types.Mixed,
      default: false,
      description: 'Slug of NPM registered public theme. e.g "c4sf" or "opensavannah"',
      public: true,
      disabled: true,
      label: 'Public Theme Slug',
      futureModel: 'application'
    },
    admin: {
      type: mongoose.Schema.Types.Mixed,
      default: false,
      description: 'Slug of NPM registered public theme. e.g "c4sf" or "opensavannah"',
      public: true,
      disabled: true,
      label: 'Admin Theme Slug',
      futureModel: 'application'
    },
    slug: {
      type: String,
      default: '',
      description: '[DEPRECATED] the full string NPM module name of theme.'
    },
    logo: {
      type: String,
      default: '',
      description: 'A fully qualified url to the logo image of the brigade.',
      label: 'Logo image',
      public: true,
      fieldType: 'imageUrl'
    },
    page: {
      title: {
        type: Boolean,
        default: false,
        description: 'Enable / disable showing the name of the brigade instead of the logo',
        label: 'Show Title',
        // public: true,
        futureModel: 'plugins:theme:public'
      },
      events: {
        type: Boolean,
        default: true,
        description: 'Enable / disable showing the Events page in the navigation bar',
        label: 'Show Events Page',
        public: true,
        futureModel: 'plugins:theme:public'
      },
      projects: {
        type: Boolean,
        default: true,
        description: 'Enable / disable showing the Projects page in the navigation bar',
        label: 'Show Projects Page',
        public: true,
        futureModel: 'plugins:theme:public'
      },
      blog: {
        type: Boolean,
        default: true,
        description: 'Enable / disable showing the Blog page in the navigation bar',
        label: 'Show Blog Page',
        public: true,
        futureModel: 'plugins:theme:public'
      },
      about: {
        type: Boolean,
        default: true,
        description: 'Enable / disable showing the About page in the navigation bar',
        label: 'Show About Page',
        public: true,
        futureModel: 'plugins:theme:public'
      },
      login: {
        type: Boolean,
        default: true,
        description: 'Enable / disable showing the Login link in the navigation bar',
        label: 'Show Login Link',
        public: true,
        futureModel: 'plugins:theme:public'
      },
      external: {
        type: Array,
        default: [],
        description: 'List of external urls to display in navigation bar',
        label: 'External Nav Links',
        public: true,
        fieldType: 'list:string-url',
        futureModel: 'plugins:theme:public'
      }
    }
  },
  copy: {
    tagline: {
      type: String,
      default: '',
      description: 'Tagline that appears on main landing page. Also shown in social media.',
      label: 'Tagline',
      public: true,
      futureModel: 'plugins:theme:public'
    },
    description: {
      type: String,
      default: '',
      description: 'Description that appears on main landing page. Also shown in social media.',
      label: 'Description',
      public: true,
      futureModel: 'plugins:theme:public'
    }
  },
  sponsors: {
    type: Array,
    default: [],
    description: 'List of sponsors of the brigade',
    label: 'Sponsors',
    fieldType: 'list:string-imageUrl-url',
    public: true
  },
  landingstats: {
    type: Array,
    default: []
  },
  displayedstats: {
    type: Array,
    default: []
  },
  auth: {
    segment: {
      writeKey: {
        type: String,
        default: ''
      }
    },
    github: {
      clientId: {
        type: String,
        default: ''
      },
      clientSecret: {
        type: String,
        default: ''
      }
    },
    slack: {
      clientId: {
        type: String,
        default: ''
      },
      clientSecret: {
        type: String,
        default: ''
      }
    },
    meetup: {
      consumerKey: {
        type: String,
        default: ''
      },
      consumerSecret: {
        type: String,
        default: ''
      }
    },
    google: {
      analyticsId: {
        type: String,
        default: ''
      },
      clientId: {
        type: String,
        default: ''
      },
      clientSecret: {
        type: String,
        default: ''
      }
    },
    email: {
      user: {
        type: String,
        default: ''
      },
      password: {
        type: String,
        default: ''
      }
    }
  },
  auditLog: {
    type: Array,
    default: []
  },

  // for dynamic active flag on projects
  lastCheckedGithub: {
    type: Date
  }
}
