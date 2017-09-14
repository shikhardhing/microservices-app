import { sign, verify } from 'jsonwebtoken'

/**
 * POST /login
 * This function returns a signed JWT token based on the given username
 * @name Login
 * @param {object} req
 * @param {object} res
 * @param {function} next
 * @return {json} signed JWT token, {token: JWT_TOKEN}
 */
exports.login = (req, res, next) => {
  if (typeof req.body.username !== 'undefined' && typeof req.body.password !== 'undefined') {
    let token = sign({ 'username': req.body.username }, 'shhhhh')
    res.json({token: token})
  } else {
    let err = new Error()
    err.statusCode = 400
    err.message = 'Missing username/password'
    next(err)
  }
}

/**
 * POST /login
 * This function verifies token
 * @name Login
 * @param {object} req
 * @param {object} res
 * @param {function} next
 */
exports.authorize = (req, res, next) => {
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
    let token = req.headers.authorization.split(' ')[1]
    verify(token, 'shhhhh', (err, decoded) => {
      if (err) {
        err.statusCode = 401
        next(err)
      } else {
        req.username = decoded.username
        next()
      }
    })
  } else {
    let err = new Error()
    err.statusCode = 400
    err.message = 'Missing or invalid headers'
    next(err)
  }
}
