'use strict'

module.exports = {
  name: 'GET users',
  description: 'Tests getting the users',
  testFunction: function(context, callback) {
    callback(null, { success: true })
  }
}
