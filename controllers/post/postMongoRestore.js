/**
 *  Dependencies
 */
const MongoClient = require('mongodb').MongoClient

const StreamZip = require('node-stream-zip')

/**
 *  Exports
 */

module.exports = {
  method: 'post',
  endpoint: '/api/db/restore',
  jwt: true,
  authenticated: true,
  roles: ['core', 'superAdmin'],
  middleware: ['upload'],
  controller: postMongoRestore
}

function postMongoRestore (req, res, next) {
  // console.log('Posted here', req.files)
  const backupArchive = req.files[0]
  var zip = new StreamZip({
    file: backupArchive.path,
    storeEntries: true
  })
  zip.on('error', function (err) {
    res.send(500, {error: err})
  })
  zip.on('ready', function () {
    // console.log('zip:', zip.entries())
    const entries = zip.entries()
    MongoClient.connect(process.env.MONGODB_URI, function (err, db) {
      if (err) throw new Error(err)
      // console.log('connected')
      const entryReads = []
      for (let i in entries) {
        const entry = entries[i]
        entryReads.push(readEntry(zip, entry, db))
      }
      Promise
        .all(entryReads)
        .then((entries) => {
          return new Promise((resolve, reject) => {
            db.dropDatabase(function (err, replies) {
              if (err) return reject(err)
              // console.log('dropped')
              resolve({entries, db})
            })
          })
        })
        .then(importEntries)
        .then((results) => {
          res.send(200, {success: true})
        })
        .catch((err) => {
          // console.log(err)
          res.send(500, {error: err})
        })
    })

  // read file as buffer in sync way
  // var data = zip.entryDataSync('README.md')
  })
  zip.on('extract', function (entry, file) {
    // console.log('Extracted ' + entry.name + ' to ' + file)
  })
  zip.on('entry', function (entry) {
    // called on load, when entry description has been read
    // you can already stream this entry, without waiting until all entry descriptions are read (suitable for very large archives)
    // console.log('Read entry ', entry.name)
  })
}

function readEntry (zip, entry, db) {
  return new Promise((resolve, reject) => {
    zip.stream(entry.name, function (err, entryStream) {
      if (err) return reject(err)
      const entryChunks = []
      entryStream.on('data', chunk => entryChunks.push(chunk.toString()))
      entryStream.on('end', function () {
        const entryString = entryChunks.join('')
        let entryObj
        try {
          entryObj = entryString.trim().split('\n').map(JSON.parse)
        } catch (e) {
          return reject(e)
        }
        // console.log(entry)
        resolve({ name: entry.name, data: entryObj })
      })
      entryStream.on('error', function (err) {
        reject(err)
      })
    })
  })
}
function importEntries ({entries, db}) {
  const collectionImports = []
  for (let i in entries) {
    const entry = entries[i]
    collectionImports.push(importCollection(entry, db))
  }
  return Promise.all(collectionImports)
}

function importCollection (entry, db) {
  return new Promise((resolve, reject) => {
    const name = entry.name.split('--')[0]
    db.createCollection(name, function (err, results) {
      if (err) return reject(err)
      db.collection(name).insertMany(entry.data, function (err, results) {
        if (err) return reject(err)
        resolve()
      })
    })
  })
}
