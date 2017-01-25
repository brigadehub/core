module.exports = function initConfig (req, res, next) {
  if (
    process.env.NODE_ENV === 'production' &&
    (
    !res.locals.brigade.auth.github ||
    res.locals.brigade.auth.github.clientId === '' ||
    res.locals.brigade.auth.github.clientId === 'be1b409d62f41a56684c'
    ) &&
    req.path.indexOf('init/configure') < 0
  ) {
    return res.redirect('/init/configure')
  }
  if (
    (
    !res.locals.brigade.auth.github ||
    res.locals.brigade.auth.github.clientId === ''
    ) &&
    req.path.indexOf('init/configure') < 0
  ) {
    return res.redirect('/init/configure')
  }
  next()
}
