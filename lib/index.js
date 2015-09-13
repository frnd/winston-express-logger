/*jslint node: true */
'use strict';

var uuid = require("node-uuid");
var url = require('url');
var extend = require('extend');
var useragent = require('useragent');

function RequestLogger(logger, context) {
  var self = this;
  this.context = context;
  // Extends the this object with profile and startTimer
  ['profile', 'startTimer'].forEach(function(method) {
    self[method] = function() {
      return logger[method].apply(logger, arguments);
    };
  });
  // along with a method for log and each level in logger instance.
  ['log'].concat(Object.keys(logger.levels)).forEach(function(method) {
    self[method] = function(level, name, meta, callback) {
      return logger[method].apply(logger, [level, name, extend(meta, self.context), callback]);
    };
  });
}

function create(logger) {

  return function(req, res, next) {
    var requestEnd = res.end;
    var startTime = new Date();
    var data = {
      method: req.method,
      url: url.parse(req.originalUrl),
      ip: req.headers['x-forwarded-for'] || req.ip || req.connection.remoteAddress,
      userAgent: useragent.parse(req.headers['user-agent']).toString(),
      requestId: uuid.v1(),
    };

    //Add loger to the request
    req.logger = new RequestLogger(logger, data);

    // Proxy the real end function
    res.end = function(chunk, encoding) {

      // Do the work expected
      res.end = requestEnd;
      res.end(chunk, encoding);

      var endData = {
        responseTime: (new Date() - startTime)
      };
      endData = extend(endData, data);
      req.logger.info(endData);
    };

    next();
  };
}

module.exports = {
  create: create
};