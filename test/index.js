/*jslint node: true */
'use strict';

var assert = require('assert');
var connect = require('connect');
var winston = require('winston');
var request = require('supertest');
var requestLogger = require('../lib');

describe('winston-express-logger', function() {
  it('should create a logger in the request', function(done) {

    // Bootstrap our environment
    var logger = new(winston.Logger)({
      transports: [
        new(winston.transports.Console)()
      ]
    });
    var app = connect();

    // Instantiate our Winston logger as middleware.
    app.use(requestLogger.create(logger));

    // Add a special middleware to test the request has the logger object.
    app.use(function(req, res, next) {
      // TODO check logger exist in the request
      // TODO check logger type
      next();
    });

    // Use Connect's static middleware so we can make a dummy request.
    app.use(connect.static(__dirname));

    // Make our dummy request.
    request(app)
      .get(__filename.replace(__dirname, ''))
      .end(function(err) {
        done(err);
      });
  });

  it('should log using the logger in the request', function(done) {

    // Bootstrap our environment
    var logger = new(winston.Logger)({
      transports: [
        new(winston.transports.Console)()
      ]
    });
    var app = connect();

    // Instantiate our Winston logger as middleware.
    app.use(requestLogger.create(logger));

    // Add a special middleware to test the request has the logger object.
    app.use(function(req, res, next) {
      req.logger.info('a message');
      next();
    });

    // Use Connect's static middleware so we can make a dummy request.
    app.use(connect.static(__dirname));

    // Winston emits a `logged` event, so we will listen for when our
    // middleware actual logs the event so we can test it.
    logger.once('logged', function(level, message, data) {
      //TODO
      console.log("A logged event", data);
    });

    // Make our dummy request.
    request(app)
      .get(__filename.replace(__dirname, ''))
      .end(function(err) {
        done(err);
      });
  });

  it('should add an unique id for each request', function(done) {
    // TODO
    done();
  });
});
