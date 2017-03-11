module.exports = function initConfig (req, res, next) {
  if (
    process.env.NODE_ENV === 'production' &&
    (
      // It should redirect to configure
    !res.locals.brigade.auth.github ||
    res.locals.brigade.auth.github.clientId === '' ||
    res.locals.brigade.auth.github.clientId === 'be1b409d62f41a56684c' ||
    res.locals.brigade.url === '' ||
    res.locals.brigade.auth.github.clientSecret === ''
    ) &&
    req.path.indexOf('init/configure') < 0
  ) {
    return res.redirect('/init/configure')
  }
  if (
    (
    !res.locals.brigade.auth.github ||
    res.locals.brigade.auth.github.clientId === '' ||
    res.locals.brigade.auth.github.clientSecret === '' ||
    res.locals.brigade.url === ''
    ) &&
    req.path.indexOf('init/configure') < 0
  ) {
    return res.redirect('/init/configure')
  }
  if (
    req.path.indexOf('init/configure') > -1 &&
    (
      res.locals.brigade.auth.github &&
      res.locals.brigade.auth.github.clientId !== '' &&
      res.locals.brigade.auth.github.clientSecret !== '' &&
      res.locals.brigade.url !== ''
    )
  ) {
    console.log(res.locals.brigade)
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    const time = new Date()
    res.locals.brigade.auditLog = res.locals.brigade.auditLog || []
    res.locals.brigade.auditLog.push(`${time} ${ip} attempted to access init/configure`)
    return res.locals.brigade.save((err, results) => {
      if (err) console.error(err)
      req.flash('errors', {
        msg: [
          'You are not authorized to view this page.',
          'Your IP address has been logged.',
          'Please contact your administrator.'
        ].join(' ')
      })
      return res.redirect('/')
    })
  }
  next()
}
