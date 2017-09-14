'use strict';

var _jsonwebtoken = require('jsonwebtoken');

/**
 * POST /login
 * This function returns a signed JWT token based on the given username
 * @name Login
 * @param {object} req
 * @param {object} res
 * @param {function} next
 * @return {json} signed JWT token, {token: JWT_TOKEN}
 */
exports.login = function (req, res, next) {
  if (typeof req.body.username !== 'undefined' && typeof req.body.password !== 'undefined') {
    var token = (0, _jsonwebtoken.sign)({ 'username': req.body.username }, 'shhhhh');
    res.json({ token: token });
  } else {
    var err = new Error();
    err.statusCode = 400;
    err.message = 'Missing username/password';
    next(err);
  }
};

/**
 * POST /login
 * This function verifies token
 * @name Login
 * @param {object} req    
 * @param {object} res
 * @param {function} next
 */
exports.authorize = function (req, res, next) {
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
    var token = req.headers.authorization.split(' ')[1];
    (0, _jsonwebtoken.verify)(token, 'shhhhh', function (err, decoded) {
      if (err) {
        err.statusCode = 401;
        next(err);
      } else {
        req.username = decoded.username;
        next();
      }
    });
  } else {
    var err = new Error();
    err.statusCode = 400;
    err.message = 'Missing or invalid headers';
    next(err);
  }
};