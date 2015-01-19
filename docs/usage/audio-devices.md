The audio device handles volume control at the sound server level.

# Why two ways of changing volume?

We wanted to have the most flexability possible when determining how to build
you radio experience. Players each have their own volume, and can potentially
be played out off different audio devices. If you only have one player in your
Radiodan setup, you might prefer to just use the `player`'s `volume` command, as
we've found it to be slightly quicker in responding than the system audio.

# Usage Example

The `volume` command has the same response and signature as the
[`player`](../api/player.md#volume) object. Volume level is expressed as an
integer percentage *(0-100)*. You can set the volume using either an absolute
value, or a differential.

```javascript
// create device object
var audioDevice = Device.create();

// set to 90%
audioDevice.volume({value: 90});

// lower by 20%
audioDevice.volume({diff: -20});

// raise by 10%
audioDevice.volume({diff: 10});
```

See the [API](../api/audio.md) for more details.
