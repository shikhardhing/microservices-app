import { applyPatch } from 'fast-json-patch'
import { request } from 'request'
import { readFileSync, createWriteStream } from 'fs'
import { resolve, join } from 'path'

import resizeImage from '../utils/utils.js'

/**
 * POST /patch
 * This function returns updated JSON document after performing given operations
 * @name Patch
 * @param {object} req
 * @param {object} res
 * @param {function} next
 * @return {json} updated JSON document
 */
exports.patch = (req, res, next) => {
  if (typeof req.body.document !== 'undefined' && typeof req.body.operation !== 'undefined') {
    let document = req.body.document
    let operation = req.body.operation
    try {
      let output = applyPatch(document, operation).newDocument
      res.json(output)
    } catch (err) {
      err.statusCode = 400
      next(err)
    }
  } else {
    let err = new Error()
    err.statusCode = 400
    err.message = 'JSON document or patch is missing'
    next(err)
  }
}
/**
 * POST /thumbnail
 * This function returns thumbnail of 50*50 pixel of given image
 * @name Thumbnail
 * @param {object} req public URL of image
 * @param {object} res 50*50 pixel thumbnail image
 * @param {function} next
 */
exports.thumbnail = (req, res, next) => {
  if (typeof req.query.url !== 'undefined') {
    let imageUrl = req.query.url
    request
    .head(imageUrl)
    .on('response', (response) => {
      let contentHeader = response.headers['content-type']
      let contentType = contentHeader.substring(0, 5)
      let imgFormat = contentHeader.substring(6)
      if (response.statusCode === 200 && contentType === 'image') {
        if (response.headers['content-length'] <= 100 * 1024 * 1024) {
          let appRoot = resolve('.')
          let date = Math.floor(new Date())
          const imgLocation = resolve(join(appRoot, 'dist')) + '/data/img_' + date + '.' + imgFormat
          const thumbnailLocation = resolve(join(appRoot, 'dist')) + '/data/thumbnail_' + date + '.' + imgFormat
          let stream = request.get(imageUrl).pipe(createWriteStream(imgLocation))
          stream.on('finish', () => {
            resizeImage(imgLocation, thumbnailLocation, (err, out) => {
              if (err) {
                err.statusCode = 400
                next(err)
              } else {
                res.writeHead(200, {'content-type': contentHeader, 'Connection': 'close'})
                res.end(readFileSync(thumbnailLocation), 'binary')
              }
            })
          })
        } else {
          let err = new Error()
          err.statusCode = 400
          err.message = 'Image size exceeds 100MB'
          next(err)
        }
      } else {
        let err = new Error()
        err.statusCode = 400
        err.message = 'Image not found'
        next(err)
      }
    }).on('error', (err) => {
      err.statusCode = 400
      next(err)
    })
  } else {
    let err = new Error()
    err.statusCode = 400
    err.message = 'No URL found'
    next(err)
  }
}
