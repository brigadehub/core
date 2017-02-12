module.exports = {
  username: { type: String, unique: true },
  email: {type: String, default: ''},
  createdAt: {type: Date, default: ''},
  lastLoggedIn: {type: Date, default: ''},
  lastCheckin: {type: Date, default: ''},
  mailingList: {type: Boolean, default: false},
  referredBy: {type: String, default: ''},
  skills: {type: Array, default: []},
  github: {type: String, default: ''},
  tokens: {type: Array, default: []},
  scopes: {type: Array, default: []},
  jwt: {type: String, default: ''},
  roles: {
    read: {type: Boolean, default: true},
    blog: {type: Boolean, default: false},
    project: {type: Boolean, default: false},
    lead: {type: Boolean, default: false},
    core: {type: Boolean, default: false},
    superAdmin: {type: Boolean, default: false}
  },
  teams: {
    lead: { type: Array, default: [] },
    project: { type: Array, default: [] },
    core: { type: Array, default: [] }
  },
  profile: {
    name: { type: String, default: '' },
    gender: { type: String, default: '' },
    location: { type: String, default: '' },
    website: { type: String, default: '' },
    picture: { type: String, default: '' },
    showcontact: { type: Boolean, default: true },
    position: { type: String, default: '' },
    contactpagerank: { type: Number, default: 1 }
  }
}
