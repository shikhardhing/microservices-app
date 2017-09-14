'use strict';

var _jimp = require('jimp');

var _jimp2 = _interopRequireDefault(_jimp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.resizeImage = function (input, output, callback) {
  _jimp2.default.read(input).then(function (img) {
    img.resize(50, 50).write(output, function (err) {
      if (err) {
        callback(err, null);
      }
      callback(null, output);
    });
  }).catch(function (err) {
    callback(err, null);
  });
};