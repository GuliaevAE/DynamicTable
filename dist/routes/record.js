'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _record2 = require('../schema/record');

var _record3 = _interopRequireDefault(_record2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/', function (req, res) {
  return _record3.default.find(function (err, records) {
    return res.json(records);
  });
}).put('/', function (req, res) {
  return new _record3.default(req.body).save(function (err, _record) {
    return res.json(_record);
  });
}).get('/:id', function (req, res) {
  return _record3.default.findById(req.params.id, function (err, record) {
    return res.json(record);
  });
}).delete('/:id', function (req, res) {
  return _record3.default.remove({ _id: req.params.id }, function (err) {
    return err ? res.json(err) : res.json(true);
  });
}).post('/:id', function (req, res) {
  return _record3.default.findByIdAndUpdate(req.params.id, req.body, function (err, _record) {
    return res.json(_record);
  });
});

exports.default = router;