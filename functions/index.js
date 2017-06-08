'use strict'

const core = require('shape-integrations-core')
const auth = require('../lib/auth')
const aws = require('aws-sdk')
const s3 = new aws.S3()

const bucket = process.env.TEST_RESULTS_BUCKET

module.exports.projects = function(
  projectsDir,
  requestPassword,
  adminPassword,
  cb
) {
  auth.accessValidation(requestPassword, adminPassword, function(err) {
    if (err) {
      cb(new Error('Access denied'))
      return
    }

    core.getAllProjects(projectsDir, function(err, projects) {
      if (err) return cb(err)
      cb(null, projects)
    })
  })
}

module.exports.projectDetails = function(
  projectsDir,
  projectIdentifier,
  requestPassword,
  adminPassword,
  cb
) {
  core.getProject(projectsDir, projectIdentifier, function(err, project) {
    if (err) return cb(err)

    if (!project) {
      return cb(new Error('Unknown project identifier: ' + projectIdentifier))
    }

    auth.accessValidation(
      requestPassword,
      adminPassword,
      project.accessKey,
      function(err) {
        if (err) return cb(new Error('Access denied'))

        core.getTestsForProject(projectsDir, projectIdentifier, function(
          err,
          tests
        ) {
          if (err) return cb(err)
          project.tests = tests
          cb(null, project)
        })
      }
    )
  })
}

module.exports.runTest = function(
  projectsDir,
  projectIdentifier,
  testIdentifier,
  requestPassword,
  adminPassword,
  cb
) {
  const projectDescriptor = core.getProjectDescriptor(
    projectsDir,
    projectIdentifier
  )

  auth.accessValidation(
    requestPassword,
    adminPassword,
    projectDescriptor.accessKey,
    function(err) {
      if (err) return cb(new Error('Access denied'))

      core.runTest(projectsDir, projectIdentifier, testIdentifier, function(
        err,
        res
      ) {
        if (err) return cb(err)

        const resultFolder = projectIdentifier + '/' + testIdentifier + '/'
        const resultPath = resultFolder + Date.now() + '-result.json'
        const resultLatestPath = resultFolder + 'latest-result.json'

        if (process.env.LOCAL) {
          saveToBucket(resultPath, res, function(err, putRes) {
            if (err) return cb(err)
            saveToBucket(resultLatestPath, res, function(err, putRes) {
              if (err) return cb(err)
              cb(null, res)
            })
          })
        } else {
          cb(null, res)
        }
      })
    }
  )
}

const saveToBucket = function(path, data, callback) {
  s3.putObject(
    {
      Bucket: bucket,
      Key: path,
      Body: JSON.stringify(data)
    },
    callback
  )
}
