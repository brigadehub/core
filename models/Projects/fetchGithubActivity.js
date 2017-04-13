const _ = require('lodash')
const moment = require('moment')
const emojify = require('emojify-tag')
const Users = require('../Users')

const request = require('superagent')

module.exports = function fetchGithubActivity (project) {
  return new Promise((resolve, reject) => {
    project.lastCheckedGithub = project.lastCheckedGithub || 1
    const checkTimeframe = moment(new Date()).unix() - moment(project.lastCheckedGithub).unix()
    // if (true) { // 86400 seconds = 24 hours
    if (project.checkFromGithub && project.lastCheckedGithub && checkTimeframe >= 86400) { // 86400 seconds = 24 hours
      Users.findOne({ username: project.checkFromGithubAs }, (err, results) => {
        if (err) return reject(err)
        if (!results) return reject(new Error(`No user with username ${project.checkFromGithubAs} found`))
        let token = _.find(results.tokens, { kind: 'github' })
        if (!token) return reject(new Error(`User ${project.checkFromGithubAs} does not have a github token`))
        token = token.accessToken
        var getActivityCalls
        try {
          getActivityCalls = project.repositories.map(parseOwnerRepo).map((repo) => getGithubActivity(repo, token))
        } catch (e) {
          return reject(e)
        }
        Promise.all(getActivityCalls).then((results) => {
          let finalActivity = []
          finalActivity = finalActivity.concat.apply(finalActivity, results)
          finalActivity = _.sortBy(finalActivity, (action) => new Date(action.date)).reverse()
          finalActivity = _.take(finalActivity, 10)
          resolve(finalActivity)
        }).catch(reject)
      })
    } else {
      return resolve()
    }
  })
}

function parseOwnerRepo (url) {
  if (url.indexOf('https://github.com/') > -1) {
    let ownerRepo = url.split('https://github.com/')[1]
    ownerRepo = _.take(ownerRepo.split('/'), 2).join('/')
    return ownerRepo
  }
  throw new Error('Repo URL is invalid!')
}

function getGithubActivity (ownerRepo, token) {
  return new Promise((resolve, reject) => {
    const commitsUrl = `https://api.github.com/repos/${ownerRepo}/commits`
    const commentsUrl = `https://api.github.com/repos/${ownerRepo}/issues/comments?sort=created&direction=desc`
    let commits
    let comments
    request.get(commitsUrl)
      .set('Authorization', `Bearer ${token}`)
      .set('User-Agent', `Brigadehub Core`)
      .end((err, results) => {
        if (err) return reject(err)
        commits = results.body
        commits = commits.map((commit) => {
          return {
            ownerRepo: ownerRepo,
            type: 'commit',
            url: commit.html_url,
            date: commit.commit.author.date,
            commit_message: emojify`${commit.commit.message}`,
            committer: {
              name: commit.commit.author.name,
              email: commit.commit.author.email
            }
          }
        })
        request.get(commentsUrl)
          .set('Authorization', `Bearer ${token}`)
          .set('User-Agent', `Brigadehub Core`)
          .end((err, results) => {
            if (err) return reject(err)
            comments = results.body
            comments = comments.map((comment) => {
              return {
                ownerRepo: ownerRepo,
                type: 'comment',
                url: comment.html_url,
                date: comment.created_at,
                comment: emojify`${comment.body}`,
                commenter: {
                  username: comment.user.login,
                  avatar: comment.user.avatar_url,
                  url: comment.user.html_url
                }
              }
            })
            let activity = commits.concat(comments)
            activity = _.sortBy(activity, (action) => new Date(action.date)).reverse()
            activity = _.take(activity, 10)
            resolve(activity)
          })
      })
  })
}
