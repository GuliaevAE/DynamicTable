'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _corser = require('corser');

var _corser2 = _interopRequireDefault(_corser);

var _mongoose = require('./mongoose');

var _record = require('./routes/record');

var _record2 = _interopRequireDefault(_record);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

_mongoose.db.once('open', function () {
  app.use((0, _morgan2.default)('dev')).use(_bodyParser2.default.json()).use(_bodyParser2.default.urlencoded({ extended: true })).use(_corser2.default.create({ methods: _corser2.default.simpleMethods.concat(["PUT", "DELETE"]) })).use('/api/records', _record2.default).use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  }).use(function (err, req, res) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
  });
}).on('error', console.error.bind(console, 'connection error:'));

exports.default = app;