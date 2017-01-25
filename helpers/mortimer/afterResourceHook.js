const mortimer = require('mortimer')

class AfterResourceHook extends mortimer.Resource {
    // By default this method adds no extra middleware, but subclasses can
    // implement this to add their own custom functionality.
  after () {
    return []
  }

    // All endpoints are being overriden to add the after() method.

  createDoc () {
    const original = super.createDoc()
    const originalLast = original.pop()
    original.push(this.after('createDoc'))
    original.push(originalLast)
    return original
  }

  readDocs () {
    const original = super.readDocs()
    const originalLast = original.pop()
    original.push(this.after('readDocs'))
    original.push(originalLast)
    return original
  }

  readDoc () {
    const original = super.readDoc()
    const originalLast = original.pop()
    original.push(this.after('readDoc'))
    original.push(originalLast)
    return original
  }

  patchDoc () {
    const original = super.patchDoc()
    const originalLast = original.pop()
    original.push(this.after('patchDoc'))
    original.push(originalLast)
    return original
  }

  removeDoc () {
    const original = super.removeDoc()
    const originalLast = original.pop()
    original.push(this.after('removeDoc'))
    original.push(originalLast)
    return original
  }
}

module.exports = AfterResourceHook
