/**
 *  Dependencies
 */
const archiver = require('archiver')
const moment = require('moment')

/**
 *  Exports
 */

module.exports = {
  method: 'get',
  endpoint: '/api/db/backup',
  jwt: true,
  authenticated: true,
  roles: ['core', 'superAdmin'],
  middleware: [],
  controller: getMongoBackup
}

function getMongoBackup (req, res, next) {
  // console.log('getting here')
  const retrieveCalls = Object.keys(req.models).map(function (modelName) {
    return retrieveModel(modelName, req.models[modelName])
  })
  Promise.all(retrieveCalls).then((results) => {
    const archive = archiver('zip', { store: true })
    archive.pipe(res)
    archive.on('error', function (err) {
      throw err
    })
    for (let collectionIndex in results) {
      const collection = results[collectionIndex]
      const collectionName = collection.modelName
      collection.results = collection.results.map((doc) => {
        delete doc._id
        delete doc.__v
        return doc
      })
      if (collectionName === 'Users') {
        collection.results = collection.results.map((doc) => {
          delete doc.tokens
          delete doc.jwt
          return doc
        })
      }
      const jsonDump = collection.results.map(JSON.stringify).join('\n')
      const jsonDumpFilename = `${collectionName}--${moment().format('YYYYMMDD-HHmmSS')}.jsonDump`
      archive.append(jsonDump, { name: jsonDumpFilename })
    }
    archive.finalize()
    archive.on('finish', function () {})
  })
    .catch((err) => {
      res.send(500, {error: true, message: err.toString()})
    })
}

function retrieveModel (modelName, model) {
  return new Promise((resolve, reject) => {
    model.find({}, (err, results) => {
      if (err) return reject(err)
      results = results.map((doc) => doc.toJSON())
      resolve({ modelName, results })
    })
  })
}
