module.exports = function listAllFiles (dir, filelist) {
  var path = path || require('path')
  var fs = fs || require('fs')
  var files = fs.readdirSync(dir)
  filelist = filelist || []
  files.forEach(function (file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = listAllFiles(path.join(dir, file), filelist)
    } else {
      filelist.push(file)
    }
  })
  return filelist
}
