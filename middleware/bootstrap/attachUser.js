module.exports = function attachUser (req, res, next) {
  res.locals.user = req.user
  next()
}
