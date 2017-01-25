module.exports = function jwtLoadUser (req, res, next) {
  req.models.Users.findOne({github: req.tokenPayload.github}, function (err, user) {
    if (err) res.send(500, {err: err})
    req.user = user
    req.isAuthenticated = () => true
    next()
  })
}
