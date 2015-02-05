Player objects control playlists and how they are played.

# Attributes

## id
ID of the player. Used internally to route messages to each player.

## name
Human-readable name for the player.

# Methods

## Singleton Methods
###discover

Returns a promise to be resolved with an array of player objects, each
representing a player available on the radiodan server.

```javascript
Player.discover().then(function(players) {
  console.log(players.length); // 3
});
```

###get

Returns a player instance connected to a player with the exact same
id on the server.

```javascript
var mainPlayer = radiodan.player.get('main-player');
```

Note that at this stage, player objects are always returned from this method,
even if the player id does not match anything currently available on the server.
If you do not know the id of the player you are looking for, use the
[`discover`](#discover) method instead.

## Instance Methods
###add

Adds array of file paths to the current playlist. This will trigger a `playlist`
event once the server adds the tracks successfully. Returns a promise resolving
on command acceptance.

```javascript
player.add({playlist: ['track1.mp3', 'track2.mp3']});
```

Including `clear: true` to the object will clear the current playlist before
adding the tracks.

###clear

Empties the current playlist. Will trigger a `playlist` event if the playlist
was non-empty. Will trigger a `player` event if player was currently playing
items off the playlist. Returns a promise resolving on command acceptance.

```javascript
player.clear();
```

###load

Loads a named playlist in to the player. Will replace the current playlist if
successful. Playlists are stored in the Radiodan server's `playlists` directory,
as specified in it's configuration. Triggers a `playlist` event on successful
execution.

```javascript
player.load('bbc_radio_four.m3u'); //matches /playlists/bbc_radio_four.m3u
```

Remote playlists can be loaded over http.

```javascript
player.load('http://example.com/playlist.m38u');
```

###next

Moves the player to the next item in the current playlist. The definition of the
next item is dependent on the `random` and `repeat` states of the player.

```javascript
player.next();
```

Note that the returned promise will always resolve when the command is accepted
by the server, even if the playlist is currently empty. If the player's position
in the playlist is altered, a `playlist` event will be triggered.

###pause

Set the pause state of the player. If paused, the player can be restarted using
the (`play`)[#play] method, too. Triggers a `player` event.

```javascript
player.pause({value: true});
```

Note that a value must be set in the arguments for the command to be valid.

###play

Start the player playing. If the player is playing already, the command will
resolve as a no-op. The promise will still resolve on command acknowledgement.

```javascript
player.play();
```

The player will play from it's current position in the playlist. If you want a
specific position, specify it in the arguments.

```javascript
player.play({position: 2});
```

If the player state is altered as a result of the command, a `player` event will
be triggered.

###previous

Moves the player to the previous item in the current playlist. The definition of
the previous item is dependent on the `random` and `repeat` states of the
player.

```javascript
player.previous();
```

Note that the returned promise will always resolve when the command is accepted
by the server, even if the playlist is currently empty. If the player's position
in the playlist is altered, a `playlist` event will be triggered.

###random

Sets the random state of the player. This will effect the way the player
iterates through the items of the playlist.

```javascript
player.random({value: true});
```

If the random setting has been changed, a `player` event will be triggered.

###remove

Deletes items from the current playlist.

```javascript
// remove track from position 2
player.remove({position: 2});

// remove first 10 tracks
player.remove({start: 0, end: 9});
```

Triggers a `playlist` event if items are removed. May trigger a `player` event
if the player no longer has playlist items to play.

**TODO: What if the current item in the playlist is removed?**

###repeat
Sets the repeat state of the player. This will effect the way the player
responds to reaching the end of the current playlist.

```javascript
player.repreat({value: true});
```

If the repeat setting has been changed, a `player` event will be triggered.

###search

Query the database for matching items. Matches can be partial. Queries are case insensitive.

####Available search terms

* `any` *(matches any of the following terms)*
* `album`
* `artist`
* `comment`
* `composer`
* `date`
* `disc`
* `filename`
* `genre`
* `name`
* `performer`
* `title`
* `track`

```javascript
player.search({artist: 'sleater-kinney'});

// search for all tracks with the word "Funk" in their metadata
player.search({any: 'funk'});
```

These search commands return an array of matching objects, which include
track metadata and file path of each item.

The path can be used to enqueue found tracks to a playlist. If no matches are
found, the promise will be accepted but with an empty array. Only malformed
search requests are rejected by the server.

```javascript
// searches for all tracks by artist then appends to playlist
player.search({artist: 'Chumped'}).then(
  function(matches) {
    var playlist = matches.map(function(m) { return m.file; });

    return player.add({playlist: playlist});
  }
);
```

###seek

Move the player head to an absolute or relative time. These commands will trigger a `player` event on completion.

```javascript
// play from 90 seconds into current track
player.seek({time: 90});

// play from 5 seconds into track in playlist position 3
player.seek({time: 5, position: 3});

// skip back 10 seconds from current time
player.seek({time: '-10'});
```

###status
**TODO: What is this? Do we use it for anything?**

###stop

Stops playback. If previously playing, this command will trigger a `player`
event.

```javascript
player.stop();
```

###updateDatabase

Triggers an update of the player's internal music database. The returned promise
will resolve as soon as the command is accepted. The following events may
trigger (in this order):

1. `database.update.start` - Scanning has begun.
2. `database.modified` - Updates to the database have been found *(triggers at most once
   per update)*.
3. `database.update.end` - Scanning has completed.

```javascript
player.updateDatabase();
```

###volume

Updates the volume for the player object. Volume can be an absolute or relative
amount. Volume is expressed as an integer percentage. Triggers a `volume` event
if volume level is altered.

```javascript
// set to 90%
player.volume({value: 90});

// lower by 20%
player.volume({diff: -20});

// raise by 10%
player.volume({diff: 10});
```

**Note**: Multiple players can play simultaneously from the same audio device. This
command does not effect the other players in the system. For a global volume
change, see the [audio device API](audio.md).

# Events
**TODO: Add example output**

###database.modified

Returns statistics on the contents of the music database. Typically triggered by
an [updateDatabase](#updatedatabase) command, when the update discovers new data.

###database.update.start

Returns an empty object. Notifies that a database update has begun.

###database.update.end

Returns an empty object. Notifies that a database update has completed.

###player

Returns the state of the player (random, play state, current position in
playlist).

###playlist

Returns the contents of the current playlist.

###volume

Returns the volume of the player. Note that this is not the volume of the
physical device, each player has it's own volume level. See the [audio device
API](audio.md) for device-level volume.
