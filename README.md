# pointer-trap #

A "niche" wrapper for [chrisdickinson](http://github.com/chrisdickinson)'s
[pointer-lock](http://npmjs.org/package/pointer-lock) module.

If you've ever played a windowed game, and the pointer isn't locked within the
screen, you *may* occasionally click outside the window by mistake. This is
super annoying if it happens in a tight spot, so here's a drop-in fix for the
problem.

## Installation ##

``` bash
npm install pointer-trap
```

## Usage ##

### `stream = require('pointer-trap')(element)` ###

Returns a readable stream, which emits the current position of the mouse
(relative to the `element` you've attached it to). The user can click on the
element to enable pointer lock - when not trapped, the stream will fall back to
the data it can get from the element's `mousemove` event.

### `stream.on('data', callback)` ###

Emitted periodically, passing `stream.pos` to the callback.

### `stream.on('attain', callback)` ###

Called each time the pointer is trapped.

### `stream.on('release', callback)` ###

Called when each time the pointer is released.

### `stream.pos` ###

The current position of the mouse, as of the last update. If you're using a
game loop, you'll get better results reading it directly this way.

### `stream.trapped` ###

A boolean value, set to true when the pointer is trapped.

``` javascript
var canvas = document.createElement('cavas')
var trap = require('pointer-trap')(canvas)
var ticker = require('ticker')(60, canvas)
var x = 0
var y = 0

// either on tick...
ticker.on('tick', function() {
  x = trap.pos.x
  y = trap.pos.y
})

// or on capture...
trap.on('data', function(pos) {
  x = pos.x
  y = pos.y
})

var ctx = canvas.getContext('2d')
ticker.on('draw', function() {
  canvas.width  = window.innerWidth
  canvas.height = window.innerHeight
  ctx.fillStyle = trap.trapped ? '#0f0' : '#f00'
  ctx.fillRect(x - 4, y - 4, 8, 8)
})
```
