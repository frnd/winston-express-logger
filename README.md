
# winston-express-logger
> Winston express request logger middleware

HTTP request logger middleware for Express using winston.

Creates a logger in the request that will add an ID to each logs to be able to trace
all log messages that comes from the same request.

## Install

Note: this module is not published on npm so you have to use the github url.

```sh
$ npm install --save https://github.com/frnd/winston-express-logger.git
```

## Usage

```js
var winston = require('winston');
var express = require('express');
var winstonExpressLogger = require('winston-express-logger');

// Initialize express app
var app = express();

// Add the request logger.
app.use(winstonExpressLogger.create(logger));
```

Now in the express request object you will have a logger you can use like the winston logger:

```js
exports.controller = function(req, res) {
    [...]
    req.logger.info('Doing something');
    [...]
}
```
You can add a second parameter. A function that will be called to resolve some data to add to the logs. For example:

```js

var resolveData = function (req){
  return {userId: req.userId};
};

app.use(winstonExpressLogger.create(logger, resolveData));
```

## License

MIT © [Fernando González](https://github.com/frnd)
