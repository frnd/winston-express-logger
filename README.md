# winston-express-logger 
> Winston express request logger middleware


## Install

```sh
$ npm install --save winston-express-logger
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



## License

MIT © [Fernando González](https://github.com/frnd)
