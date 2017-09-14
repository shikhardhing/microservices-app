import jimp from 'jimp'

exports.resizeImage = (input, output, callback) => {
  jimp.read(input)
  .then((img) => {
    img.resize(50, 50)
    .write(output, (err) => {
      if (err) {
        callback(err, null)
      }
      callback(null, output)
    })
  })
  .catch((err) => {
    callback(err, null)
  })
}
