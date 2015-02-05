If your Radiodan system has a Physical Interface connected (possibly using the
PCB we've produced) and the Physical UI server is running, you can send commands
and listen to the available buttons, dials, lights and other connected
interfaces using this library.

All elements of the Physical UI are accessed by supplying a `id` string to the
object's `get` method. The typical signature is `var el = Element.get('idOfThing');`

# Buttons

Buttons are the simplest element of the physical interface. All you can do is
push them!

We've established a set of events for the lifecycle of a button press:

** 1. Press **

Your finger, knuckle or other appendage has made contact with the button. Good job!

** 2. Hold **

You've pushed it and you're not letting go. The amount of time between the
`press` and `hold` event, as well as the repeating event, can be set in
the Physical UI server.

** 3. Release **

Exhausted from pressing and holding, you finally relinquish command of the
button, and let go.

```javascript
// fetch button using id
var button = Button.get('myButton');

button.on('press', function() {
  console.log('Hey, nice pressure!');
});

button.on('hold', function() {
  console.log('Getting a little uncomfortable...');
});

button.on('release', function() {
  console.log('...and relax.');
});
```

# Rotary Encoders

You can turn rotary encoders. Clockwise, anti-clockwise, you name it and they'll
twist it.  The sensitivity of the encoder can be set on the server-side, all we
can do here is wait for events.

```javascript
var volumeKnob = radiodan.rotaryEncoder.get('volume');

volumeKnob.on('turn', function(args) {
  if(args.direction === 'clockwise') {
    console.log('Crank it up!');
  } else {
    console.log('Make me softer');
  }
});
```

# RGB LEDs

An RGB LED is three coloured LEDs in one. Between them, we can create subtle
colours and turn the lights on and off. Colours are accepted as an array of
three (red, green and blue) integers, from `0-255`.

```javascript
var status = RGBLED.get('status');

/// turn on the red light
status.emit({ emit: true, colour: [255,0,0] });

// turn the light off
status.emit({ emit: false });
```

The previous example shows off how to turn the lights on and off, but it has a
flaw. The commands would be sent one after the next, meaning that you would see
maybe a flicker of red before switch off.

To counter this, we can queue actions up and specify durations, in order to get
exact control over the animation sequence.

```javascript
var status = RGBLED.get('status');

// emit red for 20 seconds, then switch off
status.change({
  queue: [
    { emit: true, colour: [255,0,0], transition: { duration: 20 } },
    { emit: false }
]});
```
