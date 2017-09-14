import { express } from 'express'
import { join } from 'path'
import { logger } from 'morgan'
import { createWriteStream } from 'fs'
import { urlencoded, json } from 'body-parser'

import api from './routes/api.js'
import user from './routes/user.js'

let app = express()

let log = join(__dirname, 'logs.log')
let accessLogStream = createWriteStream(log, {flags: 'a'})
app.use(logger('dev', {stream: accessLogStream}))

app.use(urlencoded({ extended: false }))
app.use(json())

app.post('/api/patch', [user.authorize, api.patch])
app.post('/api/thumbnail', [user.authorize, api.thumbnail])
app.post('/login', user.login)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  let err = new Error('Not Found')
  err.statusCode = 404
  next(err)
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.statusCode || 500)
  res.json({message: err.message})
})

module.exports = app
