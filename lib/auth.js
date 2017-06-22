const jwt = require('jsonwebtoken')

module.exports.accessValidation = function(password, projectPassword, cb) {
  const projectPasswordIsFunc = typeof projectPassword === 'function'
  const callback = projectPasswordIsFunc ? projectPassword : cb

  if (password == undefined || password == '')
    return callback(new Error('password not defined'))

  // Validate JWT password
  if (password.match(/Bearer/)) {
    const token = password.split(' ')[1]
    try {
      jwt.verify(token, process.env.AUTH0_SECRET_KEY)
      return callback()
    } catch (err) {
      return callback(err)
    }
  }

  // Validate project password
  const verfiedProjectPassword =
    !projectPasswordIsFunc && projectPassword === password

  if (!verfiedProjectPassword) {
    return callback(new Error('No Access'))
  }

  if (verfiedProjectPassword) {
    callback()
  }
}
