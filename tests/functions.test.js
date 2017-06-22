const path = require('path')
const assert = require('assert')
const lambda = require('lambda-local')
const request = require('../lib/request')
const functions = require('../functions')

const projectsDir = path.join(__dirname, 'projects')

describe('functions', () => {
  describe('Projects', () => {
    it('empty requestPassword should NOT grant access', done => {
      const requestPassword = ''

      functions.projects(projectsDir, requestPassword, function(err, projects) {
        assert.equal(projects, null)
        assert.equal(err.message, 'Access denied')
        done()
      })
    })
  })

  describe('projectDetails', () => {
    it('project accessKey should grant access', done => {
      const projectIdentifier = 'jsonplaceholder'
      const requestPassword = 'testjson'

      functions.projectDetails(
        projectsDir,
        projectIdentifier,
        requestPassword,
        function(err, project) {
          assert.equal(err, null)
          assert.equal(project.identifier, projectIdentifier)
          done()
        }
      )
    })

    it('should fail if none is set', done => {
      const projectIdentifier = 'jsonplaceholder'
      const requestPassword = ''

      functions.projectDetails(
        projectsDir,
        projectIdentifier,
        requestPassword,
        function(err, project) {
          assert.equal(project, null)
          assert.equal(err.message, 'Access denied')
          done()
        }
      )
    })
  })

  describe('runTest', () => {
    it('project specific accessKey should grant access', done => {
      const projectIdentifier = 'jsonplaceholder'
      const testIdentifier = 'users'
      const requestPassword = 'testjson'

      functions.runTest(
        projectsDir,
        projectIdentifier,
        testIdentifier,
        requestPassword,
        function(err, data) {
          assert.equal(err, null)
          assert.equal(data.ok, true)

          done()
        }
      )
    })

    it('should fail if none is set', done => {
      const projectIdentifier = 'jsonplaceholder'
      const testIdentifier = 'users'
      const requestPassword = ''

      functions.runTest(
        projectsDir,
        projectIdentifier,
        testIdentifier,
        requestPassword,
        function(err, data) {
          assert.equal(err.message, 'Access denied')
          assert.equal(data, null)

          done()
        }
      )
    })
  })
})
