/**
 *  Dependencies
 */
const dump = require('mongodb-collection-dump')
const archiver = require('archiver')
const MongoClient = require('mongodb').MongoClient
const moment = require('moment')
const _ = require('lodash')
const through = require('through')

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
  MongoClient.connect(process.env.MONGODB_URI, function (err, db) {
    if (err) throw new Error(err)
    db.listCollections().toArray(function (err, collections) {
      if (err) throw new Error(err)
      var archive = archiver('zip', {
        store: true // Sets the compression method to STORE.
      })
      collections = _.reject(collections, {name: 'system.indexes'})
      collections = _.reject(collections, {name: 'sessions'})
      collections = collections.map(function (collection) {
        collection.stream = dump(process.env.MONGODB_URI, collection.name).pipe(through(write))
        collection.chunks = ''
        function write (row) {
          delete row.__v
          delete row._id
          this.queue(`${JSON.stringify(row)}\n`)
        }
        collection.stream.on('connectError', function (err) {
          throw err
        })
        collection.stream.on('end', function () {
        })

        collection.stream.on('data', function (chunk) {
          collection.chunks += chunk.toString()
        })
        return collection
      })
      // send to client
      archive.pipe(res)
      // catch errors
      archive.on('error', function (err) {
        throw err
      })
      // append each dump
      for (let collectionIndex in collections) {
        const collection = collections[collectionIndex]
        const dumpFilename = `${collection.name}--${moment().format('YYYYMMDD-HHmmSS')}--mongodump.txt`
        archive.append(collection.stream, { name: dumpFilename })
      }
      // finalize
      archive.finalize()
      // close db connection after the archive has been sent
      archive.on('finish', function () {
        db.close(function (err, results) {
          if (err) throw new Error(err)
        })
      })
    })
  })
}
