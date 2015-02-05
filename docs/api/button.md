This object represents a Button connected to the Physical UI server.

# Methods

## Singleton Methods

### create

Returns an object for the button matching the given `id`.

```javascript
var myButton = radiodan.button.create('mine');
```

## Instance Methods

None.

# Events
### hold

Emitted when the button has been held down for an amount of time, as set in the
Physical UI server. You can also set repeat rates there.

```javascript
myButton.on('hold', function() {
  console.log('This person won\'t let go of me');
});
```

### press

Emitted when the button is pressed.

```javascript
// fetch button using id
myButton.on('press', function() {
  console.log('Hey, nice pressure!');
});
```

### release

Emitted when the button is released, after a press.

```javascript
myButton.on('release', function() {
  console.log('...and relax.');
});
```
