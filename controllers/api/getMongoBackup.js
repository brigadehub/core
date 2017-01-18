/**
 *  Dependencies
 */
const requireDir = require('require-dir')
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
  MongoClient.connect(process.env.MONGODB_URI, function(err, db) {
    if (err) throw new Error(err)
    // console.log('connected')
    db.listCollections().toArray(function(err, collections) {
      if (err) throw new Error(err)
      // console.log(collections)
      var archive = archiver('zip', {
          store: true // Sets the compression method to STORE.
      })
      collections = _.reject(collections, {name: 'system.indexes'})
      collections = _.reject(collections, {name: 'sessions'})
      collections = collections.map(function(collection) {
        // console.log(collection)
        collection.stream = dump(process.env.MONGODB_URI, collection.name).pipe(through(write))
        collection.chunks = ''
        function write(row) {
          delete row.__v
          delete row._id
          this.queue(`${JSON.stringify(row)}\n`)
        }
        collection.stream.on('connectError', function(err) {
          throw err
        })
        collection.stream.on('end', function() {
          // console.log(collection.chunks);
          // console.log('archiver has been finalized and the output file descriptor has closed.');
        })

        collection.stream.on('data', function(chunk) {
          collection.chunks += chunk.toString()
        })
        return collection
      })
      // send to client
      archive.pipe(res)
      // catch errors
      archive.on('error', function(err) {
        throw err;
      })
      // append each dump
      for (collectionIndex in collections) {
        const collection = collections[collectionIndex]
        const dumpFilename = `${collection.name}--${moment().format('YYYYMMDD-HHmmSS')}--mongodump.txt`
        // console.log(collection.name, dumpFilename)
        archive.append(collection.stream, { name:  dumpFilename});
      }
      // finalize
      archive.finalize()
      // close db connection after the archive has been sent
      archive.on('finish', function () {
        db.close(function(err, results){
          if (err) throw new Error(err)
          // console.log('closed connection')
        })
      })
    })
  })
}
