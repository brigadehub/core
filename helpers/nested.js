const flatten = function (data) {
  const result = {}
  function recurse (cur, prop) {
    if (Object(cur) !== cur) {
      result[prop] = cur
    } else if (Array.isArray(cur)) {
      let i
      let l
      for (i = 0, l = cur.length; i < l; i++) recurse(cur[i], prop + '[' + i + ']')
      if (l === 0) { result[prop] = [] }
    } else {
      let isEmpty = true
      for (let p in cur) {
        isEmpty = false
        recurse(cur[p], prop ? prop + '.' + p : p)
      }
      if (isEmpty && prop) result[prop] = {}
    }
  }
  recurse(data, '')
  return result
}

const unflatten = function (data) {
  'use strict'
  if (Object(data) !== data || Array.isArray(data)) return data
  const regex = /\.?([^.[\]]+)|\[(\d+)\]/g
  const resultholder = {}
  for (let p in data) {
    let cur = resultholder
    let prop = ''
    let m
    while (m = regex.exec(p)) { // eslint-disable-line
      cur = cur[prop] || (cur[prop] = (m[2] ? [] : {}))
      prop = m[2] || m[1]
    }
    cur[prop] = data[p]
  }
  return resultholder[''] || resultholder
}

module.exports = { flatten, unflatten }
