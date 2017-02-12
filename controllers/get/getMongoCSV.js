/**
 *  Dependencies
 */
const archiver = require('archiver')
const moment = require('moment')
const _ = require('lodash')
const flatten = require('flat')
const json2csv = require('json2csv')


/**
 *  Exports
 */

module.exports = {
  method: 'get',
  endpoint: '/api/db/csv',
  jwt: true,
  authenticated: true,
  roles: ['core', 'superAdmin'],
  middleware: [],
  controller: getMongoCSV
}

function getMongoCSV (req, res, next) {
  const retrieveCalls = Object.keys(req.models).map(function(modelName) {
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
      let fields = []
      const collectionName = collection.modelName
      collection.results = collection.results.map((doc) => {
        delete doc._id
        delete doc.__v
        return doc
      })
      if(collectionName === 'Users') {
        collection.results = collection.results.map((doc) => {
          delete doc.tokens
          delete doc.jwt
          return doc
        })
      }
      const data = collection.results.map((doc) => {
        const flatdoc = flatten(doc)
        fields = fields.concat(Object.keys(flatdoc))
        fields = _.uniq(fields)
        return flatdoc
      })
      const csv = json2csv({ data, fields })
      const csvFilename = `${collectionName}--${moment().format('YYYYMMDD-HHmmSS')}.csv`
      archive.append(csv, { name: csvFilename })
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
