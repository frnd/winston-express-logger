/*jslint node: true */
'use strict';

var assert = require('assert');
var connect = require('connect');
var winston = require('winston');
var util = require('util');
var request = require('supertest');
var requestLogger = require('../lib');

// Create a test transport that will be used for test the logger.
var TestTransport = function() {};
util.inherits(TestTransport, winston.Transport);
TestTransport.prototype.name = 'TestTransport';
TestTransport.prototype.log = function(level, msg, meta, done) {
  done(null);
};

winston.add(TestTransport);
winston.remove(winston.transports.Console);

describe('winston-express-logger', function() {
  it('should create a logger in the request', function(done) {

    // Bootstrap our environment
    var app = connect();

    // Instantiate our Winston logger as middleware.
    app.use(requestLogger.create(winston));

    // Add a special middleware to test the request has the logger object.
    app.use(function(req, res, next) {
      // check logger exist in the request
      return req.logger ? next() : next(new Error('The logger object is not pressent in the request.'));
    });

    // Use Connect's static middleware so we can make a dummy request.
    app.use(connect.static(__dirname));

    // Make our dummy request.
    request(app)
      .get(__filename.replace(__dirname, ''))
      .expect(200, done);
  });

  it('should log the request', function(done) {

    // Complete the test in the transport
    TestTransport.prototype.log = function(level, msg, meta, callback) {
      assert.equal(msg, 'End request', 'Incorrect message');
      assert.equal(meta.method, 'GET', 'Incorrect method');
      assert.equal(meta.url, '/index.js', 'Incorrect path');
      assert(meta.requestId, 'No request Id');
      callback(null);
      done(null);
    };

    // Bootstrap our environment
    var app = connect();

    // Instantiate our Winston logger as middleware.
    app.use(requestLogger.create(winston));

    // Use Connect's static middleware so we can make a dummy request.
    app.use(connect.static(__dirname));

    // Make our dummy request.
    request(app)
      .get(__filename.replace(__dirname, ''))
      .end(function(err) {
        if (err) {
          done(err);
        }
      });
  });

  it('should add use the resolver to obtain data from the request', function(done) {

    // Complete the test in the transport
    TestTransport.prototype.log = function(level, msg, meta, callback) {
      assert.equal(msg, 'End request', 'Incorrect message');
      assert.equal(meta.method, 'GET', 'Incorrect method');
      assert.equal(meta.url, '/index.js', 'Incorrect path');
      assert.equal(meta.userId, 'AAA', 'Problem resolving data from request.');
      assert(meta.requestId, 'No request Id');
      callback(null);
      done(null);
    };

    // Bootstrap our environment
    var app = connect();

    // Imagine we have a middelware that validates a user.
    app.use(function(req, res, next) {
      req.userId = 'AAA';
      next();
    });

    // Instantiate our Winston logger as middleware.
    app.use(requestLogger.create(winston, function(req) {
      return {
        userId: req.userId
      };
    }));

    // Use Connect's static middleware so we can make a dummy request.
    app.use(connect.static(__dirname));

    // Make our dummy request.
    request(app)
      .get(__filename.replace(__dirname, ''))
      .end(function(err) {
        if (err) {
          done(err);
        }
      });
  });

  it('should add an unique id for each request', function(done) {
    var requestId;
    // Complete the test in the transport
    TestTransport.prototype.log = function(level, msg, meta, callback) {
      assert(meta.requestId, 'No request Id');
      callback(null);
      if (!requestId) {
        requestId = meta.requestId;
      } else {
        assert.notEqual(requestId, meta.requestId, 'Same requestId for 2 different reques.');
        done(null);
      }
    };

    // Bootstrap our environment
    var app = connect();

    // Instantiate our Winston logger as middleware.
    app.use(requestLogger.create(winston));

    // Use Connect's static middleware so we can make a dummy request.
    app.use(connect.static(__dirname));

    // Make our 2 dummy request.
    request(app)
      .get(__filename.replace(__dirname, ''))
      .end(function(err) {
        if (err) {
          done(err);
        }
      });
    request(app)
      .get(__filename.replace(__dirname, ''))
      .end(function(err) {
        if (err) {
          done(err);
        }
      });
  });

  // Test logger on the request.

  it('should log with a non parametrized message');

  it('should log with a parametrized message');

  it('should log with a parametrized message and metadata');

  it('should log with a parametrized message, metadata and a callback');

  it('should log with a non parametrized message and a callback');

  // Test additional utility methods.

  it('should profle');

  it('should startTimeout');
});
