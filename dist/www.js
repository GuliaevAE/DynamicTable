#!/usr/bin/env node
'use strict';

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = require('debug')('crud:server');


var server = _http2.default.createServer(_app2.default);

var normalizePort = function normalizePort(val) {
  return _lodash2.default.toSafeInteger(val);
};

var port = normalizePort(process.env.PORT || '3000');
_app2.default.set('port', port);

var onError = function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

var onListening = function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
};

server.listen(port).on('error', onError).on('listening', onListening);