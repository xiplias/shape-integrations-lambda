'use strict'

const fs = require('fs')
const path = require('path')
const request = require('./lib/request')
const functions = require('./functions')

const successResponse = request.successResponse
const failureResponse = request.failureResponse

const adminPassword = process.env.ALL_ACCESS_PASSWORD
const projectsDir =
  process.env.PROJECT_DIR || path.resolve(__dirname, 'projects')

module.exports.projects = function(event, context) {
  const headers = event.headers || {}
  const requestPassword = headers.Authorization

  functions.projects(projectsDir, requestPassword, function(err, projects) {
    if (err) return failureResponse(context, err)
    successResponse(context, { projects })
  })
}

module.exports.projectDetails = function(event, context) {
  const headers = event.headers || {}
  const projectIdentifier = (event.pathParameters || {}).projectId.toLowerCase()
  const requestPassword = headers.Authorization

  functions.projectDetails(
    projectsDir,
    projectIdentifier,
    requestPassword,
    function(err, project) {
      if (err) return failureResponse(context, err)
      successResponse(context, project)
    }
  )
}

module.exports.runTest = function(event, context) {
  const headers = event.headers || {}
  const pathParameters = event.pathParameters || {}

  const projectIdentifier = (pathParameters.projectId || '').toLowerCase()
  const testIdentifier = pathParameters.testId
  const requestPassword = headers.Authorization

  functions.runTest(
    projectsDir,
    projectIdentifier,
    testIdentifier,
    requestPassword,
    function(err, result) {
      if (err) return failureResponse(context, err)
      successResponse(context, { result })
    }
  )
}
