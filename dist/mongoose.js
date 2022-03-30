'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.db = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.connect('mongodb://localhost/crud');

var db = exports.db = _mongoose2.default.connection.on('error', console.error.bind(console, 'connection error:'));

exports.default = _mongoose2.default;