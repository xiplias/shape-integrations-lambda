'use strict'

module.exports = {
  name: 'GET users',
  description: 'Tests getting the users',
  testFunction: function(context, logger, callback) {
    callback(null, {ok: true, err: []})
  }
}
