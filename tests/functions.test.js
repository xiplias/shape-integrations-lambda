const path = require('path')
const assert = require('assert')
const lambda = require('lambda-local')
const request = require('../lib/request')
const functions = require('../functions')

const projectsDir = path.join(__dirname, 'projects')

describe('functions', () => {
  describe('Projects', () => {
    it('adminPassword should grant access', done => {
      const requestPassword = 'test1'
      const adminPassword = 'test1'

      functions.projects(projectsDir, requestPassword, adminPassword, function(
        err,
        projects
      ) {
        assert.equal(err, null)
        assert.equal(projects.length, 1)
        assert.equal(projects[0].name, 'JSON Placeholder')
        done()
      })
    })

    it('empty requestPassword should NOT grant access', done => {
      const requestPassword = ''
      const adminPassword = 'test1'

      functions.projects(projectsDir, requestPassword, adminPassword, function(
        err,
        projects
      ) {
        assert.equal(projects, null)
        assert.equal(err.message, 'Access denied')
        done()
      })
    })
  })

  describe('projectDetails', () => {
    it('adminPassword should grant access', done => {
      const projectIdentifier = 'jsonplaceholder'
      const adminPassword = 'test12'
      const requestPassword = 'test12'

      functions.projectDetails(
        projectsDir,
        projectIdentifier,
        requestPassword,
        adminPassword,
        function(err, project) {
          assert.equal(err, null)
          assert.equal(project.identifier, projectIdentifier)
          done()
        }
      )
    })

    it('adminPassword NOT should grant access', done => {
      const projectIdentifier = 'jsonplaceholder'
      const adminPassword = 'test12'
      const requestPassword = ''

      functions.projectDetails(
        projectsDir,
        projectIdentifier,
        requestPassword,
        adminPassword,
        function(err, project) {
          assert.equal(project, null)
          assert.equal(err.message, 'Access denied')
          done()
        }
      )
    })

    it('project accessKey should grant access', done => {
      const projectIdentifier = 'jsonplaceholder'
      const adminPassword = ''
      const requestPassword = 'testjson'

      functions.projectDetails(
        projectsDir,
        projectIdentifier,
        requestPassword,
        adminPassword,
        function(err, project) {
          assert.equal(err, null)
          assert.equal(project.identifier, projectIdentifier)
          done()
        }
      )
    })

    it('should fail if none is set', done => {
      const projectIdentifier = 'jsonplaceholder'
      const adminPassword = ''
      const requestPassword = ''

      functions.projectDetails(
        projectsDir,
        projectIdentifier,
        requestPassword,
        adminPassword,
        function(err, project) {
          assert.equal(project, null)
          assert.equal(err.message, 'Access denied')
          done()
        }
      )
    })
  })

  describe('runTest', () => {
    it('adminPassword should grant access', done => {
      const projectIdentifier = 'jsonplaceholder'
      const testIdentifier = 'users'
      const adminPassword = 'abc'
      const requestPassword = 'abc'

      functions.runTest(
        projectsDir,
        projectIdentifier,
        testIdentifier,
        requestPassword,
        adminPassword,
        function(err, data) {
          assert.equal(err, null)
          assert.equal(data.ok, true)

          done()
        }
      )
    })

    it('project specific accessKey should grant access', done => {
      const projectIdentifier = 'jsonplaceholder'
      const testIdentifier = 'users'
      const adminPassword = 'a'
      const requestPassword = 'testjson'

      functions.runTest(
        projectsDir,
        projectIdentifier,
        testIdentifier,
        requestPassword,
        adminPassword,
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
      const adminPassword = ''
      const requestPassword = ''

      functions.runTest(
        projectsDir,
        projectIdentifier,
        testIdentifier,
        requestPassword,
        adminPassword,
        function(err, data) {
          assert.equal(err.message, 'Access denied')
          assert.equal(data, null)

          done()
        }
      )
    })
  })
})
