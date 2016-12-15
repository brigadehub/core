import test from 'ava'
import _ from 'lodash'

const EventsSeed = require('./Events')

test('Events seed should return an array of one example events', (t) => {
  let events = EventsSeed()
  t.is(_.isArray(events), true, 'Events seed returns an array')
  t.is(events.length, 3, 'Events seed array contains three objects')
  const event = event[0]
  t.is(_.isObject(event), true, 'Events seed array [0] is an object')
  const eventName = 'Event 1'
  t.is(event.title, eventName, `Events returned is ${eventName}`)
  t.pass()
})

// test('bar', async t => {
//   const bar = Promise.resolve('bar')
//
//   t.is(await bar, 'bar')
// })
