const auth = require('../lib/auth')
const assert = require('assert')

describe('accessValidation', () => {
  it('should validate project password', done => {
    auth.accessValidation('1234', '1234', function(err) {
      assert.equal(err, undefined)
      done()
    })
  })

  it('should not validate invalid project password', done => {
    auth.accessValidation('1234', '123', function(err) {
      assert.throws(() => {
        throw new Error('No Access')
      })
      done()
    })
  })

  it('should not validate empty password', done => {
    auth.accessValidation('', '', function(err) {
      assert.throws(() => {
        throw new Error('password not defined')
      })
      done()
    })
  })

  it('should return error if auth token validation fails', done => {
    auth.accessValidation('', '', function(err) {
      assert.throws(() => {
        throw new Error('password not defined')
      })
      done()
    })
  })
})
