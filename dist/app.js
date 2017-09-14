'use strict';

var _express = require('express');

var _path = require('path');

var _morgan = require('morgan');

var _fs = require('fs');

var _bodyParser = require('body-parser');

var _api = require('./routes/api.js');

var _api2 = _interopRequireDefault(_api);

var _user = require('./routes/user.js');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express.express)();

var log = (0, _path.join)(__dirname, 'logs.log');
var accessLogStream = (0, _fs.createWriteStream)(log, { flags: 'a' });
app.use((0, _morgan.logger)('dev', { stream: accessLogStream }));

app.use((0, _bodyParser.urlencoded)({ extended: false }));
app.use((0, _bodyParser.json)());

app.post('/api/patch', [_user2.default.authorize, _api2.default.patch]);
app.post('/api/thumbnail', [_user2.default.authorize, _api2.default.thumbnail]);
app.post('/login', _user2.default.login);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.statusCode = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.statusCode || 500);
  res.json({ message: err.message });
});

module.exports = app;