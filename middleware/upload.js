const fs = require('fs')
const multer = require('multer')
const location = process.env.FILE_UPLOAD_LOCATION || process.cwd() + '/tmp'
const mkdirError = makeDirectory(location)
if (mkdirError) throw mkdirError
process.env.FILE_UPLOAD_LOCATION = location

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, location)
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})

module.exports = multer({
  storage,
  limits: {
    fileSize: process.env.FILE_UPLOAD_FILESIZE_LIMIT || 1000000,
    files: 1
  }
}).any()

function makeDirectory (path) {
  try {
    fs.mkdirSync(path)
  } catch (e) {
    if (e.code === 'EEXIST') return false
    return e
  }
  return false
}
