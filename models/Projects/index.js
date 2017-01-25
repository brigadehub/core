var mongoose = require('mongoose')
mongoose.Promise = global.Promise

const fetchGithubRepos = require('./fetchGithubRepos')
const preSave = require('./preSave')
const postFind = require('./postFind')
const postFindOne = require('./postFindOne')
const publishToGithub = require('./publishToGithub')
const fetchGithubUsers = require('./fetchGithubUsers')
var projectsSchema = require('../../schemas/projects')

projectsSchema.statics.fetchGithubRepos = fetchGithubRepos
projectsSchema.statics.fetchGithubUsers = fetchGithubUsers
projectsSchema.statics.publishToGithub = publishToGithub

projectsSchema.pre('save', preSave)
projectsSchema.post('find', postFind)
projectsSchema.post('findOne', postFindOne)

module.exports = mongoose.model('Projects', projectsSchema)
