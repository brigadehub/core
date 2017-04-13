const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const fetchGithubRepos = require('./fetchGithubRepos')
const preSave = require('./preSave')
const postFind = require('./postFind')
const postFindOne = require('./postFindOne')
const publishToGithub = require('./publishToGithub')
const fetchGithubUsers = require('./fetchGithubUsers')
const schemas = require('../../schemas')
const projectSchemaRaw = schemas.projects
const projectsSchema = new mongoose.Schema(projectSchemaRaw)

projectsSchema.statics.fetchGithubRepos = fetchGithubRepos
projectsSchema.statics.fetchGithubUsers = fetchGithubUsers
projectsSchema.statics.publishToGithub = publishToGithub

projectsSchema.pre('save', preSave)
projectsSchema.post('find', postFind)
projectsSchema.post('findOne', postFindOne)

module.exports = mongoose.model('Projects', projectsSchema)
