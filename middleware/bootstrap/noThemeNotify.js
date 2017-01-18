module.exports = (publicThemeLocation, adminThemeLocation) => function noThemeNotify (req, res, next) {
  if (!(publicThemeLocation || adminThemeLocation)) {
    req.session.noTheme = true
  }
  next()
}
