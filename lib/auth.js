module.exports.accessValidation = function(
  password,
  masterPassword,
  projectPassword,
  cb
) {
  const projectPasswordIsFunc = typeof projectPassword === 'function'
  const callback = projectPasswordIsFunc ? projectPassword : cb

  if (password == undefined || password == '')
    return callback(new Error('password not defined'))

  const verifiedMasterPassword = masterPassword && password === masterPassword
  const verfiedProjectPassword =
    !projectPasswordIsFunc && projectPassword === password

  if (!password) {
    return callback(new Error('No Access'))
  }

  if (!verfiedProjectPassword && !verifiedMasterPassword) {
    return callback(new Error('No Access'))
  }

  if (verfiedProjectPassword || verifiedMasterPassword) {
    callback()
  }
}
