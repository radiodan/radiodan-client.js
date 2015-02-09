This object represents an [RGB LED][1] connected to the Physical UI
server.

# Methods

## Singleton Methods

### create

Returns an object for the LED matching the given `id`.

```javascript
var statusRGB = radiodan.RGBLED.create('status');
```

## Emit Options

All the instance methods accept either a single or array of emit options. The
options are a plain Javascript object, with the following keys:

### colour

The colour of the light you would like emitted. Colours are represented as an
array of RGB colours, from 0-255. When all colours at 0, the LED will be unlit.

### transition

An object that expresses how to move from the current state to this new one. The
default is to imeediately wipe out the current state. The transition object
includes:

#### duration

The length of time for the duration to last, in miliseconds.

#### yoyo

Whether this transition should be looped indefinitely (or, atleast, until
another transition wipes it out). Accepts a boolean.

#### Easing

The Physical UI supports the full range of [easing
functions](http://easings.net/). Accepts a string that matches an easing
function.

## Instance Methods

### emit

Alters the state of the LED. This will be accepted and immediately executed in
place of the previous state. The promise will resolve if accepted by the
Physical UI server, or else it will be rejected.

```javascript
statusRGB.emit({
  colour: [255, 0, 128], // RGB colour
  transition: {
    duration: 1000, // in ms
    yoyo: true, // boolean
    easing: 'easingFuncName' // from this list http://easings.net/
  }
});
```

### change

Sets up multiple LED transitions, to be executed one after the other. Accepts an
array of emit objects.

```javascript
statusRGB.change({
  queue: [
    // emit blue over one second
    {
      colour: [0, 0, 255],
      transition: {
        duration: 1000
      }
    },
    // then emit red using default transitions (or instantly)
    {
      colour: [255, 0, 0],
    }
  ]
});
```

# Events

None.

[1]: http://blog.adafruit.com/2012/11/30/tutorial-arduino-lesson-3-rgb-leds-arduino/
