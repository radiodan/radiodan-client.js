This object represents a [Rotary Encoder][1] connected to the Physical UI
server.

# Methods

## Singleton Methods

### create

Returns an object for the Rotary Encoder matching the given `id`.

```javascript
var volumeKnob = radiodan.rotaryEncoder.create('volume');
```

## Instance Methods

None.

# Events

### turn

Emits when the Rotary Encoder has been turned. An argument object is emitted
containing the direction of rotation.

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

[1]: http://en.wikipedia.org/wiki/Rotary_encoder
