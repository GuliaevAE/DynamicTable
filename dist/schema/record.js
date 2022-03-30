"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require("../mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _record = new _mongoose2.default.Schema({
  data: _mongoose2.default.Schema.Types.Mixed
});

var record = _mongoose2.default.model('Record', _record);

exports.default = record;