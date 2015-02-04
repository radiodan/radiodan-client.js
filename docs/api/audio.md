The Audio Device handles volume changes at a sound-server level. See the
Radiodan server documentation for details of supported sound servers.

# Methods

## Singleton Methods

### create

Returns the audio device for the Radiodan server.

```javascript
var audio = radiodan.device.create();
```

## Instance Methods

###volume

Updates the volume for the audio device. Volume can be an absolute or relative
amount. Volume is expressed as an integer percentage. Triggers an event if
volume level is altered.

```javascript
// set to 90%
audio.volume({value: 90});

// lower by 20%
audio.volume({diff: -20});

// raise by 10%
audio.volume({diff: 10});
```
