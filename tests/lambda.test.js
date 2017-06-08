const path = require('path')
const assert = require('assert')
const lambda = require('lambda-local')
const request = require('../lib/request')

process.env.PROJECT_DIR = path.resolve(__dirname, 'projects')
process.env.ALL_ACCESS_PASSWORD = 'test1'

const lambdaExecute = function(func, params, requestPassword, cb) {
  lambda.execute({
    event: {
      pathParameters: params,
      headers: {
        Authorization: requestPassword
      }
    },
    lambdaHandler: func,
    lambdaPath: path.join('index.js'),
    callback: function(err, data) {
      if (err) {
        return assert.equal(err, false)
      }

      cb(null, data)
    }
  })
}

describe('lambda functions', () => {
  describe('lambdaGetAllProjects', () => {
    it('allAccessPassword should grant access', done => {
      lambdaExecute('projects', {}, 'test1', function(err, data) {
        assert.equal(data.statusCode, 200)
        done()
      })
    })
  })

  describe('lambdaGetProjectDetails', () => {
    it('allAccessPassword should grant access', done => {
      const params = {
        projectId: 'jsonplaceholder'
      }

      lambdaExecute('projectDetails', params, 'test1', function(err, data) {
        assert.equal(data.statusCode, 200)
        done()
      })
    })

    it('project specific password should grant access', done => {
      const params = {
        projectId: 'jsonplaceholder'
      }

      lambdaExecute('projectDetails', params, 'testjson', function(err, data) {
        assert.equal(data.statusCode, 200)
        done()
      })
    })

    it('should fail if none is set', done => {
      lambdaExecute(
        'projectDetails',
        {
          projectId: 'jsonplaceholder'
        },
        null,
        function(err, data) {
          assert.equal(data.statusCode, 500)
          done()
        }
      )
    })
  })

  describe('lambdaPostRunTest', () => {
    it('allAccessPassword should grant access', done => {
      const params = {
        projectId: 'jsonplaceholder',
        testId: 'users'
      }

      lambdaExecute('runTest', params, 'test1', function(err, data) {
        assert.equal(data.statusCode, 200)
        done()
      })
    })

    it('project specific password should grant access', done => {
      const params = {
        projectId: 'jsonplaceholder',
        testId: 'users'
      }

      lambdaExecute('runTest', params, 'testjson', function(err, data) {
        assert.equal(data.statusCode, 200)
        done()
      })
    })

    it('should fail if none is set', done => {
      lambdaExecute(
        'runTest',
        {
          projectId: 'jsonplaceholder',
          testId: 'users'
        },
        null,
        function(err, data) {
          assert.equal(data.statusCode, 500)
          done()
        }
      )
    })
  })
})
