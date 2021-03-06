These concepts are consistent throughout the client library. For your safety and
convenience, it would be useful to understand how the library works before
getting started on your project.

# Commands

All Commands send data over to the server for processing, they are inherently
asynchronous. They use [promises][1].

## Valid Commands

If you command is well-formed, your promise will be resolved. Certain commands
return a response data value, e.g. the `search` command on player.

```javascript
player.search({artist: "Streetlight Manifesto"}).then(
  function(matches) {
    console.log(matches); // array of matching tracks
  }
);
```

Other commands are non-determinative __(?)__, for which there is no consistent
response. In these cases, the promise is resolved when the command has been
accepted as valid, but you will need to listen for the relevant
[events](#events) to see the effect the command has had on the system.

## Invalid Commands

Oh no! You sent out a command, but it wasn't what the server was hoping for.
These commands will result in a rejected promise. The promise will be rejected
with an error object, so you can see what went wrong.

```javascript
// this command uses invalid arguments
player.add("track.mp3").then(
  function() {
    console.log("everything is fine");
  },
  function(err) {
    console.log("couldn't add track", err);
  }
);

//= couldn't add track {err: 'Invalid format'}
```

# Events

When changes happen in the server, events are emitted that relay the change in
state. Events typically occur in response to:

* a command you have sent
* a command someone else sent
* an internal event in the system _(e.g. a new track is being played,
  player stops at the end of a playlist)_

If you want to keep track of the state of the system, listening to events is the
best approach. The event list for each object is in the API.

```javascript
player.on('player.state', function(state) {
  console.log(state); // 'playing'
});
```

[1]: http://www.html5rocks.com/en/tutorials/es6/promises
