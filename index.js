var lock = require('pointer-lock')
  , fullscreen = require('fullscreen')
  , through = require('through')
  , min = Math.min
  , max = Math.max

module.exports = trap

function trap(element) {
  var pointer = lock(element)
    , output = through(write)
    , pos = output.pos = {}

  output.trapped = false

  element.style.cursor = 'none'
  element.addEventListener('mousemove', function(e) {
    if (output.trapped) return
    pos.x = min(max(0, e.offsetX), element.clientWidth)
    pos.y = min(max(0, e.offsetY), element.clientHeight)
    output.queue(pos)
  })

  element.addEventListener('click', function(e) {
    if (output.trapped) return
    pos.x = e.offsetX
    pos.y = e.offsetY
    pointer.request()
  })

  pointer.on('attain', function(movements) {
    output.trapped = true
    movements.pipe(output, { end: false })
  })

  pointer.on('release', function() {
    output.trapped = false
  })

  pointer.on('error', function(e) {
    output.trapped = false
  })

  // workaround for browsers which only
  // allow pointer lock in fullscreen mode.
  pointer.on('fullscreen', function() {
    var fs = fullscreen(element)
    fs.once('attain', function() {
      pointer.request()
    }).request()
  })

  function write(move) {
    pos.x += move.dx
    pos.y += move.dy
    pos.x = min(max(pos.x, 0), element.clientWidth)
    pos.y = min(max(pos.y, 0), element.clientHeight)
    this.queue(pos)
  }

  return output
}
