'use strict';

var _fastJsonPatch = require('fast-json-patch');

var _request = require('request');

var _fs = require('fs');

var _path = require('path');

var _utils = require('../utils/utils.js');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * POST /patch
 * This function returns updated JSON document after performing given operations
 * @name Patch
 * @param {object} req
 * @param {object} res
 * @param {function} next
 * @return {json} updated JSON document
 */
exports.patch = function (req, res, next) {
  if (typeof req.body.document !== 'undefined' && typeof req.body.operation !== 'undefined') {
    var document = req.body.document;
    var operation = req.body.operation;
    try {
      var output = (0, _fastJsonPatch.applyPatch)(document, operation).newDocument;
      res.json(output);
    } catch (err) {
      err.statusCode = 400;
      next(err);
    }
  } else {
    var err = new Error();
    err.statusCode = 400;
    err.message = 'JSON document or patch is missing';
    next(err);
  }
};
/**
 * POST /thumbnail
 * This function returns thumbnail of 50*50 pixel of given image
 * @name Thumbnail
 * @param {object} req public URL of image
 * @param {object} res 50*50 pixel thumbnail image
 * @param {function} next
 */
exports.thumbnail = function (req, res, next) {
  if (typeof req.query.url !== 'undefined') {
    var imageUrl = req.query.url;
    console.log(imageUrl);
    _request.request.head(imageUrl).on('response', function (response) {
      var contentHeader = response.headers['content-type'];
      console.log(contentHeader);
      var contentType = contentHeader.substring(0, 5);
      var imgFormat = contentHeader.substring(6);
      if (response.statusCode === 200 && contentType === 'image') {
        if (response.headers['content-length'] <= 100 * 1024 * 1024) {
          var appRoot = (0, _path.resolve)('.');
          console.log(appRoot);
          var date = Math.floor(new Date());
          var imgLocation = (0, _path.resolve)((0, _path.join)(appRoot, 'dist')) + '/data/img_' + date + '.' + imgFormat;
          var thumbnailLocation = (0, _path.resolve)((0, _path.join)(appRoot, 'dist')) + '/data/thumbnail_' + date + '.' + imgFormat;
          var stream = _request.request.get(imageUrl).pipe((0, _fs.createWriteStream)(imgLocation));
          stream.on('finish', function () {
            (0, _utils2.default)(imgLocation, thumbnailLocation, function (err, out) {
              if (err) {
                err.statusCode = 400;
                next(err);
              } else {
                res.writeHead(200, { 'content-type': contentHeader, 'Connection': 'close' });
                res.end((0, _fs.readFileSync)(thumbnailLocation), 'binary');
              }
            });
          });
        } else {
          var err = new Error();
          err.statusCode = 400;
          err.message = 'Image size exceeds 100MB';
          next(err);
        }
      } else {
        var _err = new Error();
        _err.statusCode = 400;
        _err.message = 'Image not found';
        next(_err);
      }
    }).on('error', function (err) {
      err.statusCode = 400;
      next(err);
    });
  } else {
    var err = new Error();
    err.statusCode = 400;
    err.message = 'No URL found';
    next(err);
  }
};