import test from 'ava'
import _ from 'lodash'

const BrigadeSeed = require('./Brigade')

test('Brigade seed should return an array of one example brigade', (t) => {
  let brigade = BrigadeSeed()
  t.is(_.isArray(brigade), true, 'Brigade seed returns an array')
  t.is(brigade.length, 1, 'Brigade seed array contains a single object')
  brigade = brigade[0]
  t.is(_.isObject(brigade), true, 'Brigade seed array [0] is an object')
  const brigadeName = 'Code for Example'
  t.is(brigade.name, brigadeName, `Brigade returned is ${brigadeName}`)
  t.pass()
})

// test('bar', async t => {
//   const bar = Promise.resolve('bar')
//
//   t.is(await bar, 'bar')
// })
