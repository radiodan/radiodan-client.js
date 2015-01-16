What good is a radio without being able to hear anything? Player objects manage
what content is played out from the server and when. The content is managed
using playlists, which the player can manipulate.

## Players

In the following examples, assume the Radiodan client has been required using:

```javascript
var radiodan = require('radiodan-client');
```

### Creation & Discovery

The Radiodan server creates the players for you to interact with. The server
allows you to create as many as you need, and you can name them however you
like.

If you know the `id` of the player you want to connect to, use the `get()`
method.

```javascript
var player = radiodan.player.get('idOfPlayer');
```

If you don't know what players are available, you can find them using the
`discover()` method.

```javascript
radiodan.player.discover().then(function(players) {
  console.log(players); // [ playerObjects ]
});
```

### Searching for content

## Playlists

From this point on, assume a player has been instantiated using:

```javascript
var player = radiodan.player.get('idOfPlayer');
```

Everything a Radiodan player plays is loaded via a playlist. You can add to an
existing playlist, or load one you've made or found elsewhere.

### Adding content to a playlist

The player can add content either local to the server:

```javascript
player.add({ playlist: ['newtrack.mp3'] });
```

Or, a remote location:

```javascript
player.add({
  playlist: ['http://downloads.bbc.co.uk/podcasts/radio4/iot/iot_20141218-1030a.mp3']
});
```

If you want to clear out the current playlist and replace it with this new
content, pass in the `clear` option.

```javascript
player.add({ playlist: ['newtrack.mp3'], clear: true });
```

Once your content has been loaded into a playlist, the `play()` method will
start the player off. You can chain the commands together using promises:

```javascript
player.add({ playlist: ['newtrack.mp3'] }).then(function() {
  player.play();
});
```

### Loading an existing playlist

The player will accept pre-existing playlists from the server's playlist
directory, or at a http endpoint. Playlists can be in `m3u`, `m38u` or `pls`
format. You will still have to set the player to play if it is not currently
playing.

```javascript
// load BBC Radio 1
player.load({ playlist: 'http://open.live.bbc.co.uk/mediaselector/5/select/mediaset/http-icy-aac-lc-a/vpid/bbc_radio_one/format/pls.pls' })
```

Loading a playlist will erase the current playlist in the player.

### Navigating the playlist

Now you have a playlist ready to go, the player can play, skip, seek and
otherwise move around it. Full details are in the [API](api/player) but here
are a few quick examples:

#### Skipping Around Content

#### Playing Randomly

#### Removing Tracks From Playlist

## Events

Once you've sent out a command, listen out for events in order to see the
effects your command has had on the system. For example, if you've sent out a
`next()` command, the player may:

* Move to the next track in the playlist
* Skip to a random track (if in `random` mode)
* Move to the top of the playlist (if in `repeat` mode)
* Stop because it's the end of the playlist

Because the player will accept commands from many clients at once, your command
might not result in the response you were expecting. The best way to keep up to
date is to bind an event listener to (in this case) the `player` event.

```javascript
player.on('player', function(player) {
  //TODO: Check player object format, insert here
  player.current // { track object }
  player.random  // false
  player.repeat  // true
  player.state   // 'playing'
});
```

In the case of the player event, you can bind to specific sub-states, such as
the state of the player.

```javascript
player.on('player.state', function(state) {
  console.log(state); // 'playing'
});
```

See the [API Documentation](../api/player.md#events) for a full list of events.
