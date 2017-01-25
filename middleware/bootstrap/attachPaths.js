module.exports = (redirectBlacklist) => function attachPaths (req, res, next) {
  req.previousURL = req.header('Referer') || '/'
  if (!isPublicFile(req.path, redirectBlacklist)) req.session.returnTo = req.path
  next()
}

function isPublicFile (url, fileList) {
  for (let fileIndex in fileList) {
    if (url.indexOf(fileList[fileIndex]) > -1) return true
  }
  return false
}
