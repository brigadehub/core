var mongoose = require('mongoose')
mongoose.Promise = global.Promise

var request = require('request')
var uuid = require('node-uuid')
var eventsSchema = new mongoose.Schema(require('../schemas/events'))

eventsSchema.methods.fetchGoogleEvents = function (cb) {
  cb(null, {})
}

eventsSchema.statics.fetchMeetupEvents = function (meetupid) {
  var Events = this
  return new Promise(function (resolve, reject) {
    getEvents(meetupid, function (err, aggregate) {
      if (err) console.error(err)
      if (aggregate.length < 1) {
        reject('We were unable to find any events attached to your Meetup account. Please check your Meetup.com credentials if you were expecting to import some events. ')
      } else {
        // remove all meetup events, we'll repopulate them
        Events.find({ meetupid: { $ne: '' } }).remove().exec(function (err, data) {
          if (err) console.error(err)
          aggregate.forEach(function (outing) {
            Events.find({ 'meetupid': outing.id }, function (err, foundEvent) {
              if (foundEvent.length < 1) {
                if (err) console.error(err)
                var eventData = createEventData(outing)
                var newEvent = new Events(eventData)
                newEvent.save(function (err) {
                  if (err) console.error(err)
                })
              }
            })
          })
          resolve()
        })
      }
    })
  })
}

function getEvents (meetupid, callback) {
  request(meetupid, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var parsed = JSON.parse(body)
      return callback(null, parsed.results)
    } else {
      return callback(error, [])
    }
  })
}

function createEventData (event) {
  var eventData = {}
  var unixtime = Math.floor(event.time / 1000)
  eventData.meetupid = event.id
  eventData.id = uuid.v1()
  eventData.title = event.name || ''
  eventData.url = event.event_url || ''
  eventData.description = event.description || ''

  // check if venue is null
  if (event.venue) {
    eventData.location = `${event.venue.address_1 || ''} ${event.venue.city || ''}`.trim()
    eventData.host = event.venue.name || ''
  }

  eventData.start = unixtime || ''
  if (event.duration) {
    eventData.end = unixtime + Math.floor(event.duration / 1000)
  } else {
    eventData.end = ''
  }
  return eventData
}

module.exports = mongoose.model('Events', eventsSchema)
