module.exports = function checkDB (req, res, next) {
  if (process.env.DB_INSTANTIATED === '') {
    return setTimeout(function () {
      checkDB(req, res, next)
    }, 500)
  }
  next()
}
